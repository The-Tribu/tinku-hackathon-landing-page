# Tasks: Tinku Hackathon Landing Page

**Input**: Design documents from `/specs/001-hackathon-landing-page/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Included per constitution TDD requirement (NON-NEGOTIABLE). Tests written first, verified to fail, then implementation.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the Astro project, install dependencies, configure tooling, and prepare static assets

- [ ] T001 Initialize Astro 5 project with pnpm, install core dependencies (astro, svelte, tailwindcss, typescript) and configure package.json scripts per quickstart.md
- [ ] T002 Configure astro.config.mjs with Svelte integration, Tailwind CSS, sitemap, i18n routing (defaultLocale: 'es', locales: ['es', 'en'], prefixDefaultLocale: false)
- [ ] T003 [P] Configure tsconfig.json with TypeScript strict mode (strict: true, no any types) and Astro path aliases
- [ ] T004 [P] Configure biome.json with zero-warning linting and formatting rules per constitution Code Quality requirements
- [ ] T005 [P] Create .nvmrc with Node 20.x LTS version
- [ ] T006 [P] Configure Vitest in vitest.config.ts with Svelte plugin and coverage thresholds (>= 80%)
- [ ] T007 [P] Configure Playwright in playwright.config.ts for E2E tests across Chrome, Firefox, Safari
- [ ] T008 Move and optimize brand assets from resources_for_agents/ to public/images/brand/ (logo variants, favicon in multiple sizes: 16x16, 32x32, 180x180, 512x512)
- [ ] T009 [P] Convert and install font files to public/fonts/inter/ and public/fonts/satoshi/ (subset to needed weights, convert to woff2 format)
- [ ] T010 [P] Create public/robots.txt per contracts/robots-txt.md specification
- [ ] T011 [P] Create public/llms.txt per contracts/llms-txt.md specification

**Checkpoint**: Project builds, dev server runs, linting passes, test runners configured

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Design tokens, global styles, i18n system, shared UI atoms, layouts, and static data — MUST complete before any user story

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Tests for Foundational

- [ ] T012 [P] Write unit tests for i18n utilities (getLangFromUrl, useTranslations, getLocalePath) in tests/unit/i18n.test.ts
- [ ] T013 [P] Write unit tests for countdown timer state machine (pre-event, during-event, completed transitions) in tests/unit/countdown.test.ts
- [ ] T014 [P] Write unit tests for translation parity (every key in es.ts exists in en.ts) in tests/unit/translations.test.ts

### Implementation

- [ ] T015 Create src/styles/global.css with Tailwind directives, CSS custom properties (--bg, --brand, --surface, --brand-glow, --brand-glow-strong, --text-primary, --text-secondary, --text-muted), @font-face declarations for Inter and Satoshi, and responsive breakpoint tokens
- [ ] T016 Implement i18n utilities in src/lib/i18n.ts: getLangFromUrl(), useTranslations(), getLocalePath(), client-side language detection script per contracts/i18n-url-structure.md
- [ ] T017 [P] Create Spanish translation dictionary in src/lib/translations/es.ts with all UI strings (nav, hero, about, tracks, schedule, prizes, rules, evaluation, faq, sponsors, footer, blog, meta)
- [ ] T018 [P] Create English translation dictionary in src/lib/translations/en.ts with matching keys (brand terms remain in Spanish per FR-023)
- [ ] T019 Implement countdown timer state machine in src/lib/countdown.ts with three states: PRE_EVENT, DURING_EVENT, COMPLETED per data-model state transitions
- [ ] T020 [P] Create static data files in src/lib/data/: tracks.ts, schedule.ts, prizes.ts, rules.ts, criteria.ts, sponsors.ts, faq.ts — typed arrays referencing translation keys
- [ ] T021 Create shared UI atom: Button component in src/components/ui/Button.astro (solid and ghost variants, brand glow hover, responsive sizing)
- [ ] T022 [P] Create shared UI atom: Diamond component in src/components/ui/Diamond.astro (section divider diamond shape with gradient lines)
- [ ] T023 [P] Create shared UI atom: SectionLabel component in src/components/ui/SectionLabel.astro (diamond marker + uppercase label text)
- [ ] T024 [P] Create shared UI atom: SectionDivider component in src/components/ui/SectionDivider.astro (thin diamond + gradient lines between sections)
- [ ] T025 Create MainLayout.astro in src/layouts/ with HTML shell (lang attribute, favicon, preloaded fonts, meta tags, OG tags, structured data Event schema, hreflang alternates), header slot, main content, and footer
- [ ] T026 Create Footer component in src/components/layout/Footer.astro with brand logo diamond, location info, dates, and copyright (bilingual)

**Checkpoint**: Foundation ready — dev server shows styled empty page with correct fonts, colors, i18n routing works, all foundational tests pass

---

## Phase 3: User Story 1 — Discover the Event and Apply (Priority: P1) 🎯 MVP

**Goal**: Hero section with logo, tagline, dual-mode countdown, stats strip, and CTA buttons

**Independent Test**: Load page → see hero with countdown, stats, CTAs → click "Aplicar" → directed to form

### Tests for User Story 1

- [ ] T027 [P] [US1] Write component test for CountdownTimer.svelte in tests/component/CountdownTimer.test.ts: pre-event mode shows days/hours/min/sec, during-event mode shows remaining time, completed mode shows finished state
- [ ] T028 [P] [US1] Write E2E test for hero section in tests/e2e/hero.spec.ts: page loads with logo, tagline, countdown, stats, CTAs; "Aplicar" button links to external form; "Ver agenda" scrolls to schedule

### Implementation for User Story 1

- [ ] T029 [US1] Create CountdownTimer.svelte in src/components/ui/ with client:load directive, dual-mode timer (pre-event/during-event/completed), 1-second interval update, glassmorphism box styling per specify_plan.md
- [ ] T030 [US1] Create Hero.astro in src/components/home/ with: event badge pill, Tinku logo (200px), "Ritual CreAItivo" tagline (AI highlighted in --brand), supporting text, CountdownTimer island, CTA row (solid "Aplicar" + ghost "Ver agenda"), stats strip with diamond dividers
- [ ] T031 [US1] Create Spanish landing page at src/pages/index.astro importing MainLayout and Hero, with localized meta tags and structured data
- [ ] T032 [US1] Create English landing page at src/pages/en/index.astro importing MainLayout and Hero, with English meta tags and brand terms in Spanish per FR-023

**Checkpoint**: Hero section fully functional in both languages with live countdown and working CTAs

---

## Phase 4: User Story 2 — Explore Event Details via Navigation (Priority: P2)

**Goal**: Sticky nav bar with logo, section links, language toggle, "Aplicar" CTA, and Blog link

**Independent Test**: Scroll page → nav stays fixed → click section link → smooth scroll → toggle language → page switches locale

### Tests for User Story 2

- [ ] T033 [P] [US2] Write component test for Header.svelte in tests/component/Header.test.ts: renders logo, nav links, language toggle, CTA button; sticky behavior
- [ ] T034 [P] [US2] Write component test for LanguageToggle.svelte in tests/component/LanguageToggle.test.ts: toggles between ES/EN, updates localStorage
- [ ] T035 [P] [US2] Write component test for MobileMenu.svelte in tests/component/MobileMenu.test.ts: opens/closes overlay, renders all links

### Implementation for User Story 2

- [ ] T036 [US2] Create LanguageToggle.svelte in src/components/layout/ with ES/EN switch, localStorage persistence, and navigation to alternate locale URL
- [ ] T037 [US2] Create MobileMenu.svelte in src/components/layout/ with full-screen overlay, section links, Blog link, language toggle, "Aplicar" CTA, close on link click/overlay click
- [ ] T038 [US2] Create Header.svelte in src/components/layout/ with client:load: sticky positioning, backdrop-blur, Tinku logo (34px), section anchor links with smooth scroll, Blog link (FR-032), LanguageToggle, "Aplicar" button, hamburger icon toggling MobileMenu on mobile (< 640px)
- [ ] T039 [US2] Integrate Header into MainLayout.astro, add anchor IDs to all landing page sections

**Checkpoint**: Full navigation works — sticky header, smooth scroll to sections, language toggle switches locale, mobile hamburger opens overlay

---

## Phase 5: User Story 3 — Understand Hackathon Tracks and Prizes (Priority: P2)

**Goal**: Tracks section with 5 interactive cards and Prizes section with main + secondary prizes

**Independent Test**: Scroll to Tracks → see 5 cards with emojis, names, descriptions → scroll to Prizes → see $1,000 main + 3 secondary

### Tests for User Story 3

- [ ] T040 [P] [US3] Write E2E test for tracks and prizes sections in tests/e2e/tracks-prizes.spec.ts: 5 track cards visible with correct content, prize structure displays correctly, content switches on language change

### Implementation for User Story 3

- [ ] T041 [P] [US3] Create Tracks.astro in src/components/home/ with section label, title, description, 3+2 card grid (--surface bg, emoji, name, description), hover glow + lift effect per specify_plan.md
- [ ] T042 [P] [US3] Create Prizes.astro in src/components/home/ with centered main prize card ($1,000 gradient text, --brand border, glow shadow) and 3 secondary cards (Cursor, MiniMax, Runway)
- [ ] T043 [US3] Add Tracks and Prizes sections to both locale landing pages (src/pages/index.astro, src/pages/en/index.astro) with section dividers

**Checkpoint**: Tracks and Prizes render correctly with all content in both languages, hover effects work

---

## Phase 6: User Story 4 — Review Rules and Evaluation Criteria (Priority: P3)

**Goal**: Rules section with 4 delivery requirement cards and Evaluation Criteria strip with 4 judging dimensions

**Independent Test**: Scroll to Rules → see 4 cards (Pitch, Deck, Repo, Product) → scroll to Evaluation → see 4 numbered criteria

### Implementation for User Story 4

- [ ] T044 [P] [US4] Create Rules.astro in src/components/home/ with 2x2 card grid (--surface bg, 3px --brand top border, emoji + title + description)
- [ ] T045 [P] [US4] Create Evaluation.astro in src/components/home/ with 4-item connected strip (--surface bg), large --brand numbers (44px, 70% opacity), name + description
- [ ] T046 [US4] Add Rules and Evaluation sections to both locale landing pages with section dividers

**Checkpoint**: Rules and Evaluation render correctly with all content in both languages

---

## Phase 7: User Story 5 — Get Answers from FAQ (Priority: P3)

**Goal**: Collapsible FAQ accordion with smooth animations and diamond rotate indicator

**Independent Test**: Scroll to FAQ → see collapsed questions → click question → answer expands with animation → click again → collapses

### Tests for User Story 5

- [ ] T047 [P] [US5] Write component test for FAQ.svelte in tests/component/FAQ.test.ts: renders all questions collapsed, click expands answer, click again collapses, multiple items toggle independently

### Implementation for User Story 5

- [ ] T048 [US5] Create FAQ.svelte in src/components/home/ with client:visible: --surface cards, Inter SemiBold questions, rotating diamond indicator, smooth max-height transition, Satoshi answers in --text-secondary, bilingual content from data/faq.ts
- [ ] T049 [US5] Add FAQ section to both locale landing pages with section divider

**Checkpoint**: FAQ accordion fully interactive with smooth animations in both languages

---

## Phase 8: User Story 8 — Browse Blog for Event Information (Priority: P3)

**Goal**: Blog listing page with post cards, tag filtering, full-text search, and individual post pages

**Independent Test**: Click Blog in nav → see post grid with search/tags → filter by tag → search by keyword → click post → read full article

### Tests for User Story 8

- [ ] T050 [P] [US8] Write component test for BlogGrid.svelte in tests/component/BlogGrid.test.ts: renders post cards, tag filtering works, empty state shows message
- [ ] T051 [P] [US8] Write E2E test for blog in tests/e2e/blog.spec.ts: navigate to blog, filter by tag, search keyword, click post card, verify post content

### Implementation for User Story 8

- [ ] T052 [US8] Define content collection schemas in src/content.config.ts for blog posts (title, date, excerpt, tags, author, image) and tags (name_es, name_en, description, order)
- [ ] T053 [P] [US8] Create sample tag definitions in src/content/tags/ (tracks.md, tools.md, logistics.md, community.md)
- [ ] T054 [P] [US8] Create 2 sample blog posts per language in src/content/blog/{en,es}/ with frontmatter per data-model.md
- [ ] T055 [US8] Create blog content helpers in src/lib/content.ts: getPostsByLocale(), getPostBySlug(), getAllTags(), filterByTag()
- [ ] T056 [US8] Create BlogCard.astro in src/components/blog/ with post title, date, excerpt, tag pills, link to post page
- [ ] T057 [US8] Create BlogGrid.svelte in src/components/blog/ with client:load: card grid, tag filter bar, real-time keyword search input, empty state message, combined filtering logic
- [ ] T058 [US8] Create BlogLayout.astro in src/layouts/ with post title, date, author, tags, body content, back-to-blog link, localized meta tags
- [ ] T059 [US8] Create blog listing pages at src/pages/blog/index.astro and src/pages/en/blog/index.astro with BlogGrid island, search input, tag filters
- [ ] T060 [US8] Create blog post dynamic routes at src/pages/blog/[...slug].astro and src/pages/en/blog/[...slug].astro using getStaticPaths() from content collections
- [ ] T061 [US8] Add Pagefind integration: install pagefind, add postbuild script to package.json (`pagefind --site dist`), configure Search.svelte to use Pagefind API for full-text search

**Checkpoint**: Blog fully functional — listing page with tag filtering and search, individual posts render, bilingual routing works

---

## Phase 9: User Story 6 — Experience Visual Identity and Animations (Priority: P4)

**Goal**: Particle canvas, orbital rings, woven textures, scroll reveals, hover states, entrance animations

**Independent Test**: Load page → particles animate with mouse repulsion → orbital rings rotate → scroll down → sections fade in → hover cards → glow effect

### Tests for User Story 6

- [ ] T062 [P] [US6] Write component test for ParticleCanvas.svelte in tests/component/ParticleCanvas.test.ts: canvas renders, animation starts, respects prefers-reduced-motion

### Implementation for User Story 6

- [ ] T063 [US6] Create ParticleCanvas.svelte in src/components/ui/ with client:load: canvas element, ~90 particles (12 forming diamond knot), floating animation via requestAnimationFrame, mouse-repulsion interaction (180px radius), prefers-reduced-motion fallback (static or disabled)
- [ ] T064 [US6] Create OrbitalRings.astro in src/components/ui/ with 3 CSS orbital rings (30s, 50s, 70s rotation speeds), 2 with glowing dot satellites, prefers-reduced-motion: paused
- [ ] T065 [US6] Add ParticleCanvas and OrbitalRings to Hero.astro as background layers (canvas behind content, orbital rings CSS positioned)
- [ ] T066 [US6] Add hero background layers: subtle grid overlay (60px grid, --brand 3% opacity, radial mask), faint horizontal scanlines
- [ ] T067 [US6] Implement scroll-triggered fade-up animations using IntersectionObserver: add data-animate attribute to all sections, CSS transition (opacity, translateY 30px), stagger delays, prefers-reduced-motion: no animation
- [ ] T068 [US6] Add hero entrance animation: staggered fadeIn + translateY with 0.1s–0.9s delays on content elements
- [ ] T069 [P] [US6] Add About section animated diamonds: 3 concentric pulsing glow diamond shapes in src/components/home/About.astro right column
- [ ] T070 [P] [US6] Add woven crosshatch background texture to About and FooterCTA sections (45deg diagonal lines in --surface color)

**Checkpoint**: Full visual experience — particles, orbital rings, scroll reveals, hover states, entrance animations all working with reduced-motion respect

---

## Phase 10: User Story 7 — Browse on Mobile Device (Priority: P2)

**Goal**: Validate and refine responsive layout across all breakpoints (< 640px, 640–1024px, > 1024px)

**Independent Test**: Load on mobile viewport → single-column layout, no overflow → tablet → 2-col grids → desktop → full layout

### Tests for User Story 7

- [ ] T071 [US7] Write E2E responsive tests in tests/e2e/responsive.spec.ts: verify mobile (375px) single-column layout, no horizontal overflow; tablet (768px) 2-column grids; desktop (1280px) full layout; hamburger menu works on mobile; content max-width constrained on > 1920px

### Implementation for User Story 7

- [ ] T072 [US7] Audit and fix responsive behavior across all landing page sections: verify Tailwind responsive classes (sm:, md:, lg:), stack grids on mobile, simplify timeline on tablet, constrain max-width on large screens
- [ ] T073 [US7] Audit and fix responsive behavior for blog pages: card grid stacks on mobile, search/filter layout adapts, post content readable on all viewports

**Checkpoint**: All content accessible and well-laid-out across mobile, tablet, and desktop viewports

---

## Phase 11: Remaining Landing Sections

**Purpose**: About, Schedule, Sponsors, Footer CTA — content sections not covered by earlier user stories

- [ ] T074 [P] Create About.astro in src/components/home/ with two-column grid (1.1fr/0.9fr), section label, "Bienvenid@ a Tinku" title, description, promise card (--surface bg, 4px --brand left border), woven crosshatch background
- [ ] T075 [P] Create Schedule.astro in src/components/home/ with vertical timeline, gradient line (--surface → --brand → --surface), diamond markers, time/name/description per entry from data/schedule.ts
- [ ] T076 [P] Create Sponsors.astro in src/components/home/ with tiered rows (Organizadores, Universidad, Tecnología, Comunidad), uppercase labels, sponsor pills with hover effect
- [ ] T077 [P] Create FooterCTA.astro in src/components/home/ with woven crosshatch background, "Tu vIAje comienza aquí" heading, "Aplicar al Hackathon" button, radial glow
- [ ] T078 Integrate About, Schedule, Sponsors, FooterCTA into both locale landing pages (index.astro, en/index.astro) with proper section IDs and dividers

**Checkpoint**: All 12 landing page sections render with correct content in both languages

---

## Phase 12: Polish & Cross-Cutting Concerns

**Purpose**: SEO, LLM optimization, performance, accessibility, documentation

- [ ] T079 [P] Create scripts/generate-llms-full.ts build script that extracts all page text content into public/llms-full.txt (clean Markdown, no HTML/CSS/JS)
- [ ] T080 [P] Add sitemap generation via @astrojs/sitemap in astro.config.mjs, configure for both locales
- [ ] T081 Implement JSON-LD structured data (Event schema) in MainLayout.astro head with localized event details
- [ ] T082 [P] Add Open Graph and Twitter Card meta tags to MainLayout.astro and BlogLayout.astro with localized titles, descriptions, and OG image
- [ ] T083 [P] Optimize images: convert logos to WebP, generate favicon set (ICO, apple-touch-icon, manifest icons) from isotipo source
- [ ] T084 Verify GEO content structure per FR-027: answer-first headings, one idea per heading, declarative statements in all sections
- [ ] T085 [P] Create AGENTS.md at project root explaining how to create blog posts, modify content, and common operations
- [ ] T086 Run accessibility audit (axe-core/Lighthouse): verify WCAG 2.1 AA compliance, fix any issues (focus indicators, alt text, heading hierarchy, contrast ratios)
- [ ] T087 Run Lighthouse performance audit on mobile: verify score >= 90, LCP < 2.5s, CLS < 0.1, total weight < 500KB; optimize as needed
- [ ] T088 Run full E2E test suite across both locales and all breakpoints; fix any failures
- [ ] T089 Final validation: run quickstart.md steps end-to-end on a clean checkout to verify developer experience

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Foundational — MVP target
- **US2 (Phase 4)**: Depends on Foundational — can parallel with US1
- **US3 (Phase 5)**: Depends on Foundational — can parallel with US1/US2
- **US4 (Phase 6)**: Depends on Foundational — can parallel with others
- **US5 (Phase 7)**: Depends on Foundational — can parallel with others
- **US8 (Phase 8)**: Depends on Foundational + US2 (blog link in nav)
- **US6 (Phase 9)**: Depends on US1 (hero) — visual layer on top of content
- **US7 (Phase 10)**: Depends on all content sections — responsive validation
- **Remaining Sections (Phase 11)**: Depends on Foundational — can parallel with user stories
- **Polish (Phase 12)**: Depends on all user stories complete

### User Story Dependencies

- **US1 (P1)**: Independent after Foundational
- **US2 (P2)**: Independent after Foundational; enhances US1 but not blocked by it
- **US3 (P2)**: Independent after Foundational
- **US4 (P3)**: Independent after Foundational
- **US5 (P3)**: Independent after Foundational
- **US7 (P2)**: Cross-cutting — validates all sections, run after content phases
- **US8 (P3)**: Needs Blog nav link from US2
- **US6 (P4)**: Needs Hero from US1 (adds visual layers on top)

### Within Each User Story

- Tests MUST be written and FAIL before implementation (TDD)
- Data/utilities before components
- Components before page integration
- Story complete before moving to next priority

### Parallel Opportunities

- T003, T004, T005, T006, T007 (all setup configs) — run in parallel
- T008, T009, T010, T011 (asset preparation) — run in parallel
- T012, T013, T014 (foundational tests) — run in parallel
- T017, T018 (translation dictionaries) — run in parallel
- T021–T024 (UI atoms) — run in parallel
- US1, US2, US3 can start in parallel after Foundational
- US4, US5 can start in parallel
- T074–T077 (remaining sections) — run in parallel
- T079–T083 (polish tasks) — run in parallel

---

## Parallel Example: After Foundational Complete

```text
# Developer A (MVP path):
T027, T028 → T029, T030 → T031, T032 (US1: Hero)

