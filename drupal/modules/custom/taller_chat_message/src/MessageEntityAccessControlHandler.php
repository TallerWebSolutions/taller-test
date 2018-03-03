<?php

namespace Drupal\taller_chat_message;

use Drupal\Core\Entity\EntityAccessControlHandler;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Access\AccessResult;

/**
 * Access controller for the Message entity.
 *
 * @see \Drupal\taller_chat_message\Entity\MessageEntity.
 */
class MessageEntityAccessControlHandler extends EntityAccessControlHandler {

  /**
   * {@inheritdoc}
   */
  protected function checkAccess(EntityInterface $entity, $operation, AccountInterface $account) {
    /** @var \Drupal\taller_chat_message\Entity\MessageEntityInterface $entity */
    switch ($operation) {
      case 'view':
        if (!$entity->isPublished()) {
          return AccessResult::allowedIfHasPermission($account, 'view unpublished message entities');
        }
        return AccessResult::allowedIfHasPermission($account, 'view published message entities');

      case 'update':
        return AccessResult::allowedIfHasPermission($account, 'edit message entities');

      case 'delete':
        return AccessResult::allowedIfHasPermission($account, 'delete message entities');
    }

    // Unknown operation, no opinion.
    return AccessResult::neutral();
  }

  /**
   * {@inheritdoc}
   */
  protected function checkCreateAccess(AccountInterface $account, array $context, $entity_bundle = NULL) {
    return AccessResult::allowedIfHasPermission($account, 'add message entities');
  }

}
