import type { CollectionEntry } from 'astro:content';

/** True only in `npm run dev:drafts`. Never true in a build. */
export const SHOW_UNCLEARED = import.meta.env.DEV && process.env.SHOW_UNCLEARED === '1';

/** Whether a project may appear on a page (CLAUDE.md A1 publishing gate). */
export function isVisible(project: CollectionEntry<'projects'>): boolean {
  return project.data.cleared === true || SHOW_UNCLEARED;
}
