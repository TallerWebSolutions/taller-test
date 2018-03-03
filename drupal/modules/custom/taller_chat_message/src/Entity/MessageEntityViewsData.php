<?php

namespace Drupal\taller_chat_message\Entity;

use Drupal\views\EntityViewsData;

/**
 * Provides Views data for Message entities.
 */
class MessageEntityViewsData extends EntityViewsData {

  /**
   * {@inheritdoc}
   */
  public function getViewsData() {
    $data = parent::getViewsData();

    // Additional information for Views integration, such as table joins, can be
    // put here.

    return $data;
  }

}
