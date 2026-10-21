import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Schemas follow CLAUDE.md A4. `cleared` is the publishing gate (A1):
// anything with cleared: false is excluded from every page, the sitemap
// and static path generation.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: () =>
    z.object({
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
