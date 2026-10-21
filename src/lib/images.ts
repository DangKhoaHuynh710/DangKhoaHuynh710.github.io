import type { ImageMetadata } from 'astro';
import type { CollectionEntry } from 'astro:content';
import { covers } from 'virtual:cleared-images';

// Project cover images are resolved through a build-time virtual module
// (plugins/cleared-images.mjs) that only imports images for projects with
// cleared: true. The `image()` schema helper or a static import.meta.glob
// would emit every project's image into dist/, including unpublished ones.

/** Resolve `cover` (a filename inside src/assets/images/<slug>/) to processed image metadata. */
export async function getCover(project: CollectionEntry<'projects'>): Promise<ImageMetadata> {
  if (!project.data.cleared) {
    throw new Error(`getCover: refusing to load an image for uncleared project "${project.id}"`);
  }
  const loader = covers[project.id];
  if (!loader) {
    throw new Error(
      `getCover: no cover registered for "${project.id}". Check that src/assets/images/${project.id}/${project.data.cover} exists and restart the dev server.`,
    );
  }
  return (await loader()).default;
}
