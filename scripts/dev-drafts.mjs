// Start the dev server with uncleared projects visible, for local review only.
// Usage: npm run dev:drafts
// The flag is ignored by `astro build`, and check-build.mjs fails any build that
// contains an uncleared project, so drafts cannot be published by accident.
import { spawn } from 'node:child_process';

const child = spawn('npx', ['astro', 'dev', ...process.argv.slice(2)], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, SHOW_UNCLEARED: '1' },
});
child.on('exit', (code) => process.exit(code ?? 0));
