# dangkhoahuynh710.github.io

Personal portfolio of Dang Khoa Huynh: flight and ground electronics I have designed, built and tested.

**Live site:** https://dangkhoahuynh710.github.io
**Deploys:** automatically on every push to `main` ([Actions](https://github.com/DangKhoaHuynh710/DangKhoaHuynh710.github.io/actions))

The full spec, content rules and facts about me live in [CLAUDE.md](CLAUDE.md). This README is the status board and the how-to.

---

## Status

Last reviewed: 2026-11-01

### Pages

| Page | Route | State | Waiting on |
|---|---|---|---|
| Home | `/` | Live, placeholder | Portrait photo; optional second intro sentence |
| About | `/about/` | Live, placeholder bio | Bio draft |
| Now | `/now/` | Live, placeholder entry | Text for the GSE pad box entry |
| Resume | `/resume/` | Live, placeholder PDF | Real `public/resume.pdf`; one-line role descriptions |
| Projects index | `/projects/` | Rock Daisy card ready | Merge of the Rock Daisy page |

### Projects

A project page is only built when `cleared: true`. See [Publishing gate](#publishing-gate).

| Project | Slug | Cleared | Content | Photos | Waiting on |
|---|---|---|---|---|---|
| Rock Daisy payload | `rock-daisy` | Yes (2026-11-01) | Full draft, in review | 5 figures, 1 video | Your review; open questions in hidden comments |
| GSE pad control box | `gse-pad-box` | No | TODO headings only | None | Team clearance; current board status |
| FSAE low-voltage | `fsae-low-voltage` | No | TODO headings only | None | Team clearance; draft; photos |
| 2-axis linear stage | `linear-stage` | No | TODO headings only | None | Year; exact lidar model; draft; photos |
| Other work | `other-work` | No | TODO headings only | None | Years; draft; photos |

### Open decisions

From CLAUDE.md B9.

- [ ] Which projects the rocketry and FSAE teams clear for photos and description (Rock Daisy: cleared 2026-11-01)
- [ ] Final LinkedIn URL (current one is in `src/lib/site.ts`)
- [ ] Which photos exist; whether there is video of the checkout dashboard or launch
- [ ] Custom domain (later, if at all)
- [ ] Go live before or after current internship applications close

### Next up

1. Replace `public/resume.pdf` with the real resume.
2. Review the Rock Daisy page draft, answer its open questions, then publish it.
3. About bio and portrait.

When something on this board changes, update the table and add a line to [CHANGELOG.md](CHANGELOG.md).

---

## Run it locally

Needs Node 22.22 or newer (Astro 7 requirement). Node 24 LTS is what this machine uses.

```bash
npm install
```

```bash
npm run dev
```

Opens at http://localhost:4321. Pages reload as you edit.

```bash
npm run build
```

Builds to `dist/` and then runs the publishing checks. If this passes locally, the deploy will pass.

```bash
npm run check
```

Type-checks the Astro and TypeScript files.

---

## Adding content

### A project page

1. Edit `src/content/projects/<slug>.md`, or `.mdx` when the page needs inline figures or video (see `rock-daisy.mdx`). Keep the seven `##` headings in this order: Overview, My role, Photos, Design decisions, Testing and what broke, Result, Links. The dev server shows a yellow warning box if one is missing or out of order.
2. Put photos in `src/assets/images/<slug>/`. Export at roughly 2000 px on the long edge; the build resizes and compresses them. Keep originals out of the repo.
3. Set `cover:` to the cover photo's filename and `coverAlt:` to a description of the hardware shown, not "image of board".
4. `role:` and `dates:` must match the resume exactly (CLAUDE.md B8).
5. Flip `cleared: true` only after the team has confirmed. Set `featured: true` to show it on the home page (top three by `order`).

Photos inside the page body go through the `Figure` component so they get a numbered caption and required alt text. Add `wide` to let a figure extend past the text column, and `zoom` to link it to a full-size copy. Videos go in `src/assets/media/<slug>/` and use the `Video` component; re-encode phone footage to about 540 px wide first (the build warns above 8 MB).

To preview a project that is not cleared yet:

```bash
npm run dev:drafts
```

It shows uncleared projects with a "Draft preview" banner. It only works in the dev server and can never affect a build.

### A Now entry

Add `src/content/now/YYYY-MM-DD.md`:

```markdown
---
date: 2026-11-01
title: Short title
---

A few sentences, present tense.
```

Newest entry shows first.

### The resume

Replace `public/resume.pdf` with the exact file you send to employers. Keep the filename.

---

## Publishing gate

Every project has `cleared: true` or `cleared: false` in its frontmatter. With `false`, the project:

- gets no page,
- does not appear on the projects index or home page,
- is left out of the sitemap,
- has none of its images copied into the built site.

`npm run build` fails if any of these is violated, so a mistake cannot reach the live site. The check script is `scripts/check-build.mjs`; it also fails on broken internal links and images without alt text, and warns on images over 300 KB.

---

## Before each deploy

From CLAUDE.md A6. Items marked *auto* are enforced by `npm run build`.

- [ ] All internal links resolve *(auto)*
- [ ] Every image has alt text *(auto)*
- [ ] No uncleared project is reachable *(auto)*
- [ ] `public/resume.pdf` is the latest version
- [ ] Dates and titles match the resume
- [ ] Checked on a phone at 375 px width, in light and dark mode
- [ ] Dated line added to `CHANGELOG.md`

---

## Design

Clean, type-led layout with system fonts and no client-side JavaScript.

| | Light mode | Dark mode |
|---|---|---|
| Background | `#fbfaf8` | `#0b0f17` |
| Links | `#0b5fa5` | `#4cc9f0` |
| Signature green | `#3a7d00` | `#9ef01a` |

The green is used only on dates, figure numbers, the active nav item and the short rule under each page heading. The home page hero has a CSS-only starfield and shooting stars in dark mode; they switch off for people with reduced motion enabled. All colour tokens are at the top of `src/styles/global.css`.

---

## Where things are

```
src/
  content/projects/     one Markdown file per project
  content/now/          one Markdown file per Now entry
  assets/images/<slug>/ project photos (processed at build)
  pages/                one file per route
  layouts/              Base (header, footer) and Project (section order)
  components/           ProjectCard, Figure
  lib/site.ts           name, email, LinkedIn, GitHub, nav links
  styles/global.css     colours, typography, dark mode, print
public/
  resume.pdf            served as-is at /resume.pdf
plugins/
  cleared-images.mjs    keeps uncleared project images out of the build
scripts/
  check-build.mjs       post-build checks
.github/workflows/
  deploy.yml            build and deploy to GitHub Pages
CLAUDE.md               spec and content rules
CHANGELOG.md            dated log of every content change
```
