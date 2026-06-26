#!/usr/bin/env sh
cd /home/foslone/private/FOSL
export PATH="$(dirname "$(readlink -f /proc/$(ss -tlnp 2>/dev/null | grep ':26104 ' | sed -n 's/.*pid=\([0-9]*\).*/\1/p')/exe)"):$PATH"
node -e "
const { loadRootEnv } = require('./scripts/load-root-env.mjs');
loadRootEnv(require('url').pathToFileURL('./scripts/load-root-env.mjs').href);
console.log('NODE_ENV', process.env.NODE_ENV);
console.log('AUTH_SECRET', process.env.AUTH_SECRET ? 'set' : 'missing');
console.log('AUTH_ENABLED', process.env.AUTH_ENABLED);
"
