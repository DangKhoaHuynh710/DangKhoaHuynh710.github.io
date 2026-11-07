// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import clearedImages from './plugins/cleared-images.mjs';

// GitHub Pages user site. Keep internal links relative so a custom domain
// later is a one-line change here.
export default defineConfig({
  site: 'https://dangkhoahuynh710.github.io',
  trailingSlash: 'always',
  // The About page was merged into the home page (2026-11-07); keep old links working.
  redirects: {
    '/about': '/#about',
  },
  integrations: [mdx(), sitemap({ filter: (page) => !page.endsWith('/about/') })],
  build: {
    format: 'directory',
  },
  image: {
    // Images are resized/compressed at build; see Figure.astro for size caps.
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
  vite: {
    plugins: [clearedImages()],
  },
});
