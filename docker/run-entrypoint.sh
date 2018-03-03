#!/bin/bash

set -e

# Source NVM scripts
source /usr/local/nvm/nvm.sh

echo ""
echo "------------------------------------------------"
echo "--------- Running on a stale container ---------"
echo "------------------------------------------------"
echo ""

exec "$@"
