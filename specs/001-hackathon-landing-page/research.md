# Research: Tinku Hackathon Landing Page

**Date**: 2026-03-10  
**Feature**: `001-hackathon-landing-page`

## R-001: Astro + Svelte i18n Strategy (Browser Language Detection)

**Decision**: Use Astro's built-in i18n routing with `prefixDefaultLocale: false` for Spanish (default locale) and `/en/` prefix for English. On first visit, a lightweight client-side script reads `navigator.language`, stores the preference in `localStorage`, and redirects to the matching locale if different from current. The language toggle updates `localStorage` and navigates to the alternate locale URL.

**Rationale**: Astro's static routing generates separate HTML pages per locale at build time, giving perfect SEO (each locale has its own URL, `lang` attribute, and meta tags). No JavaScript runtime is needed for content rendering — only a small redirect script on first visit. This aligns with the performance budget (< 500KB, LCP < 2.5s) and the static-site constraint.

**Alternatives considered**:
- Client-side-only i18n (single HTML, swap content via JS): Rejected — poor SEO, large JS bundle, no distinct URLs per locale.
- Intlayer library: Rejected — adds dependency overhead for a simple two-locale setup.
- Server-side middleware redirect: Not applicable for static hosting.

## R-002: Blog Full-Text Search

**Decision**: Use Pagefind for full-text search. Pagefind generates static search indices at build time and loads them on-demand client-side. Combine with a Svelte component for tag-based filtering that works alongside Pagefind results.

**Rationale**: Pagefind is purpose-built for static sites — zero server dependencies, tiny initial footprint (loads index chunks only when the user types), and excellent Astro integration. It indexes the built HTML, supporting bilingual content automatically. Tag filtering is handled separately via Astro Content Collections metadata, combined with Pagefind results in the UI.

**Alternatives considered**:
- Fuse.js: Requires loading the entire search index upfront (all post content in JSON), which grows linearly with post count. Fine for < 50 posts but Pagefind scales better.
- Algolia/Meilisearch: Requires external service — overkill for a static event blog.

## R-003: Content Collections Structure (Bilingual Blog)

**Decision**: Use Astro 5 Content Layer API with glob loader. Blog posts organized as `src/content/blog/{en,es}/YYYY-MM-DD_slug.md`. Tags defined as `src/content/tags/*.md`. Dynamic routing via `src/pages/[lang]/blog/[...slug].astro`.

**Rationale**: Astro 5's Content Collections provide type-safe schema validation, automatic TypeScript types, and built-in support for the `{lang}/slug` pattern. The glob loader handles local Markdown/MDX files with zero configuration. Each locale gets pre-rendered static pages at build time.

**Alternatives considered**:
- Single file with frontmatter `lang` field: Rejected — harder to query by locale, less clear file organization.
- CMS-backed content: Out of scope (spec explicitly excludes CMS).

## R-004: Canvas Particle Animation in Astro Islands

**Decision**: Implement the particle constellation as a Svelte component with `client:load` directive. The component manages its own `<canvas>` element, animation loop via `requestAnimationFrame`, and mouse interaction. It renders immediately on page load (no lazy hydration) since it's above the fold in the hero.

**Rationale**: Svelte's reactivity model is ideal for animation state management. Using `client:load` ensures the animation starts as soon as the component hydrates, which is critical for the hero's visual impact. The canvas approach (vs. DOM particles) keeps the animation off the main thread's layout/paint pipeline, maintaining 60fps.

**Alternatives considered**:
- Pure vanilla JS `<script>` tag: Works but loses TypeScript safety, component encapsulation, and Astro's build optimization.
- Three.js/WebGL: Overkill for 2D particle animation; adds ~150KB to bundle.
- CSS-only particles: Cannot achieve mouse-repulsion interaction or diamond-knot formation.

## R-005: LLM Optimization Files

**Decision**: Serve `llms.txt`, `llms-full.txt`, and `robots.txt` as static files in `public/`. Generate `llms-full.txt` via a build script that extracts and concatenates all page content into clean Markdown. `llms.txt` is hand-authored with curated links.

**Rationale**: Static files in `public/` are served as-is by Astro with zero build overhead. The `llms-full.txt` build script ensures content stays in sync with the actual page. Hand-authoring `llms.txt` allows editorial control over which sections are highlighted.

**Alternatives considered**:
- Dynamic generation via Astro endpoint: Adds unnecessary complexity for content that changes only at build time.
- Only llms.txt (no llms-full.txt): Misses the comprehensive content dump that LLMs prefer for deep ingestion.

## R-006: Constitution Technology Override

**Decision**: The constitution (v1.0.0) specifies Next.js, React, ESLint + Prettier. The user's `tech_plan.md` explicitly overrides these with Astro 5, Svelte 5, and Biome. The override is documented in the plan's Complexity Tracking section. All other constitution principles (Code Quality, TDD, CDD, UX Consistency, Performance) remain in full effect.

**Rationale**: The constitution's Technology Standards section reflects an initial generic setup. The user's tech_plan.md is a more recent, feature-specific directive. Astro + Svelte is better suited for this project (static-first, islands architecture, minimal JS) than Next.js (full React hydration). Biome replaces ESLint + Prettier as a single unified tool.

**Mapping**:
- Constitution: Next.js → Override: Astro 5.16.15
- Constitution: React 18+ → Override: Svelte 5.48.0
- Constitution: ESLint + Prettier → Override: Biome 2.3.11
- Constitution: Vitest + Testing Library → Keep: Vitest + @testing-library/svelte + Playwright
- Constitution: pnpm → Keep: pnpm
- Constitution: Husky + lint-staged → Keep: Husky + lint-staged (with Biome)

## R-007: Testing Strategy Adaptation

**Decision**: Use Vitest for unit/integration tests, `@testing-library/svelte` for Svelte component tests, and Playwright for E2E tests. Astro components are tested via their rendered HTML output using Astro's test utilities.

**Rationale**: Vitest integrates natively with Astro's Vite-based build. `@testing-library/svelte` provides the same Testing Library API the constitution requires, just targeting Svelte instead of React. Playwright works identically regardless of framework.

**Alternatives considered**:
- Jest: Slower, requires more configuration with Vite/Astro ecosystem.
- Cypress: Heavier than Playwright for E2E; Playwright has better CI support.
