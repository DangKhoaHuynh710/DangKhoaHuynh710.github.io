// Start the dev server with uncleared projects visible, for local review only.
// Usage: npm run dev:drafts [-- --port 4322]
// The flag is ignored by `astro build`, and check-build.mjs fails any build that
// contains an uncleared project, so drafts cannot be published by accident.
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const pkg = require.resolve('astro/package.json');
const astroBin = join(dirname(pkg), require(pkg).bin.astro);

// Run Astro's own entry point with this Node binary: no shell, arguments passed as-is.
const child = spawn(process.execPath, [astroBin, 'dev', ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: { ...process.env, SHOW_UNCLEARED: '1' },
});
child.on('exit', (code) => process.exit(code ?? 0));
