<?php

namespace Drupal\taller_chat_message\Entity;

use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\Core\Entity\RevisionLogInterface;
use Drupal\Core\Entity\EntityChangedInterface;
use Drupal\user\EntityOwnerInterface;

/**
 * Provides an interface for defining Message entities.
 *
 * @ingroup taller_chat_message
 */
interface MessageEntityInterface extends ContentEntityInterface, RevisionLogInterface, EntityChangedInterface, EntityOwnerInterface {

  // Add get/set methods for your configuration properties here.

  /**
   * Gets the Message creation timestamp.
   *
   * @return int
   *   Creation timestamp of the Message.
   */
  public function getCreatedTime();

  /**
   * Sets the Message creation timestamp.
   *
   * @param int $timestamp
   *   The Message creation timestamp.
   *
   * @return \Drupal\taller_chat_message\Entity\MessageEntityInterface
   *   The called Message entity.
   */
  public function setCreatedTime($timestamp);

  /**
   * Returns the Message published status indicator.
   *
   * Unpublished Message are only visible to restricted users.
   *
   * @return bool
   *   TRUE if the Message is published.
   */
  public function isPublished();

  /**
   * Sets the published status of a Message.
   *
   * @param bool $published
   *   TRUE to set this Message to published, FALSE to set it to unpublished.
   *
   * @return \Drupal\taller_chat_message\Entity\MessageEntityInterface
   *   The called Message entity.
   */
  public function setPublished($published);

  /**
   * Gets the Message revision creation timestamp.
   *
   * @return int
   *   The UNIX timestamp of when this revision was created.
   */
  public function getRevisionCreationTime();

  /**
   * Sets the Message revision creation timestamp.
   *
   * @param int $timestamp
   *   The UNIX timestamp of when this revision was created.
   *
   * @return \Drupal\taller_chat_message\Entity\MessageEntityInterface
   *   The called Message entity.
   */
  public function setRevisionCreationTime($timestamp);

  /**
   * Gets the Message revision author.
   *
   * @return \Drupal\user\UserInterface
   *   The user entity for the revision author.
   */
  public function getRevisionUser();

  /**
   * Sets the Message revision author.
   *
   * @param int $uid
   *   The user ID of the revision author.
   *
   * @return \Drupal\taller_chat_message\Entity\MessageEntityInterface
   *   The called Message entity.
   */
  public function setRevisionUserId($uid);

}
