# CLAUDE.md — Dang Khoa Huynh personal portfolio website

This file is the source of truth for this repo. Part A records the decisions already made and the build spec. Part B is the project context (who I am, what the site is for, content inventory, writing rules). Follow both. If something is not here and not said in the conversation, ask or leave a `TODO:` — do not invent details.

---

# Part A — Decisions and build spec

## A1. Decisions made (2026-10-21)

| Item | Decision |
|---|---|
| Generator | Astro (latest stable), Markdown content collections |
| Hosting | GitHub Pages, user site. Repo: `DangKhoaHuynh710/DangKhoaHuynh710.github.io`. URL: `https://dangkhoahuynh710.github.io` |
| Domain | github.io for now; custom domain may be added later (keep all internal links relative so it is a one-line change) |
| Deploy | GitHub Actions on push to `main`, using the official Astro Pages action. Repo setting: Pages → Source = GitHub Actions |
| Scope of v1 | Home, About, Resume, `/now/`, `/projects/` index, Rock Daisy project page. Other project pages added one at a time afterwards |
| Images | Stored in the repo under `src/assets/images/<project>/`, referenced from Markdown frontmatter and body, processed by Astro's image pipeline at build (resize + compress; target ≤300 KB per delivered image). Originals stay out of the repo |
| Publishing gate | Every project has a `cleared` boolean in frontmatter. The build must exclude any project with `cleared: false` from the index, the home page cards and the sitemap, and must not generate its page |

## A2. Site map

| Route | Purpose |
|---|---|
| `/` | One paragraph who I am, one photo, three featured project cards (Rock Daisy, GSE pad box, FSAE), links to Resume (PDF), LinkedIn, email |
| `/about/` | Longer bio, education, skills, the two team roles, one line on Vietnam → Sydney |
| `/now/` | What I am working on currently. Dated entries, newest first, one Markdown file per entry. First entry: the GSE pad box board |
| `/projects/` | Index: card per cleared project (cover image, title, role, dates, one-line summary) |
| `/projects/<slug>/` | One page per project. Fixed section order: Overview → My role → Photos → Design decisions → Testing and what broke → Result → Links |
| `/resume/` | Embedded `public/resume.pdf` (the exact file I send to employers) plus a plain-text summary |
| Footer on every page | Name, email (obfuscated mailto), LinkedIn, GitHub, "Last updated" date taken from the build |

Project slugs: `rock-daisy`, `gse-pad-box`, `fsae-low-voltage`, `linear-stage`, `other-work`.

## A3. Repo layout

```
src/
  content.config.ts           # collection schemas (see A4)
  content/
    projects/<slug>.md         # one file per project
    now/YYYY-MM-DD.md          # one file per /now/ entry
  assets/
    images/
      <slug>/                  # project photos
      about/                   # portrait, etc.
  layouts/
    Base.astro                 # html shell, header, footer, meta, print + dark mode css
    Project.astro              # project page layout, enforces section order
  components/
    ProjectCard.astro
    Figure.astro               # image + required caption/alt, uses astro:assets Image
  pages/
    index.astro
    about.astro
    now.astro
    resume.astro
    projects/index.astro
    projects/[slug].astro      # getStaticPaths filters cleared === true
  styles/
    global.css
public/
  resume.pdf
  favicon.svg
.github/workflows/deploy.yml
astro.config.mjs               # site: 'https://dangkhoahuynh710.github.io'
CHANGELOG.md
CLAUDE.md
```

## A4. Content schemas

`projects` collection, frontmatter (all required unless noted):
- `title` string
- `role` string — copied verbatim from the resume title (see B8 for exact strings)
- `dates` string — verbatim from the resume, e.g. `2025–2026`
- `summary` string — one sentence for the card
- `cover` image — via the `image()` schema helper so it is processed and validated at build
- `cleared` boolean — see A1 publishing gate
- `featured` boolean, optional, default false — shown on the home page
- `order` number, optional — sort key on the index; default sort is by `order` then `dates` descending
- `links` optional array of `{ label, url }`

`now` collection:
- `date` date (also the filename)
- `title` string

Body of each project file uses `##` headings in exactly the order listed in A2. The layout should render a warning in dev mode if a heading is missing or out of order.

## A5. Non-functional requirements

