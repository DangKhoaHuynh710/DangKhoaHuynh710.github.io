declare module 'virtual:cleared-images' {
  import type { ImageMetadata } from 'astro';
  export const covers: Record<string, () => Promise<{ default: ImageMetadata }>>;
}
