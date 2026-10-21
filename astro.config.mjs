// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import clearedImages from './plugins/cleared-images.mjs';

// GitHub Pages user site. Keep internal links relative so a custom domain
// later is a one-line change here.
export default defineConfig({
  site: 'https://dangkhoahuynh710.github.io',
  trailingSlash: 'always',
  integrations: [sitemap()],
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
