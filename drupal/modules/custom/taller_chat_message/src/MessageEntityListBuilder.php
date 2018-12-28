<?php

namespace Drupal\taller_chat_message;

use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityListBuilder;
use Drupal\Core\Link;

/**
 * Defines a class to build a listing of Message entities.
 *
 * @ingroup taller_chat_message
 */
class MessageEntityListBuilder extends EntityListBuilder {


  /**
   * {@inheritdoc}
   */
  public function buildHeader() {
    $header['id'] = $this->t('Message ID');
    // $header['name'] = $this->t('Name');
    return $header + parent::buildHeader();
  }

  /**
   * {@inheritdoc}
   */
  public function buildRow(EntityInterface $entity) {
    /* @var $entity \Drupal\taller_chat_message\Entity\MessageEntity */
    $row['id'] = $entity->id();
    // $row['name'] = Link::createFromRoute(
    //   $entity->label(),
    //   'entity.message.edit_form',
    //   ['message' => $entity->id()]
    // );
    return $row + parent::buildRow($entity);
  }

}