# Developer B:
T033, T034, T035 → T036, T037, T038 → T039 (US2: Navigation)

# Developer C:
T040 → T041, T042 → T043 (US3: Tracks + Prizes)
T074, T075, T076, T077 → T078 (Remaining sections)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (Hero)
4. **STOP and VALIDATE**: Hero section works with countdown, CTAs, both languages
5. Deploy preview

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. US1 (Hero) → **MVP deployed**
3. US2 (Navigation) + US3 (Tracks/Prizes) + Remaining Sections → Full landing page content
4. US4 (Rules) + US5 (FAQ) → Information-complete landing page
5. US8 (Blog) → Content depth for participants
6. US6 (Animations) → Visual polish
7. US7 (Mobile validation) + Polish → Production-ready

### Single Developer Sequential Path

T001–T026 (Setup+Foundation) → T027–T032 (US1) → T033–T039 (US2) → T040–T043 (US3) → T074–T078 (Remaining sections) → T044–T046 (US4) → T047–T049 (US5) → T050–T061 (US8) → T062–T070 (US6) → T071–T073 (US7) → T079–T089 (Polish)

---

## Notes

- [P] tasks = different files, no dependencies between them
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- TDD required: write tests first, verify they fail, then implement
- Commit after each task or logical group
- All code, comments, documentation in English (constitution requirement)
- Use CSS variables for all colors — never use hex values directly in components
- Respect prefers-reduced-motion for all animations
