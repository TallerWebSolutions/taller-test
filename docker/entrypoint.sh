#!/bin/bash

set -e

# Source NVM scripts
source /usr/local/nvm/nvm.sh

# Start services and loggers.
# ---------------------------

sudo service php5-fpm restart > /tmp/php.log
sudo service nginx restart > /tmp/nginx.log


# Await database.
# ---------------.

while ! nc -q 1 database-host 3306 </dev/null; do sleep 3; done

echo ""
echo "--------------------------------------"
echo "--------- Database connected ---------"
echo "--------------------------------------"
echo ""


# Install Drupal, if not installed yet.
# -------------------------------------

if [ ! -f /drupal/app/drupal/sites/default/settings.local.php ]
then
  # 1 - Install core and other dependencies.
  composer install

  # 2 - Create basic files and ensure permissions.
  mkdir -p /drupal/app/drupal/sites/default/files

  # 3 - Copy configuration files.
  sudo cp /drupal/app/drupal/sites/template.settings.local.php /drupal/app/drupal/sites/default/settings.local.php
  sudo chmod -R 777 /drupal/app/drupal/sites/default/settings.local.php

  # 4 - Configure database connection based on docker-compose env variables.
  sed -i "s/{MYSQL_DATABASE}/${MYSQL_DATABASE}/g" /drupal/app/drupal/sites/default/settings.local.php
  sed -i "s/{MYSQL_PASSWORD}/${MYSQL_PASSWORD}/g" /drupal/app/drupal/sites/default/settings.local.php
  sed -i "s/{MYSQL_USER}/${MYSQL_USER}/g" /drupal/app/drupal/sites/default/settings.local.php

  # 5 - Install standard profile.
  cd /drupal/app/drupal
  # Set PHP_OPTIONS environment variable to fix sendmail error.
  /usr/bin/env PHP_OPTIONS="-d sendmail_path=`which true`" ../bin/drush si taller_chat --site-name="TallerChat" --account-name="admin" --account-pass="password" -y

  # 6 - Import configs, if available.
  if [ -f /drupal/app/site-id ]
  then
    ../bin/drush en config -y
    ../bin/drush cset system.site uuid "`cat /drupal/app/site-id`" -y
    ../bin/drush config-import --partial -y
  fi

fi

if [ ! -e /drupal/app/next/node_modules ]
then
  cd /drupal/app/next
  yarn
  cd /drupal/app
fi

# Ensure permissions are correct.
# -------------------------------

sudo chmod -R 777 /drupal/app/drupal/sites/default/files
sudo chmod 777 /drupal/app/drupal/sites/default/settings.local.php
sudo chmod +w -R /drupal/app/drupal/sites/default

echo ""
echo "--------------------------------------"
echo "--- Virtual Machine ready to work! ---"
echo "--------------------------------------"
echo ""
echo "Access your Drupal site at http://$(hostname -i)"
echo ""

exec "$@"