- Static output only. No client-side JS unless a component needs it; no analytics, no cookies, no comments, no third-party fonts loaded from a CDN (self-host or use system font stack).
- Responsive; check at 375 px width first, then desktop. Recruiters open this from email on a phone.
- Light and dark mode via `prefers-color-scheme` only; no toggle needed.
- Accessibility: every image needs alt text that describes the hardware (not "image of board"); one `h1` per page; heading levels in order; colour contrast at least WCAG AA.
- Print stylesheet: a project page prints cleanly on A4 — hide nav/footer links, show URLs after external links, no dark background.
- Lighthouse targets on the home page: performance ≥ 95, accessibility 100.
- Australian English spelling in all UI strings.

## A6. Deploy and checks

- `.github/workflows/deploy.yml`: on push to `main`, build with the official Astro GitHub Pages action and deploy. Node LTS.
- Before each deploy (manual checklist, also encode what you can as a build step or script):
  1. All internal links resolve (run a link check in CI).
  2. Every image has alt text (fail the build on an empty `alt`).
  3. `public/resume.pdf` is the latest version.
  4. Dates and titles in content match the resume (B8).
  5. No project with `cleared: false` is reachable.
  6. Mobile layout checked.
- Each content change gets a dated line in `CHANGELOG.md`.

## A7. Division of labour

- Code, layouts, components, build and deploy: done in this repo with Claude Code, following this file.
- Page content: drafted in Markdown elsewhere and reviewed by me, then dropped into `src/content/`. Claude Code should not write project narrative from scratch; if a content file is missing, create it with the frontmatter and section headings and `TODO:` placeholders.
- Starting instruction for the first session: scaffold everything in A3–A6 with placeholder content, get the dev server running, commit, push, and confirm the Pages deploy works.

---

# Part B — Project context

Use this as the source of truth about me unless I say otherwise.

## B1. Purpose of the site

A static personal website that shows the hardware I have built, with photos, design decisions and test results, so that a recruiter at an electronics/aerospace company or a university research supervisor can see evidence of my work that a one-page resume cannot carry.

Audience, in priority order:
1. Engineers and recruiters at aerospace, space, defence-adjacent and electronics companies in Australia (internships now, graduate roles from 2028).
2. Academic supervisors assessing me for research internships and an honours thesis.
3. Rocketry/FSAE teammates and other students.

The site must never contradict my resume. Dates, titles and what I did personally must match the resume exactly. If the resume changes, the site changes.

## B2. About me (facts to use verbatim)

- Full name: Dang Khoa Huynh. Display name on the site: Dang Khoa Huynh. Pronounced roughly "Dung Kwa Hwin"; first name is Dang Khoa, surname Huynh.
- University of Sydney, Bachelor of Engineering (Honours), Mechatronics with Space Engineering, Robotics and Intelligent Systems specialisation. Started Semester 2 2024; third year in 2026; expected graduation 2028.
- WAM 90.3; Dalyell Scholar; Dean's List of Excellence in Academic Performance 2025.
- From Vietnam; international student in Sydney, NSW, Australia.
- Long-term goal: a career in the aerospace/space industry, in electronics and embedded hardware.
- Contact: hhdangkhoa06@gmail.com; linkedin.com/in/dang-khoa-huynh-8646b431b (may be replaced with a custom LinkedIn URL; ask before publishing); GitHub: github.com/DangKhoaHuynh710. Phone number is on the resume PDF only and is deliberately not in this repo.
- Describe me as a student engineer who designs, builds and tests flight and ground electronics. Do not use words like "passionate", "dynamic", "innovative" or similar adjectives about me anywhere on the site. Show evidence instead.

## B3. Skills (as stated on my resume; do not inflate)

- Electrical design: schematic and PCB layout (Altium, KiCad), cable harnessing, MOSFET drivers, SPICE/Falstad simulation.
- Build and test: SMD soldering and PCB assembly, bring-up and test firmware, oscilloscope and function generator debugging.
- Embedded: STM32 (H7, F3), ESP32-S3, Raspberry Pi, FreeRTOS, PlatformIO, ARM assembly, SPI/I2C/UART/CAN, WiFi (ESP32 AP), Bluetooth.
- Programming and CAD: C/C++, Python (NumPy, Pandas, OpenCV), MATLAB, ROS2, Git, Linux; Fusion 360, SolidWorks, Onshape.
- Engineering practice: requirements management, design reviews, hazard analysis, technical reporting (LaTeX).

