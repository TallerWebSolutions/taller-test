<?php

namespace Drupal\taller_chat_user\Plugin\GraphQL\Mutations;

use Drupal\Core\DependencyInjection\DependencySerializationTrait;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\user\UserInterface;
use Drupal\graphql\Plugin\GraphQL\Mutations\MutationPluginBase;

use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

use Youshido\GraphQL\Execution\ResolveInfo;

/**
 * Login User.
 *
 * @GraphQLMutation(
 *   id = "user_register",
 *   name = "userRegister",
 *   type = "User",
 *   secure = false,
 *   nullable = false,
 *   schema_cache_tags = {"user_login"},
 *   arguments = {
 *     "name" = "String",
 *     "email" = "String",
 *     "password" = "String"
 *   }
 * )
 */
class UserRegister extends MutationPluginBase implements ContainerFactoryPluginInterface {
  use DependencySerializationTrait;
  use StringTranslationTrait;

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

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
    AccountInterface $currentUser
  ) {
    $this->entityTypeManager = $entityTypeManager;
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
      $container->get('current_user')
    );
  }

  /**
   * Mutation resolver.
   *
   * @return \Drupal\user\UserInterface
   *   The newly registered user.
   */
  public function resolve($value, array $args, ResolveInfo $info) {
    return $this->register($args);
  }

  /**
   * Register a new user.
   *
   * @return \Drupal\user\UserInterface
   *   The newly registered user.
   */
  public function register($credentials) {
    if ($this->currentUser->isAuthenticated()) {
      throw new BadRequestHttpException($this->t('You are already logged in.'));
    }

    if (!empty(user_load_by_name($credentials['name']))) {
      throw new BadRequestHttpException($this->t('User name already registered.'));
    }

    if (!empty(user_load_by_mail($credentials['email']))) {
      throw new BadRequestHttpException($this->t('User name already registered.'));
    }

    // Good to go...
    $user = $this->entityTypeManager->getStorage('user')->create();
    $user->enforceIsNew();
    $user->setUsername($credentials['name']);
    $user->setEmail($credentials['email']);
    $user->setPassword($credentials['password']);
    $user->activate();
    $user->save();

    // Login after registering. Should we?
    user_login_finalize($user);

    return $user;
  }

}
