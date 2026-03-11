# Tinku — Ritual CreAItivo

Bilingual landing page and blog for **Tinku**, the first AI hackathon in Cartago, Valle del Cauca. An 18-hour event where developers, designers, and tech professionals build real projects with AI.

**April 17–18, 2026 · Cartago, Colombia · Universidad Cooperativa de Colombia**

**Live site:** [https://hackathon.thetribu.dev](https://hackathon.thetribu.dev/)

## About

Tinku brings together 12 teams for 18 hours of intensive development. Participants tackle challenges across five tracks: Sustainability, Artificial Intelligence, Education, Cloud AI, and Human & Agents.

Main prizes: **$3.000.000 COP** distributed among top 3 teams (🥇 $1.500.000 · 🥈 $900.000 · 🥉 $600.000) + tech credits from Cursor, MiniMax, and Runway.

## Tech Stack

| Tool | Purpose |
|------|---------|
| Astro 6 | Static site generator with islands architecture |
| Svelte 5 | Interactive components (countdown, FAQ, nav, blog search) |
| TypeScript 5.9 | Type safety across the project |
| Tailwind CSS 4 | Utility-first styling with CSS custom properties |
| Biome | Unified linter and formatter |
| Vitest | Unit and component testing |
| Playwright | End-to-end testing |

## Features

- **12 landing page sections** — Hero, About, Tracks, Schedule, Prizes, Rules, Evaluation, FAQ, Sponsors, Footer CTA, Footer
- **Bilingual (ES/EN)** — Auto-detects browser language, manual toggle, localStorage persistence
- **Blog** — Markdown posts with tag filtering and full-text search
- **Tally popup** — CTA buttons open an in-page application form (form ID: `kdA05d`)
- **Dual-mode countdown** — Pre-event countdown, switches to remaining time during event
- **Canvas particle animation** — 90 particles with diamond knot formation and mouse repulsion
- **SEO optimized** — Structured data (Event schema), Open Graph, hreflang, sitemap
- **LLM optimized** — `/llms.txt`, `/robots.txt` allowing AI crawlers
- **Accessible** — Semantic HTML, `prefers-reduced-motion` support, ARIA attributes

## Prerequisites

- Node.js >= 20.x (LTS)
- pnpm >= 9.x

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The site runs at `http://localhost:4321/`.

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Astro dev server (localhost:4321) |
| `pnpm build` | Build static site to `dist/` |
| `pnpm preview` | Preview built site locally |
| `pnpm check` | Run Biome lint + format check |
| `pnpm check:fix` | Auto-fix Biome issues |
| `pnpm test` | Run Vitest unit tests |
| `pnpm test:e2e` | Run Playwright E2E tests |
| `pnpm typecheck` | TypeScript type check |

## Project Structure

```
src/
├── components/
│   ├── blog/        # BlogCard, BlogGrid, Search
│   ├── home/        # Hero, About, Tracks, Schedule, Prizes, etc.
│   ├── layout/      # Header, MobileMenu, Footer, LanguageToggle
│   └── ui/          # Button, Diamond, CountdownTimer, ParticleCanvas
├── content/
│   ├── blog/{en,es} # Blog posts per locale
│   └── tags/        # Tag definitions
├── layouts/         # MainLayout, BlogLayout
├── lib/
│   ├── translations/ # es.ts, en.ts
│   ├── data/        # Static data (tracks, prizes, rules, etc.)
│   ├── i18n.ts      # Language detection and routing
│   ├── countdown.ts # Timer state machine
│   └── content.ts   # Blog content helpers
├── pages/
│   ├── index.astro        # Spanish landing page
│   ├── blog/              # Spanish blog routes
│   └── en/                # English locale routes
└── styles/
    └── global.css         # Tailwind config, CSS variables, @font-face
```

## Deployment

The site is configured for **Vercel** static deployment. Push to the connected Git repo and Vercel auto-builds.

```bash
# Or deploy manually via CLI
vercel
```

## Adding Blog Posts

1. Create a Markdown file in `src/content/blog/{lang}/YYYY-MM-DD_slug.md`
2. Add frontmatter:

```markdown
---
title: "Post Title"
date: 2026-04-15
excerpt: "Short description (max 160 chars)"
tags: ["tracks", "tools"]
author: "Author Name"
---

Post body content...
```

3. Create a matching post in the other language directory (same slug pattern)
4. Run `pnpm dev` to preview

## Organized by

[The Tribu](https://github.com/The-Tribu)

## License

[MIT](LICENSE) — © 2026 The Tribu
