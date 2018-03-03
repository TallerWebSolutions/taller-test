<?php
namespace Drupal\taller_chat_user\Plugin\GraphQL\Mutations;

use Drupal\Core\DependencyInjection\DependencySerializationTrait;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\graphql\Plugin\GraphQL\Mutations\MutationPluginBase;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Youshido\GraphQL\Execution\ResolveInfo;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\Core\Session\AccountInterface;


/**
 * Logout the User.
 *
 * @GraphQLMutation(
 *   id = "user_logout",
 *   name = "userLogout",
 *   type = "User",
 *   secure = true,
 *   nullable = false,
 *   schema_cache_tags = {"user_logout"}
 * )
 */
class UserLogout extends MutationPluginBase implements ContainerFactoryPluginInterface {
  use DependencySerializationTrait;
  use StringTranslationTrait;

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
  public static function create(
    ContainerInterface $container,
    array $configuration,
    $pluginId,
    $pluginDefinition
  ) {
    return new static(
      $configuration,
      $pluginId,
      $pluginDefinition,
      $container->get('entity_type.manager'),
      $container->get('current_user')
    );
  }

  public function resolve($value, array $args, ResolveInfo $info) {
    user_logout();
    $uid = $this->currentUser->id();
    return $this->entityTypeManager->getStorage('user')->load($uid);
  }

}