## B4. Experience and projects (content inventory for project pages)

Each project page follows the same structure: Overview → My role → Photos → Design decisions (2–4, each with the reason) → Testing and what broke → Result → Links (report, code, news) where I am allowed to share them.

### B4.1 Rock Daisy payload — USYD Rocketry Team (2025–2026)  [FLAGSHIP PAGE, slug `rock-daisy`]
- Role: Payload Primary Electronics Engineer.
- Result: 1st place, SDL Payload Challenge, International Rocket Engineering Competition (IREC) 2026, Spaceport Midland, Texas; ~150 teams from 20+ countries. The USYD team was the first to win this category twice. Public source: https://www.sydney.edu.au/news-opinion/news/2026/07/09/sydney-students-win-big-at-international-rocketry-competition.html (the team's rocket was called Galah; Rock Daisy was the payload).
- What it did: a CubeSat-class in-situ resource utilisation (ISRU) experiment: electrostatic separation of regolith (ilmenite) simulant between high-voltage electrode plates in microgravity, filmed by an onboard camera; particle motion tracked afterwards with computer vision.
- What I built: the PCB and firmware for the dual-ESP32-S3 flight computer; accelerometer (ADXL375) and barometer (MS5607) on a 20 MHz SPI bus; SD logging; servo, DC motor and buzzer actuation; OLED status display; 7 kV high-voltage switching. A second ESP32-S3 camera node (OV5640) recording in-flight footage. A five-task FreeRTOS architecture with a launch-triggered flight state machine (idle → motor → servo → HV → done). A WiFi checkout dashboard used for bring-up and pre-flight testing: actuate each component individually (motor, servos, HV module, camera), read live sensor telemetry and board health, and pull logs from the SD card. I assembled the flight PCB and designed and built the payload's internal cable harness and connector scheme. I assisted with the Python post-flight analysis pipeline (telemetry + video → PDF report) with a CV particle tracker.
- Photos/media to request from me: the assembled board, the payload stack, the harness, a screenshot of the checkout dashboard, in-flight camera frames, the competition photo.

### B4.2 Ground Support Equipment (GSE) Co-Lead — USYD Rocketry Team, Project Kookaburra (July 2026–present)  [THE "NOW" SECTION, slug `gse-pad-box`]
- Role: lead the electrical, electronics and software workstreams for the ground systems; manage and review the redesign of the launch controller, pad control box, antenna tracker and quick-disconnect electrical umbilical; coordinate requirements, design reviews, testing and documentation.
- Architecture I defined for the pad box electronics: a relay/valve-driver board, a power distribution board, a command hub and sensor nodes, communicating over RS-485 (Modbus RTU). Design principle: hardware sets every safe default; firmware can only change state after boot.
- Board I am designing (Altium, STM32H755): 12 channels switching fill-system valves, the umbilical release and the igniter through opto-isolated gate drivers and power MOSFETs, with per-channel fusing, flyback and TVS protection, and shunt-based current monitoring (INA3221). Core schematic (power, clocks, reset/boot, SWD, USB DFU) complete; driver/sense chain and connectors selected. Status will change; ask me for the current state before writing.
- Safety features worth describing in plain terms: hardware E-stop and arming key in series on the coil rail; relays/outputs fail open on loss of power; igniter path isolated.
- Compliance note: the team works to competition safety rulebooks. On the site, say "designed to competition safety rules" and do not cite rule numbers or reproduce rule text.

### B4.3 Low Voltage Engineer — Sydney Motorsport (USYD FSAE Electric) (2025–2026)  [slug `fsae-low-voltage`]
- Redesigned the tractive-system status light (TSAL) on a 12 V aluminium-core PCB with Cree XP-E2 LEDs at 700 mA; verified daylight visibility against competition rules with a photometric contrast-threshold analysis (LaTeX report).
- Designed a test motherboard for integration testing of the brake-system plausibility (BSPD) boards, which monitor pedal travel, and the control circuits that switch the vehicle's 480 V accumulator.
- Defined a two-board mixed-signal architecture: an ADC sensor-interface board plus a relay power board with smart high-side switches, per-channel fusing and a bus watchdog.

