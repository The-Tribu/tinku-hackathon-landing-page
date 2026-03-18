# Tinku Hackathon Landing Page — Agent Guide

## Stack

- **Astro 6** static site with **Svelte 5** islands and **Tailwind CSS 4**
- **TypeScript 5.9** in strict mode (`no any`)
- **Biome** for linting/formatting (not ESLint/Prettier)
- **Vitest** + **@testing-library/svelte** for unit/component tests
- **Playwright** for E2E tests
- **pnpm** as package manager

## Commands

```bash
pnpm dev          # Dev server at localhost:4321
pnpm build        # Static build to dist/
pnpm test         # Vitest unit tests
pnpm test:e2e     # Playwright E2E
pnpm check        # Biome lint + format
pnpm check:fix    # Auto-fix Biome issues
pnpm typecheck    # astro check
```

## Architecture

### i18n

- Spanish is the default locale (no URL prefix)
- English uses `/en/` prefix
- All UI strings live in `src/lib/translations/{es,en}.ts`
- Brand terms ("Tinku", "Ritual CreAItivo", "Tu vIAje comienza aquí") stay in Spanish in both locales
- Use `getLangFromUrl()` and `useTranslations()` from `src/lib/i18n.ts`

### Components

- **Astro components** (`.astro`) for static sections — no JS shipped
- **Svelte components** (`.svelte`) only for interactive parts needing client JS (countdown, FAQ accordion, header nav, blog search, particle canvas)
- Svelte components use `client:load` (above fold) or `client:visible` (below fold)

### Styling

- All colors via CSS custom properties: `--color-bg`, `--color-brand`, `--color-surface`, `--color-text-primary`, `--color-text-secondary`, `--color-text-muted`, `--color-brand-glow`, `--color-brand-glow-strong`
- Never use hex values directly in components — always reference the design tokens
- Tailwind classes map to these tokens: `bg-bg`, `text-brand`, `bg-surface`, etc.
- Typography: `font-inter` for headings/UI, `font-satoshi` for body text, `font-mono` for counters/times

### Data

- Static data arrays in `src/lib/data/*.ts` (tracks, prizes, rules, criteria, sponsors, faq)
- Each data item references translation keys, not raw strings
- Blog posts: Markdown in `src/content/blog/{en,es}/YYYY-MM-DD_slug.md`
- Tags: `src/content/tags/*.md` with `name_es` and `name_en` fields

### CTA Buttons

All "Apply" / "Aplicar" buttons open a **Tally popup** (not a link). Use these data attributes:

```html
data-tally-open="QK0koA"
data-tally-hide-title="1"
data-tally-emoji-text="👋"
data-tally-emoji-animation="wave"
```

The Tally embed script is loaded in `MainLayout.astro` `<head>`.

## Adding Content

### New blog post

1. Create `src/content/blog/{lang}/YYYY-MM-DD_slug.md`
2. Frontmatter: `title`, `date`, `excerpt` (max 160 chars), `tags` (array of tag IDs), `author` (optional)
3. Create matching post in the other locale directory
4. Available tags: `tracks`, `tools`, `logistics`, `community`

### New FAQ item

1. Add `faq.qN.question` and `faq.qN.answer` keys to both `es.ts` and `en.ts`
2. Add the item to the `faqItems` array in `src/lib/data/faq.ts`

### New sponsor

Add to the `sponsors` array in `src/lib/data/sponsors.ts` with `name`, `tier`, and optional `url`.

## Conventions

- All code, comments, and documentation in **English**
- All user-facing content is **bilingual** (ES/EN)
- Respect `prefers-reduced-motion` for all animations
- Test files: `tests/unit/` for utilities, `tests/component/` for Svelte, `tests/e2e/` for Playwright
- Commit messages: concise, imperative mood
