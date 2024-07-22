echo "#!/usr/bin/env bash
set -e

echo 'Cleaning up old dependencies...'
rm -rf node_modules

echo 'Installing dependencies using npm ci...'
npm ci" > .render-build.sh
chmod +x .render-build.sh