### B4.4 2-Axis Linear Motion Stage with Lidar Obstacle Avoidance (personal/coursework project)  [slug `linear-stage`]
- Bare-metal C on an STM32F3 Discovery board (no HAL), interrupt-driven. Two stepper motors via TMC2209 drivers; serial keyboard control from a laptop; wall avoidance using an RPLIDAR A1 (TODO: confirm exact model). I designed the electronics, cable harness and the 3D-printed rail, base and carriage parts.

### B4.5 Smaller items ("Other work" page, slug `other-work`)
- ESP32-S3 rocket flight computer prototype: accelerometer launch detection, 333 Hz 16-bit PWM servo control, buffered SD logging; servo control ported from a Raspberry Pi to the ESP32 to remove a board. This evolved into the Rock Daisy flight computer; present it as the prototype stage, not a separate achievement.
- Proposal for a 3U sounding-rocket payload: helium DBD cold-plasma jet and EWOD fluid transport; designed the gas delivery chain and HV nozzle (LaTeX proposal).
- STM32F3 escape-room game in ARM assembly and bare-metal C (coursework): UART framing, I2C sensor drivers, clock configuration.

### B4.6 Coursework worth listing on the About page
Mechatronic Systems Design (C++/ROS2, TurtleBot), Mechatronics 2 (STM32 assembly and bare-metal C), Space Engineering 1 & 2 (satellite constellations, mission planning, orbital mechanics), Electronic Devices and Circuits (diode/transistor/MOSFET circuits), Engineering Analysis (PDEs, numerical methods), Machine Learning.

## B5. Writing style for the site

- Plain English, first person, past tense for finished work and present tense for current work.
- Short paragraphs. Numbers over adjectives: "20 MHz SPI", "7 kV", "12 channels", "150 teams".
- Explain any acronym on first use on each page (ISRU, GSE, BSPD, TSAL). Never use internal team jargon (SRAD, Dikarya, Insignis, rulebook codes) without a plain-English gloss, and avoid it where a plain phrase works.
- Each project page includes at least one thing that went wrong and how I found it; engineers trust that more than the result.
- Australian English spelling (analyse, colour, optimise).
- Do not invent details. If something is not in this file and I haven't said it in the conversation, ask me or leave a clearly marked `TODO:`.

## B6. Rules and constraints

- Permission: before publishing anything from USYD Rocketry Team or Sydney Motorsport that goes beyond what is already public (photos of hardware I built, competition results, my own descriptions), I must confirm with the team. Schematics, internal documents, Notion content and rulebook text stay off the site unless I explicitly say they're cleared. Default to describing, not reproducing. This is what the `cleared` flag enforces.
- Consistency: the resume is the source of truth for dates and titles (see B8).
- Privacy: phone number only on the resume PDF, never in site HTML or in this repo. Email can be on the site (obfuscated mailto).
- Do not describe me as a graduate, engineer or professional; I am a third-year student until I say otherwise.
- Keep a `CHANGELOG.md` in the repo; each content update gets a dated line.

## B7. How to work with me

- When I ask for a page, draft the content in Markdown first for my review, then build it.
- Ask for photos and specific numbers rather than guessing; mark gaps as `TODO:`.
- When I share new project details, offer to add them to the relevant content file and to this file so it stays current.
- Before each deploy, run the checklist in A6.
- Keep the first version small: Home, About, Resume, and the Rock Daisy project page done well. Add the other project pages one at a time.

## B8. Exact resume titles (use verbatim in `role` and `dates`)

- "Ground Support Equipment (GSE) Co-Lead, USYD Rocketry Team" — "July 2026–Present"
- "Payload Primary Electronics Engineer, USYD Rocketry Team – Rock Daisy Payload" — "2025–2026"
- "Low Voltage Engineer, Sydney Motorsport (FSAE Electric)" — "2025–2026"

## B9. Still open

1. Which projects are cleared by the rocketry team and FSAE team for photos and description (set `cleared: true` only when confirmed).
2. Custom domain — later, if at all.
3. Final LinkedIn URL (custom slug or current one).
4. Which photos exist; whether there is a video of the checkout dashboard or the launch.
5. Whether the site is live before or after the current internship applications conclude (current plan: minimal v1 as soon as Rock Daisy material is cleared; full build over the 2026/27 summer break).
