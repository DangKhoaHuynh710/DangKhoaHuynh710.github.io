import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { readdirSync, readFileSync } from 'node:fs';

// Publishing gate (CLAUDE.md A1), first layer: a project with cleared: false is
// never loaded at all, so nothing it imports (photos, video) can reach the build.
// The pages, the cover-image plugin and scripts/check-build.mjs are further layers.
//
// `npm run dev:drafts` sets SHOW_UNCLEARED=1 to preview uncleared drafts locally.
// It is ignored outside the dev server, so it can never affect a build.
const SHOW_UNCLEARED = import.meta.env.DEV && process.env.SHOW_UNCLEARED === '1';
const PROJECTS_DIR = './src/content/projects';

function frontmatter(file: string): string {
  const parts = readFileSync(`${PROJECTS_DIR}/${file}`, 'utf8').split(/^---\s*$/m);
  return parts[1] ?? '';
}

function projectFiles(): string[] {
  const files = readdirSync(PROJECTS_DIR).filter((f) => /\.mdx?$/.test(f));
  if (SHOW_UNCLEARED) return files;
  const cleared = files.filter((f) => /^cleared:\s*true\s*$/m.test(frontmatter(f)));
  // A pattern that matches nothing keeps the collection valid but empty.
  return cleared.length > 0 ? cleared : ['__no_cleared_projects__.md'];
}

const projects = defineCollection({
  loader: glob({ pattern: projectFiles(), base: PROJECTS_DIR }),
  schema: z.object({
    title: z.string().min(1),
    role: z.string().min(1),
    dates: z.string().min(1),
    summary: z.string().min(1),
    cover: z.string().min(1), // filename inside src/assets/images/<slug>/, resolved in src/lib/images.ts
    coverAlt: z.string().min(1, 'coverAlt must describe the hardware shown'),
    cleared: z.boolean(),
    featured: z.boolean().default(false),
    order: z.number().optional(),
    links: z.array(z.object({ label: z.string(), url: z.url() })).optional(),
  }),
});

const now = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/now' }),
  schema: z.object({
    date: z.coerce.date(),
    title: z.string().min(1),
  }),
});

export const collections = { projects, now };
