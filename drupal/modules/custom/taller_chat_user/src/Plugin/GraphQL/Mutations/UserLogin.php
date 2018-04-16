<?php

namespace Drupal\taller_chat_user\Plugin\GraphQL\Mutations;

use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\DependencyInjection\DependencySerializationTrait;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\Core\Flood\FloodInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\user\UserAuthInterface;
use Drupal\user\UserInterface;
use Drupal\graphql\Plugin\GraphQL\Mutations\MutationPluginBase;

use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

use Youshido\GraphQL\Execution\ResolveInfo;

/**
 * Login User.
 *
 * @GraphQLMutation(
 *   id = "user_login",
 *   name = "userLogin",
 *   type = "User",
 *   secure = false,
 *   nullable = false,
 *   schema_cache_tags = {"user_login"},
 *   arguments = {
 *     "name" = "String",
 *     "password" = "String"
 *   }
 * )
 */
class UserLogin extends MutationPluginBase implements ContainerFactoryPluginInterface {
  use DependencySerializationTrait;
  use StringTranslationTrait;

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  // @TODO Create a Trait for the user's methods.

  /**
   * The user authentication.
   *
   * @var \Drupal\user\UserAuthInterface
   */
  protected $userAuth;

  /**
   * The flood controller.
   *
   * @var \Drupal\Core\Flood\FloodInterface
   */
  protected $flood;

  /**
   * The current user service.
   *
   * @var \Drupal\Core\Session\AccountInterface
   */
  protected $currentUser;

  /**
   * {@inheritdoc}
   */
  public function __construct(
    array $configuration,
    $pluginId,
    $pluginDefinition,
    EntityTypeManagerInterface $entityTypeManager,
    FloodInterface $flood,
    UserAuthInterface $user_auth,
    ConfigFactoryInterface $configFactory,
    AccountInterface $currentUser
  ) {
    $this->entityTypeManager = $entityTypeManager;
    $this->flood = $flood;
    $this->userAuth = $user_auth;
    $this->configFactory = $configFactory;
    $this->currentUser = $currentUser;

    parent::__construct($configuration, $pluginId, $pluginDefinition);
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $pluginId, $pluginDefinition) {
    return new static(
      $configuration,
      $pluginId,
      $pluginDefinition,
      $container->get('entity_type.manager'),
      $container->get('flood'),
      $container->get('user.auth'),
      $container->get('config.factory'),
      $container->get('current_user')
    );
  }

  /**
   * Logs in a user.
   *
   * @return \Drupal\user\UserInterface
   *   The newly logged user.
   */
  public function resolve($value, array $args, ResolveInfo $info) {
    return $this->login(\Drupal::request(), $args);
  }

  /**
   * Logs in a user.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *   The request.
   *
   * @param $credentials
   *   The credentials to try logging in with.
   *
   * @return \Drupal\user\UserInterface
   *   The newly logged user.
   */
  public function login(Request $request, $credentials) {
    if ($this->currentUser->isAuthenticated()) {
      throw new BadRequestHttpException($this->t('The user is logged in.'));
    }

    if (!isset($credentials['name']) && !isset($credentials['password'])) {
      throw new BadRequestHttpException($this->t('Missing credentials.'));
    }

    if (!isset($credentials['name'])) {
      throw new BadRequestHttpException($this->t('Missing user name.'));
    }

    if (!isset($credentials['password'])) {
      throw new BadRequestHttpException($this->t('Missing password.'));
    }

    $this->floodControl($request, $credentials['name']);

    if ($this->userIsBlocked($credentials['name'])) {
      throw new BadRequestHttpException($this->t('The user has not been activated or is blocked.'));
    }

    if ($uid = $this->userAuth->authenticate($credentials['name'], $credentials['password'])) {
      // If login succeeded, clean flood data.
      $this->flood->clear('user.http_login', $this->getLoginFloodIdentifier($request, $credentials['name']));
      /** @var \Drupal\user\UserInterface $user */
      $user = $this->entityTypeManager->getStorage('user')->load($uid);
      $this->userLoginFinalize($user);

      return $user;
    }

    // If login had no success, increment flood data.
    $flood_config = $this->configFactory->get('user.flood');
    if ($identifier = $this->getLoginFloodIdentifier($request, $credentials['name'])) {
      $this->flood->register('user.http_login', $flood_config->get('user_window'), $identifier);
    }
    // Always register an IP-based failed login event.
    $this->flood->register('user.failed_login_ip', $flood_config->get('ip_window'));
    throw new BadRequestHttpException($this->t('Sorry, unrecognized name or password.'));
  }

  /**
   * Gets the login identifier for user login flood control.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *   The current request.
   * @param string $name
   *   The name supplied in login credentials.
   *
   * @return string
   *   The login identifier or if the user does not exist an empty string.
   */
  protected function getLoginFloodIdentifier(Request $request, $name) {
    $flood_config = $this->configFactory->get('user.flood');
    $accounts = $this->entityTypeManager->getStorage('user')
      ->loadByProperties(['name' => $name, 'status' => 1]);
    if ($account = reset($accounts)) {
      if ($flood_config->get('uid_only')) {
        // Register flood events based on the uid only, so they apply for any
        // IP address. This is the most secure option.
        $identifier = $account->id();
      }
      else {
        // The default identifier is a combination of uid and IP address. This
        // is less secure but more resistant to denial-of-service attacks that
        // could lock out all users with public user names.
        $identifier = $account->id() . '-' . $request->getClientIp();
      }
      return $identifier;
    }
    return '';
  }

  /**
   * Enforces flood control for the current login request.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *   The current request.
   * @param string $name
   *   The user name sent for login credentials.
   */
  protected function floodControl(Request $request, $name) {
    $flood_config = $this->configFactory->get('user.flood');

    if (!$this->flood->isAllowed('user.failed_login_ip', $flood_config->get('ip_limit'), $flood_config->get('ip_window'))) {
      throw new AccessDeniedHttpException('Access is blocked because of IP based flood prevention.', NULL, Response::HTTP_TOO_MANY_REQUESTS);
    }

    if ($identifier = $this->getLoginFloodIdentifier($request, $name)) {
      // Don't allow login if the limit for this user has been reached.
      // Default is to allow 5 failed attempts every 6 hours.
      if (!$this->flood->isAllowed('user.http_login', $flood_config->get('user_limit'), $flood_config->get('user_window'), $identifier)) {
        if ($flood_config->get('uid_only')) {
          $error_message = sprintf('There have been more than %s failed login attempts for this account. It is temporarily blocked. Try again later or request a new password.', $flood_config->get('user_limit'));
        }
        else {
          $error_message = 'Too many failed login attempts from your IP address. This IP address is temporarily blocked.';
        }

        throw new AccessDeniedHttpException($error_message, NULL, Response::HTTP_TOO_MANY_REQUESTS);
      }
    }
  }

  /**
   * Verifies if the user is blocked.
   *
   * @param string $name
   *   The user's name.
   *
   * @return bool
   *   TRUE if the user is blocked, otherwise FALSE.
   */
  protected function userIsBlocked($name) {
    return user_is_blocked($name);
  }

  /**
   * Finalizes the user login.
   *
   * @param \Drupal\user\UserInterface $user
   *   The user.
   */
  protected function userLoginFinalize(UserInterface $user) {
    user_login_finalize($user);
  }
}
