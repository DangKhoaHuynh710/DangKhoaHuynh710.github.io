// Site-wide constants. Phone number is deliberately absent (CLAUDE.md B6).
export const SITE = {
  name: 'Dang Khoa Huynh',
  title: 'Dang Khoa Huynh',
  description:
    'Student engineer at the University of Sydney who designs, builds and tests flight and ground electronics.',
  email: 'hhdangkhoa06@gmail.com',
  linkedin: 'https://www.linkedin.com/in/dang-khoa-huynh-8646b431b', // TODO: confirm final URL (CLAUDE.md B9.3)
  github: 'https://github.com/DangKhoaHuynh710',
};

export const NAV = [
  { href: '/about/', label: 'About' },
  { href: '/projects/', label: 'Projects' },
  { href: '/now/', label: 'Now' },
  { href: '/resume/', label: 'Resume' },
];

/** Fixed section order for project pages (CLAUDE.md A2). */
export const PROJECT_SECTIONS = [
  'Overview',
  'My role',
  'Photos',
  'Design decisions',
  'Testing and what broke',
  'Result',
  'Links',
];

/** Encode a string as HTML numeric entities so the address is not plain text in the HTML. */
export function entityEncode(s: string): string {
  return Array.from(s)
    .map((c) => `&#${c.codePointAt(0)};`)
    .join('');
}

/** Date as "21 October 2026" in Australian English. */
export function formatDate(d: Date): string {
  return new Intl.DateTimeFormat('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Australia/Sydney',
  }).format(d);
}
