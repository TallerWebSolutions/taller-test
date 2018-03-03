#!/bin/bash

set -e

drush cr
drush updb -y
drush config-import --partial -y
drush entity-updates -y
