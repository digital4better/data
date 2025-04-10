#!/bin/bash

set -e
set -x

CURRENT_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

echo "{
  \"version\": \"$npm_package_version\",
  \"generated_at\": \"$CURRENT_DATE\"
}" > ./data/version.json

git add ./data/version.json
git commit -m "chore: update version.json"
git push --tags
yarn publish --access=public
git push
