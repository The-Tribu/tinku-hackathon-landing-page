
I would like to use:
- Astro 5.16.15 — Static site generator (islands architecture)
- Svelte 5.48.0 — Interactive components
- TypeScript 5.9.3 — Type-safe development
- Tailwind CSS 4.1.18 — Utility-first styling with dark mode
- Biome 2.3.11 — Linter and formatter (replaces ESLint + Prettier)
- MDX — Enhanced Markdown for blog posts


I would like to manage this structure:

├── public/           # Static assets (images, fonts, icons)
├── src/
│   ├── components/   # Astro & Svelte components
│   ├── content/      # Blog posts (Content Collections)
│   ├── layouts/     # Page layouts
│   ├── lib/         # Utilities, types, translations
│   ├── pages/       # File-based routing
│   └── styles/      # Global CSS
├── docs/            # Project documentation
├── assets/          # README and documentation assets
└── astro.config.mjs

For SRC folder:
src/
├── components/          # UI components (Astro + Svelte)
│   ├── blog/            # Blog components (BlogCard, BlogGrid, Search)
│   ├── home/            # Homepage sections (Hero, Projects, Blog preview)
│   ├── layout/          # Header.svelte, MobileMenu.svelte
│   └── pages/           # Shared page components (*Page.astro)
├── content/             # Content Collections (blog posts, tags, series)
│   ├── blog/{en,es}/    # Blog posts by language (YYYY-MM-DD_slug.md)
│   ├── tags/            # Tag definitions (.md files with tier/order)
│   └── series/          # Series definitions
├── layouts/             # MainLayout, InternalLayout, ShowcaseLayout
├── lib/                 # Utilities (blog.ts, i18n.ts, translations/)
├── pages/               # File-based routing (EN root, ES in /es/)
│   ├── internal/        # Dev-only hub (excluded from production)
│   └── api/             # JSON endpoints
└── styles/              # global.css (Tailwind config)

public/images/blog/      # Blog images: posts/{slug}/, shared/, _staging/
scripts/                 # Build utilities (image optimization)
docs/                    # Project documentation

1. Language Standards
ALL code, comments, and documentation MUST be in English. Always update documentation after important changes.
