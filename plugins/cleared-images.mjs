// Vite plugin: virtual module that imports cover images ONLY for projects with
// `cleared: true`. Anything else never enters the build graph, so it cannot be
// emitted into dist/ (CLAUDE.md A1 publishing gate). The post-build check in
// scripts/check-build.mjs is the safety net behind this.
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
  return {
    name: 'cleared-images',
    resolveId(id) {
      return id === VIRTUAL_ID ? RESOLVED_ID : null;
    },
    load(id) {
      if (id !== RESOLVED_ID) return null;
      const entries = [];
      for (const name of readdirSync(PROJECTS_DIR)) {
        if (!name.endsWith('.md')) continue;
        const file = join(PROJECTS_DIR, name);
        this.addWatchFile(file);
        const slug = name.replace(/\.md$/, '');
        const { cleared, cover } = readFrontmatter(file);
        if (cleared && cover) {
          const path = `/src/assets/images/${slug}/${cover}`;
          entries.push(`  ${JSON.stringify(slug)}: () => import(${JSON.stringify(path)}),`);
        }
      }
      return `export const covers = {\n${entries.join('\n')}\n};\n`;
    },
  };
}
