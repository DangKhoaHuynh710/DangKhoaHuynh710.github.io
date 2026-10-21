// Post-build checks (CLAUDE.md A6). Fails the build on:
//  1. an internal link that does not resolve to a file in dist/
//  2. an <img> with a missing or empty alt attribute
//  3. a project with cleared: false being reachable (page, link, or sitemap)
//  4. a delivered image over 300 KB (warning only)
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve, sep } from 'node:path';
import { createHash } from 'node:crypto';

const DIST = resolve('dist');
const CONTENT = resolve('src/content/projects');
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

const files = walk(DIST);
const html = files.filter((f) => f.endsWith('.html'));

// Which projects are not cleared?
const uncleared = readdirSync(CONTENT)
  .filter((f) => f.endsWith('.md'))
  .filter((f) => /^cleared:\s*false\s*$/m.test(readFileSync(join(CONTENT, f), 'utf8')))
  .map((f) => f.replace(/\.md$/, ''));

function decode(s) {
  return s.replace(/&amp;/g, '&').replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));
}

function resolveInternal(href, fromFile) {
  let path = href.split('#')[0].split('?')[0];
  if (path === '') return true;
  let target;
  if (path.startsWith('/')) target = join(DIST, path);
  else target = resolve(dirname(fromFile), path);
  if (target.endsWith(sep) || target.endsWith('/')) target = join(target, 'index.html');
  if (existsSync(target)) {
    if (statSync(target).isDirectory()) return existsSync(join(target, 'index.html'));
    return true;
  }
  return existsSync(target + '.html') || existsSync(join(target, 'index.html'));
}

for (const file of html) {
  const rel = file.slice(DIST.length + 1).replaceAll(sep, '/');
  const src = readFileSync(file, 'utf8');

  // 1. internal links
  for (const m of src.matchAll(/<a\b[^>]*\shref="([^"]*)"/g)) {
    const href = decode(m[1]);
    if (/^(https?:|mailto:|tel:)/i.test(href)) continue;
    if (!resolveInternal(href, file)) errors.push(`${rel}: broken internal link "${href}"`);
  }

  // 2. alt text
  for (const m of src.matchAll(/<img\b[^>]*>/g)) {
    const tag = m[0];
    const alt = tag.match(/\salt="([^"]*)"/);
    if (!alt || !alt[1].trim()) errors.push(`${rel}: <img> without alt text: ${tag.slice(0, 80)}`);
  }

  // 3. no links to uncleared projects
  for (const slug of uncleared) {
    if (src.includes(`/projects/${slug}/`)) errors.push(`${rel}: links to uncleared project "${slug}"`);
  }
}

for (const slug of uncleared) {
  if (existsSync(join(DIST, 'projects', slug))) errors.push(`dist/projects/${slug}/ exists but project is not cleared`);
}
const sitemaps = files.filter((f) => /sitemap.*\.xml$/.test(f));
for (const sm of sitemaps) {
  const src = readFileSync(sm, 'utf8');
  for (const slug of uncleared) {
    if (src.includes(`/projects/${slug}/`)) errors.push(`${sm.slice(DIST.length + 1)}: sitemap lists uncleared project "${slug}"`);
  }
}

// 3b. no image belonging to an uncleared project in the bundle. Compare content
// hashes; a hash that also belongs to a cleared project's image is allowed
// (identical placeholder files, for example).
const IMAGES = resolve('src/assets/images');
const sha = (f) => createHash('sha256').update(readFileSync(f)).digest('hex');
const isImage = (f) => /\.(svg|png|jpe?g|webp|avif|gif)$/i.test(f);
const clearedHashes = new Set();
const unclearedHashes = new Map(); // hash -> "slug/file"
if (existsSync(IMAGES)) {
  for (const slug of readdirSync(IMAGES)) {
    const dir = join(IMAGES, slug);
    if (!statSync(dir).isDirectory()) continue;
    const isUncleared = uncleared.includes(slug);
    for (const f of walk(dir).filter(isImage)) {
      const h = sha(f);
      if (isUncleared) unclearedHashes.set(h, `${slug}/${f.slice(dir.length + 1)}`);
      else clearedHashes.add(h);
    }
  }
}
for (const out of files.filter((f) => f.includes(`${sep}_astro${sep}`) && isImage(f))) {
  const h = sha(out);
  if (unclearedHashes.has(h) && !clearedHashes.has(h)) {
    errors.push(`${out.slice(DIST.length + 1)} is ${unclearedHashes.get(h)} from an uncleared project`);
  }
}

// 4. image size cap
for (const f of files.filter((f) => /\.(webp|avif|png|jpe?g)$/i.test(f))) {
  const kb = statSync(f).size / 1024;
  if (kb > 300) warnings.push(`${f.slice(DIST.length + 1)} is ${kb.toFixed(0)} KB (target <= 300 KB)`);
}

for (const w of warnings) console.warn('warning:', w);
if (errors.length) {
  for (const e of errors) console.error('error:', e);
  console.error(`\ncheck-build: ${errors.length} error(s)`);
  process.exit(1);
}
console.log(`check-build: ${html.length} pages, ${uncleared.length} uncleared project(s) kept out, no errors`);
