<?php

namespace Drupal\taller_chat_message\Controller;

use Drupal\Component\Utility\Xss;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Url;
use Drupal\taller_chat_message\Entity\MessageEntityInterface;

/**
 * Class MessageEntityController.
 *
 *  Returns responses for Message routes.
 */
class MessageEntityController extends ControllerBase implements ContainerInjectionInterface {

  /**
   * Displays a Message  revision.
   *
   * @param int $message_revision
   *   The Message  revision ID.
   *
   * @return array
   *   An array suitable for drupal_render().
   */
  public function revisionShow($message_revision) {
    $message = $this->entityManager()->getStorage('message')->loadRevision($message_revision);
    $view_builder = $this->entityManager()->getViewBuilder('message');

    return $view_builder->view($message);
  }

  /**
   * Page title callback for a Message  revision.
   *
   * @param int $message_revision
   *   The Message  revision ID.
   *
   * @return string
   *   The page title.
   */
  public function revisionPageTitle($message_revision) {
    $message = $this->entityManager()->getStorage('message')->loadRevision($message_revision);
    return $this->t('Revision of %title from %date', ['%title' => $message->label(), '%date' => format_date($message->getRevisionCreationTime())]);
  }

  /**
   * Generates an overview table of older revisions of a Message .
   *
   * @param \Drupal\taller_chat_message\Entity\MessageEntityInterface $message
   *   A Message  object.
   *
   * @return array
   *   An array as expected by drupal_render().
   */
  public function revisionOverview(MessageEntityInterface $message) {
    $account = $this->currentUser();
    $langcode = $message->language()->getId();
    $langname = $message->language()->getName();
    $languages = $message->getTranslationLanguages();
    $has_translations = (count($languages) > 1);
    $message_storage = $this->entityManager()->getStorage('message');

    $build['#title'] = $has_translations ? $this->t('@langname revisions for %title', ['@langname' => $langname, '%title' => $message->label()]) : $this->t('Revisions for %title', ['%title' => $message->label()]);
    $header = [$this->t('Revision'), $this->t('Operations')];

    $revert_permission = (($account->hasPermission("revert all message revisions") || $account->hasPermission('administer message entities')));
    $delete_permission = (($account->hasPermission("delete all message revisions") || $account->hasPermission('administer message entities')));

    $rows = [];

    $vids = $message_storage->revisionIds($message);

    $latest_revision = TRUE;

    foreach (array_reverse($vids) as $vid) {
      /** @var \Drupal\taller_chat_message\MessageEntityInterface $revision */
      $revision = $message_storage->loadRevision($vid);
      // Only show revisions that are affected by the language that is being
      // displayed.
      if ($revision->hasTranslation($langcode) && $revision->getTranslation($langcode)->isRevisionTranslationAffected()) {
        $username = [
          '#theme' => 'username',
          '#account' => $revision->getRevisionUser(),
        ];

        // Use revision link to link to revisions that are not active.
        $date = \Drupal::service('date.formatter')->format($revision->getRevisionCreationTime(), 'short');
        if ($vid != $message->getRevisionId()) {
          $link = $this->l($date, new Url('entity.message.revision', ['message' => $message->id(), 'message_revision' => $vid]));
        }
        else {
          $link = $message->link($date);
        }

        $row = [];
        $column = [
          'data' => [
            '#type' => 'inline_template',
            '#template' => '{% trans %}{{ date }} by {{ username }}{% endtrans %}{% if message %}<p class="revision-log">{{ message }}</p>{% endif %}',
            '#context' => [
              'date' => $link,
              'username' => \Drupal::service('renderer')->renderPlain($username),
              'message' => ['#markup' => $revision->getRevisionLogMessage(), '#allowed_tags' => Xss::getHtmlTagList()],
            ],
          ],
        ];
        $row[] = $column;

        if ($latest_revision) {
          $row[] = [
            'data' => [
              '#prefix' => '<em>',
              '#markup' => $this->t('Current revision'),
              '#suffix' => '</em>',
            ],
          ];
          foreach ($row as &$current) {
            $current['class'] = ['revision-current'];
          }
          $latest_revision = FALSE;
        }
        else {
          $links = [];
          if ($revert_permission) {
            $links['revert'] = [
              'title' => $this->t('Revert'),
              'url' => Url::fromRoute('entity.message.revision_revert', ['message' => $message->id(), 'message_revision' => $vid]),
            ];
          }

          if ($delete_permission) {
            $links['delete'] = [
              'title' => $this->t('Delete'),
              'url' => Url::fromRoute('entity.message.revision_delete', ['message' => $message->id(), 'message_revision' => $vid]),
            ];
          }

          $row[] = [
            'data' => [
              '#type' => 'operations',
              '#links' => $links,
            ],
          ];
        }

        $rows[] = $row;
      }
    }

    $build['message_revisions_table'] = [
      '#theme' => 'table',
      '#rows' => $rows,
      '#header' => $header,
    ];

    return $build;
  }

}
