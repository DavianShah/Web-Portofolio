# Portfolio Rebuild: cyber-terminal v2

Date: 2026-09-25
Status: approved by owner

## Design Read

> Personal portfolio for recruiters + collaborators, in a cyber-terminal language with macOS window chrome, dial ENERGY 2 / RHYTHM 3 / MOTION 1.

- **ENERGY 2**: strong identity, still scannable by a recruiter in ten seconds.
- **RHYTHM 3**: the four/six sections must not share one layout template.
- **MOTION 1**: hover and focus states only, plus one `printf` typing sequence. The typing is content, not choreography, and has a `prefers-reduced-motion` fallback.

## Stack

Vite + React 19 + TypeScript + Tailwind CSS v4. Single page, no router. Dependencies kept to `react`, `react-dom`, `clsx`, `tailwind-merge`.

Deliberately not taken from the reference project `~/web_porto_mpf`:

| Omitted | Reason |
| --- | --- |
| `lucide-react` | R-04 bans an icon set picked for its library look; this design needs no icons |
| `framer-motion` | MOTION 1 |
| `i18n/`, `LanguageToggle` | content is Indonesian only |
| `playground/page`, router | R-24: no nav item pointing at a page that does not exist |
| `ScrollProgress`, `GlassPanel` | decoration, R-10 |

## Data

`src/data/{types,personal,projects,skills,education,social}.ts` are copied **verbatim** from `~/web_porto_mpf/src/data/`. Nothing is edited, filled in, or invented. The `@/` path alias is kept, so `tsconfig.json` and `vite.config.ts` both map `@/*` to `./src/*`.

Fields that are empty stay empty: `image: null`, `github: undefined`, `demo: undefined`. No dead controls are rendered from them (R-26).

## Sections and composition

| Section | Composition | Focal point |
| --- | --- | --- |
| Hero | asymmetric: identity block left, `main.c` editor window right | the editor window |
| About | `bio` set as a pull paragraph beside a small key/value block from `personal` | the bio |
| Projects | manifest list, one row per project: index, title, tech, status; description on an openable second line | the first row |
| Skills | neofetch two-column readout driven by `skillGroups` | the ASCII padlock |
| Education | timeline list driven by `education[]` | the current entry |
| Terminal | full-width interactive shell, prompt top-left | the caret |
| Footer | compact bar: identity line + the four real `socialLinks` | the email address |

## Navigation

- `>720px`: six bracket tabs in the sticky status bar, `aria-current` driven by scrollspy.
- `<=720px`: a single `[label v]` button opening a panel list. Closes on Escape, on outside click, and after a selection. 44px tap targets, bar height stays about 46px.

Reason: six tabs measure about 380px against 328px available at 360px wide. A scrollable strip would hide a nav item, which was already a shipped bug once.

## Visual system

- **Palette (R-29)**: neutrals `--bg` / `--panel` / `--text`, one accent `#22d3ee`, one terminal green for success lines only. Five syntax colours collapse to two: keyword = accent, string = green, everything else neutral.
- **Type (R-06)**: `IBM Plex Sans` for headings and prose, because it was drawn for technical documentation and stops the page being a wall of monospace. `JetBrains Mono` stays the voice of data, code, labels, and the terminal (PRD).
- **Window chrome**: 12px radius, three 12px traffic lights at 8px spacing, hairline under the title bar. Traffic lights are decorative `aria-hidden` spans, not buttons, so R-26 makes no demand of them.
- **Status bar**: the i3bar stays. It is the PRD identity motif and the nav.

## Terminal

Command registry in `src/lib/terminal.ts`, every command reading from `src/data`:

`help`, `whoami`, `about`, `projects`, `skills`, `education`, `contact`, `neofetch`, `ls`, `date`, `hire-me`, `matrix`, `sudo`, `clear`.

History on ArrowUp/ArrowDown, Tab cycling, Escape to clear, unknown command falls back to `help`. Success lines print a green check like the owner's reference image.

## Verification

- `npm run typecheck`, `npm run lint`, `npm run build`.
- `vite.config.ts` sets `base: './'` so `dist/index.html` opens over `file://`.
- `verify.js` pointed at `dist/index.html`; assertions cover the original 102 plus window chrome, manifest list, mobile menu, and the six sections.
- Screenshots written to `artifacts/screenshots/`.
- Delivery Gate printed with the deliverable.

## Out of scope

Light/dark toggle (fixed dark, justified by R-21: a terminal product), blog, certifications, work experience, any content not present in the reference data files.
