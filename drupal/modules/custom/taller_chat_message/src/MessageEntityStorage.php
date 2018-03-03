<?php

namespace Drupal\taller_chat_message;

use Drupal\Core\Entity\Sql\SqlContentEntityStorage;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Language\LanguageInterface;
use Drupal\taller_chat_message\Entity\MessageEntityInterface;

/**
 * Defines the storage handler class for Message entities.
 *
 * This extends the base storage class, adding required special handling for
 * Message entities.
 *
 * @ingroup taller_chat_message
 */
class MessageEntityStorage extends SqlContentEntityStorage implements MessageEntityStorageInterface {

  /**
   * {@inheritdoc}
   */
  public function revisionIds(MessageEntityInterface $entity) {
    return $this->database->query(
      'SELECT vid FROM {message_revision} WHERE id=:id ORDER BY vid',
      [':id' => $entity->id()]
    )->fetchCol();
  }

  /**
   * {@inheritdoc}
   */
  public function userRevisionIds(AccountInterface $account) {
    return $this->database->query(
      'SELECT vid FROM {message_field_revision} WHERE uid = :uid ORDER BY vid',
      [':uid' => $account->id()]
    )->fetchCol();
  }

  /**
   * {@inheritdoc}
   */
  public function countDefaultLanguageRevisions(MessageEntityInterface $entity) {
    return $this->database->query('SELECT COUNT(*) FROM {message_field_revision} WHERE id = :id AND default_langcode = 1', [':id' => $entity->id()])
      ->fetchField();
  }

  /**
   * {@inheritdoc}
   */
  public function clearRevisionsLanguage(LanguageInterface $language) {
    return $this->database->update('message_revision')
      ->fields(['langcode' => LanguageInterface::LANGCODE_NOT_SPECIFIED])
      ->condition('langcode', $language->getId())
      ->execute();
  }

}
