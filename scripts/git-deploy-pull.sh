#!/usr/bin/env sh
# Pull the FOSL production deploy branch (refactor/two-app-platform).
set -e
BRANCH="${FOSL_DEPLOY_BRANCH:-refactor/two-app-platform}"
echo "Fetching and resetting to origin/${BRANCH}..."
git fetch origin "${BRANCH}" --force
git checkout "${BRANCH}"
git reset --hard "origin/${BRANCH}"
git log -1 --oneline
