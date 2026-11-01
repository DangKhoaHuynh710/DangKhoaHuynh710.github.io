// Vite plugin: virtual module that imports cover images ONLY for projects with
// `cleared: true`. Anything else never enters the build graph, so it cannot be
// emitted into dist/ (CLAUDE.md A1 publishing gate). The post-build check in
// scripts/check-build.mjs is the safety net behind this.
//
// In `npm run dev:drafts` (dev server + SHOW_UNCLEARED=1) uncleared covers are
// included too, so drafts can be previewed locally.
import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const VIRTUAL_ID = 'virtual:cleared-images';
const RESOLVED_ID = '\0' + VIRTUAL_ID;
const PROJECTS_DIR = resolve('src/content/projects');

function readFrontmatter(file) {
  const src = readFileSync(file, 'utf8');
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const fm = m ? m[1] : '';
  const get = (key) => {
    const r = fm.match(new RegExp(`^${key}:\\s*(.+?)\\s*$`, 'm'));
    return r ? r[1].replace(/^["']|["']$/g, '') : undefined;
  };
  return { cleared: get('cleared') === 'true', cover: get('cover') };
}

export default function clearedImages() {
  let command = 'build';
  return {
    name: 'cleared-images',
    configResolved(config) {
      command = config.command;
    },
    resolveId(id) {
      return id === VIRTUAL_ID ? RESOLVED_ID : null;
    },
    load(id) {
      if (id !== RESOLVED_ID) return null;
      const showUncleared = command === 'serve' && process.env.SHOW_UNCLEARED === '1';
      const entries = [];
      for (const name of readdirSync(PROJECTS_DIR)) {
        if (!/\.mdx?$/.test(name)) continue;
        const file = join(PROJECTS_DIR, name);
        this.addWatchFile(file);
        const slug = name.replace(/\.mdx?$/, '');
        const { cleared, cover } = readFrontmatter(file);
        if ((cleared || showUncleared) && cover) {
          const path = `/src/assets/images/${slug}/${cover}`;
          entries.push(`  ${JSON.stringify(slug)}: () => import(${JSON.stringify(path)}),`);
        }
      }
      return `export const covers = {\n${entries.join('\n')}\n};\n`;
    },
  };
}
