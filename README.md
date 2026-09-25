# konsep-porto

Personal portfolio for Muhammad Davian Shah. Vite + React 19 + TypeScript + Tailwind CSS 4,
a single page with no backend.

## Commands

```bash
npm install
npm run dev        # dev server, http://localhost:5173
npm run build      # typecheck, then build into dist/
npm run preview    # serve dist/, http://localhost:4173
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

## Structure

```
index.html            entry, title + fonts
src/
  main.tsx            mounts React
  App.tsx             section order + skip link
  styles/  tokens.css (colors, typography) · globals.css (reset, utilities)
  components/
    layout/     Footer.tsx (credit + icon links)
    ui/         tubelight-navbar (floating nav) · MacWindow (window chrome) · SectionHeading · ManifestRow
    sections/   Hero · About · Projects · Skills · Education · TerminalSection
  data/         content source, copied from ~/web_porto_mpf/src/data
  hooks/        useActiveSection · useTypewriter
  lib/          nav.ts (section order) · terminal.ts (command registry + virtual FS) · cn.ts
public/         favicon.svg
artifacts/      verification screenshots
docs/           design specification
```

`src/data/*.ts` is the source of truth for content. Fix the data in the original
repository first, then copy it over. All prose on this site is written in English.

## Deploy

`npm run build` produces `dist/`. `base: './'` in `vite.config.ts` lets
`dist/index.html` be opened straight from the file system, or hosted under any
subpath (GitHub Pages, Netlify, Cloudflare Pages) with no extra configuration.
