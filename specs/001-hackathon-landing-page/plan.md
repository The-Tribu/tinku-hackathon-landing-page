# Implementation Plan: Tinku Hackathon Landing Page

**Branch**: `001-hackathon-landing-page` | **Date**: 2026-03-10 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-hackathon-landing-page/spec.md`

## Summary

Build a bilingual (ES/EN) hackathon landing page + blog for Tinku — Ritual CreAItivo using Astro 5 with Svelte 5 islands. The site includes 12 landing page sections with a "Ritual Digital" (Andean-futuristic) visual identity, canvas-based particle animation, interactive FAQ accordion, dual-mode countdown timer, and a blog with full-text search (Pagefind) and tag filtering. Optimized for SEO (structured data, Open Graph) and LLM discoverability (llms.txt, GEO content structure).

## Technical Context

**Language/Version**: TypeScript 5.9.3  
**Primary Dependencies**: Astro 5.16.15, Svelte 5.48.0, Tailwind CSS 4.1.18, Pagefind (blog search)  
**Storage**: Static files only (Astro Content Collections for blog, JSON/TS for landing page data)  
**Testing**: Vitest + @testing-library/svelte + Playwright  
**Target Platform**: Static site deployed to CDN (Vercel/Netlify). Browser support: last 2 versions of Chrome, Firefox, Safari, Edge  
**Project Type**: Static website (landing page + blog)  
**Performance Goals**: Lighthouse >= 90 (mobile), LCP < 2.5s, INP < 200ms, CLS < 0.1, 60fps animations  
**Constraints**: < 500KB total page weight (compressed), no single JS chunk > 50KB (gzipped), self-hosted fonts, no external runtime dependencies  
**Scale/Scope**: 2 locales (ES/EN), 12 landing sections, ~20-50 blog posts, 5 tracks, 4 rules, 4 evaluation criteria, 8+ FAQ items, 8 sponsors  
**Linter/Formatter**: Biome 2.3.11 (replaces ESLint + Prettier)  
**Blog Content**: MDX via Astro Content Collections  
**i18n**: Astro built-in routing (ES default, EN at `/en/` prefix) + client-side `navigator.language` detection  
**Search**: Pagefind (build-time indexed, client-side execution) + Svelte tag filter component

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Code Quality — PASS

- Single responsibility: Each Astro/Svelte component has one purpose (section, UI element, or layout)
- Pure functions: Utility functions in `src/lib/` are pure; side effects isolated to Svelte components
- TypeScript strict mode: Enabled in `tsconfig.json`; no `any` types
- Linting: Biome configured with zero-warning policy (constitution says ESLint — overridden by tech_plan.md, see Complexity Tracking)
- Naming: PascalCase components, camelCase utilities, SCREAMING_SNAKE_CASE constants

### II. Test-Driven Development — PASS

- Unit tests: Vitest for all utilities (`countdown.ts`, `i18n.ts`, translation helpers)
- Component tests: `@testing-library/svelte` for interactive Svelte components (FAQ, MobileMenu, LanguageToggle, Search)
- Integration tests: Playwright for critical user journeys (page load, CTA click, responsive breakpoints, language switch)
- Coverage target: >= 80% for new code

### III. Component-Driven Development — PASS

- Atomic organization: `ui/` (atoms), section components (organisms), `layout/` (templates), `pages/` (pages)
- Props typed with TypeScript interfaces
- Design tokens via CSS variables in `global.css` consumed by Tailwind config
- Components render in isolation (testable via @testing-library)

### IV. User Experience Consistency — PASS

- Design tokens: Full color palette, typography scale, spacing via CSS variables
- Three responsive breakpoints: < 640px, 640–1024px, > 1024px
- Keyboard navigation: All interactive elements focusable with visible focus indicators
- Images: `alt` text on all images; decorative images use `alt=""` + `aria-hidden="true"`
- Motion: `prefers-reduced-motion` respected; transitions <= 300ms
- Semantic HTML: Proper heading hierarchy, landmarks (`nav`, `main`, `section`, `footer`)

### V. Performance — PASS

- Lighthouse >= 90 target via Astro static generation (zero JS by default except islands)
- LCP < 2.5s: Hero content server-rendered, fonts preloaded
- Page weight < 500KB: Astro tree-shakes unused JS; images in WebP/AVIF with `srcset`
- JS chunks < 50KB: Svelte islands are individually code-split
- Font loading: `font-display: swap` with preload hints

### Post-Phase 1 Re-check — PASS

No new violations introduced during design phase. Technology overrides documented below.

## Project Structure

### Documentation (this feature)

```text
specs/001-hackathon-landing-page/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 research findings
├── data-model.md        # Entity definitions and relationships
├── quickstart.md        # Setup and development guide
├── contracts/           # Interface contracts
│   ├── llms-txt.md      # llms.txt file format
│   ├── robots-txt.md    # robots.txt file format
│   └── i18n-url-structure.md  # URL routing and language detection
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
├── public/                  # Static assets (served as-is)
│   ├── fonts/
│   │   ├── inter/           # Inter font files (woff2)
│   │   └── satoshi/         # Satoshi font files (woff2)
│   ├── images/
│   │   ├── blog/            # Blog post images
│   │   └── brand/           # Logo variants, favicon, OG image
│   ├── llms.txt             # LLM summary
│   ├── llms-full.txt        # LLM full content
│   └── robots.txt           # Crawler rules
├── src/
│   ├── components/
│   │   ├── blog/            # BlogCard.astro, BlogGrid.svelte, Search.svelte
│   │   ├── home/            # Hero.astro, About.astro, Tracks.astro, Schedule.astro,
│   │   │                    # Prizes.astro, Rules.astro, Evaluation.astro, FAQ.svelte,
│   │   │                    # Sponsors.astro, FooterCTA.astro
│   │   ├── layout/          # Header.svelte, MobileMenu.svelte, Footer.astro,
│   │   │                    # LanguageToggle.svelte
│   │   └── ui/              # Button.astro, Diamond.astro, SectionLabel.astro,
│   │                        # SectionDivider.astro, CountdownTimer.svelte,
│   │                        # ParticleCanvas.svelte, OrbitalRings.astro
│   ├── content/
│   │   ├── blog/
│   │   │   ├── en/          # English blog posts
│   │   │   └── es/          # Spanish blog posts
│   │   └── tags/            # Tag definitions
│   ├── content.config.ts    # Content collection schemas
│   ├── layouts/
│   │   ├── MainLayout.astro # Landing page layout (nav + footer)
│   │   └── BlogLayout.astro # Blog post layout
│   ├── lib/
│   │   ├── i18n.ts          # getLangFromUrl(), useTranslations(), getLocalePath()
│   │   ├── translations/
│   │   │   ├── es.ts        # Spanish UI strings
│   │   │   └── en.ts        # English UI strings
│   │   ├── countdown.ts     # Timer state machine (pre-event / during / completed)
│   │   ├── content.ts       # Blog content collection helpers
│   │   └── data/            # Static data (tracks, schedule, prizes, rules, criteria, sponsors, faq)
│   ├── pages/
│   │   ├── index.astro              # ES landing page
│   │   ├── blog/
│   │   │   ├── index.astro          # ES blog listing
│   │   │   └── [...slug].astro      # ES blog post
│   │   └── en/
│   │       ├── index.astro          # EN landing page
│   │       └── blog/
│   │           ├── index.astro      # EN blog listing
│   │           └── [...slug].astro  # EN blog post
│   └── styles/
│       └── global.css               # Tailwind directives, CSS variables, @font-face
├── tests/
│   ├── unit/                # Vitest: utilities, data helpers
│   ├── component/           # @testing-library/svelte: interactive components
│   └── e2e/                 # Playwright: user journeys
├── scripts/
│   └── generate-llms-full.ts  # Build script to generate llms-full.txt
├── astro.config.mjs
├── biome.json
├── tsconfig.json
├── package.json
├── playwright.config.ts
└── .nvmrc                   # Node version (20.x)
```

**Structure Decision**: Single Astro project with Svelte islands for interactive components. No monorepo needed — the landing page and blog share the same layout, design tokens, and i18n system. Blog is handled by Astro's file-based routing and Content Collections.

## Complexity Tracking

> Constitution overrides justified by user's explicit `tech_plan.md` directive.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Constitution says Next.js; using Astro 5 | User's tech_plan.md explicitly specifies Astro. Astro's static-first architecture with islands is better suited for a landing page (zero JS by default, only hydrate interactive components). | Next.js ships full React hydration even for static pages, adding unnecessary bundle weight for a primarily static site. |
| Constitution says React; using Svelte 5 | User's tech_plan.md explicitly specifies Svelte. Svelte compiles away the framework runtime, producing smaller bundles. | React requires a runtime (~40KB gzipped) even for simple interactive components like FAQ accordion and countdown timer. |
| Constitution says ESLint + Prettier; using Biome | User's tech_plan.md explicitly specifies Biome. Biome is a single tool replacing two, with faster execution and unified configuration. | Two separate tools (ESLint + Prettier) require more config files and have slower execution; Biome achieves the same quality gates. |
