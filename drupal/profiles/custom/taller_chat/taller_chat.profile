<?php

/**
 * Implements hook_install_tasks().
 */
function taller_chat_install_tasks_alter(&$tasks) {
  $tasks['_taller_chat_seed_content'] = [
    'display_name' => t('TallerChat install default content'),
    'display' => TRUE,
    'type' => 'normal'
  ];
}

/**
 * Add initial required content.
 */
function _taller_chat_seed_content() {
  // Create default chat channel.
  \Drupal\taxonomy\Entity\Term::create(['name' => 'general', 'vid' => 'channel'])->save();
}
