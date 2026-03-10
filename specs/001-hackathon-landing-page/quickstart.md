# Quickstart: Tinku Hackathon Landing Page

**Feature**: `001-hackathon-landing-page`  
**Branch**: `001-hackathon-landing-page`

## Prerequisites

- Node.js >= 20.x (LTS)
- pnpm >= 9.x

## Setup

```bash
# Clone and checkout feature branch
git checkout 001-hackathon-landing-page

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## Key Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Astro dev server (localhost:4321) |
| `pnpm build` | Build static site to `dist/` |
| `pnpm preview` | Preview built site locally |
| `pnpm check` | Run Biome lint + format check |
| `pnpm check:fix` | Auto-fix Biome issues |
| `pnpm test` | Run Vitest unit/integration tests |
| `pnpm test:e2e` | Run Playwright E2E tests |
| `pnpm typecheck` | TypeScript type check (`astro check`) |

## Project Structure

```
├── public/                  # Static assets (served as-is)
│   ├── fonts/               # Self-hosted Inter + Satoshi fonts
│   ├── images/              # Optimized logos, icons, blog images
│   │   ├── blog/            # Blog post images
│   │   └── brand/           # Logo variants, favicon
│   ├── llms.txt             # LLM summary file
│   ├── llms-full.txt        # LLM full content file
│   └── robots.txt           # Crawler rules
├── src/
│   ├── components/          # UI components (Astro + Svelte)
│   │   ├── blog/            # BlogCard, BlogGrid, Search
│   │   ├── home/            # Hero, About, Tracks, Schedule, Prizes, etc.
│   │   ├── layout/          # Header, MobileMenu, Footer, LanguageToggle
│   │   └── ui/              # Shared atoms: Button, Diamond, SectionLabel
│   ├── content/             # Astro Content Collections
│   │   ├── blog/
│   │   │   ├── en/          # English blog posts (YYYY-MM-DD_slug.md)
│   │   │   └── es/          # Spanish blog posts
│   │   └── tags/            # Tag definitions
│   ├── layouts/             # MainLayout.astro, BlogLayout.astro
│   ├── lib/                 # Utilities
│   │   ├── i18n.ts          # Language detection, getLangFromUrl(), useTranslations()
│   │   ├── translations/    # es.ts, en.ts — UI string dictionaries
│   │   ├── countdown.ts     # Timer logic (pre-event / during-event / completed)
│   │   └── content.ts       # Content collection helpers
│   ├── pages/               # File-based routing
│   │   ├── index.astro      # Spanish landing page (default locale)
│   │   ├── blog/
│   │   │   ├── index.astro  # Spanish blog listing
│   │   │   └── [...slug].astro  # Spanish blog post
│   │   └── en/
│   │       ├── index.astro  # English landing page
│   │       └── blog/
│   │           ├── index.astro      # English blog listing
│   │           └── [...slug].astro  # English blog post
│   └── styles/
│       └── global.css       # Tailwind config, CSS variables, @font-face
├── tests/
│   ├── unit/                # Vitest unit tests
│   ├── component/           # @testing-library/svelte component tests
│   └── e2e/                 # Playwright E2E tests
├── astro.config.mjs         # Astro config (i18n, Svelte, Tailwind, sitemap)
├── biome.json               # Biome linter/formatter config
├── tsconfig.json            # TypeScript strict mode config
├── package.json             # Dependencies and scripts
└── playwright.config.ts     # E2E test configuration
```

## Adding a Blog Post

1. Create a Markdown file in `src/content/blog/{lang}/YYYY-MM-DD_slug.md`
2. Add frontmatter:

```markdown
---
title: "Post Title"
date: 2026-03-15
excerpt: "Short description for the card (max 160 chars)"
tags: ["tracks", "ai"]
author: "Author Name"
---

Post body content here...
```

3. Ensure a matching post exists in the other language directory (same slug)
4. Run `pnpm dev` to preview

## Environment

No environment variables required. The site is fully static with no API keys or secrets.
