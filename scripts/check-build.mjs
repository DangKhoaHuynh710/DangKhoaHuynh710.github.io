// Post-build checks (CLAUDE.md A6). Fails the build on:
//  1. an internal link that does not resolve to a file in dist/
//  2. an <img> with a missing or empty alt attribute
//  3. a project without cleared: true being reachable (page, link, sitemap,
//     or any of its images or media files copied into dist/)
// Warns on:
//  4. a delivered image over 300 KB, or a video over 8 MB
//  5. leftover TODO markers in published pages
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve, sep } from 'node:path';
import { createHash } from 'node:crypto';

const DIST = resolve('dist');
const CONTENT = resolve('src/content/projects');
const ASSET_DIRS = [resolve('src/assets/images'), resolve('src/assets/media')];
const errors = [];
const warnings = [];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const rel = (f) => f.slice(DIST.length + 1).replaceAll(sep, '/');
const files = walk(DIST);
const html = files.filter((f) => f.endsWith('.html'));

// Which projects are not cleared? Anything without an explicit `cleared: true`.
const frontmatter = (f) => readFileSync(join(CONTENT, f), 'utf8').split(/^---\s*$/m)[1] ?? '';
const uncleared = readdirSync(CONTENT)
  .filter((f) => /\.mdx?$/.test(f))
  .filter((f) => !/^cleared:\s*true\s*$/m.test(frontmatter(f)))
  .map((f) => f.replace(/\.mdx?$/, ''));

function decode(s) {
  return s.replace(/&amp;/g, '&').replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));
}

function resolveInternal(href, fromFile) {
  const path = href.split('#')[0].split('?')[0];
  if (path === '') return true;
  let target = path.startsWith('/') ? join(DIST, path) : resolve(dirname(fromFile), path);
  if (target.endsWith(sep) || target.endsWith('/')) target = join(target, 'index.html');
  if (existsSync(target)) {
    if (statSync(target).isDirectory()) return existsSync(join(target, 'index.html'));
    return true;
  }
  return existsSync(target + '.html') || existsSync(join(target, 'index.html'));
}

for (const file of html) {
  const src = readFileSync(file, 'utf8');

  // 1. internal links (anchors, and video sources)
  for (const m of src.matchAll(/<(?:a|source)\b[^>]*\s(?:href|src)="([^"]*)"/g)) {
    const href = decode(m[1]);
    if (/^(https?:|mailto:|tel:|data:)/i.test(href)) continue;
    if (!resolveInternal(href, file)) errors.push(`${rel(file)}: broken internal link "${href}"`);
  }

  // 2. alt text
  for (const m of src.matchAll(/<img\b[^>]*>/g)) {
    const tag = m[0];
    const alt = tag.match(/\salt="([^"]*)"/);
    if (!alt || !alt[1].trim()) errors.push(`${rel(file)}: <img> without alt text: ${tag.slice(0, 80)}`);
  }

  // 3. no links to uncleared projects
  for (const slug of uncleared) {
    if (src.includes(`/projects/${slug}/`)) errors.push(`${rel(file)}: links to uncleared project "${slug}"`);
  }

  // 5. leftover TODO markers (warning only)
  const text = src.replace(/<[^>]+>/g, ' ');
  const todos = (text.match(/TODO/g) || []).length;
  if (todos) warnings.push(`${rel(file)} contains ${todos} TODO marker(s)`);
}

for (const slug of uncleared) {
  if (existsSync(join(DIST, 'projects', slug))) errors.push(`dist/projects/${slug}/ exists but project is not cleared`);
}
for (const sm of files.filter((f) => /sitemap.*\.xml$/.test(f))) {
  const src = readFileSync(sm, 'utf8');
  for (const slug of uncleared) {
    if (src.includes(`/projects/${slug}/`)) errors.push(`${rel(sm)}: sitemap lists uncleared project "${slug}"`);
  }
}

// 3b. no file belonging to an uncleared project (src/assets/{images,media}/<slug>/)
// anywhere in dist/. Compare content hashes; a hash that also belongs to a cleared
// project's file is allowed (identical placeholder files, for example).
const sha = (f) => createHash('sha256').update(readFileSync(f)).digest('hex');
const clearedHashes = new Set();
const unclearedHashes = new Map(); // hash -> "slug/file"
for (const base of ASSET_DIRS.filter((d) => existsSync(d))) {
  for (const slug of readdirSync(base)) {
    const dir = join(base, slug);
    if (!statSync(dir).isDirectory()) continue;
    const isUncleared = uncleared.includes(slug);
    for (const f of walk(dir)) {
      const h = sha(f);
      if (isUncleared) unclearedHashes.set(h, `${slug}/${f.slice(dir.length + 1)}`);
      else clearedHashes.add(h);
    }
  }
}
if (unclearedHashes.size) {
  for (const out of files) {
    const h = sha(out);
    if (unclearedHashes.has(h) && !clearedHashes.has(h)) {
      errors.push(`${rel(out)} is ${unclearedHashes.get(h)} from an uncleared project`);
    }
  }
}

// 4. size caps (warnings)
for (const f of files) {
  const kb = statSync(f).size / 1024;
  if (/\.(webp|avif|png|jpe?g)$/i.test(f) && kb > 300) warnings.push(`${rel(f)} is ${kb.toFixed(0)} KB (target <= 300 KB)`);
  if (/\.(mp4|webm)$/i.test(f) && kb > 8192) warnings.push(`${rel(f)} is ${(kb / 1024).toFixed(1)} MB (target <= 8 MB)`);
}

for (const w of warnings) console.warn('warning:', w);
if (errors.length) {
  for (const e of errors) console.error('error:', e);
  console.error(`\ncheck-build: ${errors.length} error(s)`);
  process.exit(1);
}
console.log(`check-build: ${html.length} pages, ${uncleared.length} uncleared project(s) kept out, no errors`);
