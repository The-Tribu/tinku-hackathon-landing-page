<!--
  Sync Impact Report
  ==================
  Version change: 0.0.0 → 1.0.0 (initial adoption)
  
  Modified principles: N/A (first version)
  
  Added sections:
    - Core Principles (5 principles: Code Quality, TDD, CDD, UX Consistency, Performance)
    - Technology Standards & Constraints
    - Development Workflow & Quality Gates
    - Governance
  
  Removed sections: N/A
  
  Templates requiring updates:
    - .specify/templates/plan-template.md        ✅ aligned (Constitution Check section matches principles)
    - .specify/templates/spec-template.md         ✅ aligned (user scenarios and success criteria support UX + performance)
    - .specify/templates/tasks-template.md        ✅ aligned (test-first workflow and parallel structure match TDD + CDD)
  
  Follow-up TODOs: None
-->

# Tinku Hackathon Landing Page Constitution

## Core Principles

### I. Code Quality (NON-NEGOTIABLE)

All code MUST meet strict quality standards before merge. This applies to
every file in the repository—components, utilities, styles, configuration,
and tests alike.

- Every module MUST have a single, clear responsibility.
- Functions MUST be pure where possible; side effects MUST be isolated
  and explicitly documented.
- Dead code, unused imports, and commented-out blocks MUST be removed
  before merge.
- Linting (ESLint) and formatting (Prettier) MUST pass with zero
  warnings and zero errors on every commit.
- TypeScript strict mode MUST be enabled; `any` types are forbidden
  unless justified with a code comment explaining why.
- Naming MUST be descriptive and consistent: components in PascalCase,
  hooks prefixed with `use`, utilities in camelCase, constants in
  SCREAMING_SNAKE_CASE.
- Maximum cyclomatic complexity per function MUST NOT exceed 10.

**Rationale**: A hackathon landing page is a public-facing artifact for
The Tribu. Sloppy code erodes trust, slows iteration, and makes
debugging under time pressure harder than it needs to be.

### II. Test-Driven Development (NON-NEGOTIABLE)

Every feature MUST follow the Red-Green-Refactor cycle. Tests are written
first, verified to fail, then implementation is written to make them pass.

- Unit tests MUST be written for all utility functions, hooks, and
  non-trivial logic before implementation.
- Component tests MUST verify rendered output, user interactions, and
  accessibility attributes using Testing Library.
- Integration tests MUST cover critical user journeys (page load, CTA
  interaction, responsive breakpoints).
- Test coverage MUST NOT drop below 80% for new code.
- Tests MUST be deterministic: no reliance on network, timers, or
  randomness without explicit mocking.
- Snapshot tests are FORBIDDEN for layout validation; prefer explicit
  assertions on structure and content.

**Rationale**: TDD catches regressions early, documents intended behavior,
and gives confidence to refactor under hackathon time pressure without
breaking existing functionality.

### III. Component-Driven Development

The UI MUST be built bottom-up from isolated, reusable components.
Each component is designed, developed, and tested in isolation before
integration into pages.

- Every visual element MUST be a self-contained component with its own
  props interface, styles, and tests.
- Components MUST be organized by atomicity: atoms (Button, Input, Icon),
  molecules (Card, NavItem), organisms (Header, Hero, Footer), and
  pages (LandingPage).
- Props MUST be typed with TypeScript interfaces; default values MUST
  be provided where sensible.
- Components MUST NOT fetch data or manage global state directly;
  data flows down via props, actions flow up via callbacks.
- Shared design tokens (colors, spacing, typography, breakpoints) MUST
  be defined in a single theme source and consumed via CSS variables or
  a theme provider.
- Each component MUST render correctly in isolation (verifiable via
  Storybook or equivalent).

**Rationale**: CDD enables parallel development, enforces visual
consistency, prevents regressions when components are reused across
sections, and makes the design system auditable.

### IV. User Experience Consistency

The landing page MUST deliver a cohesive, accessible, and predictable
user experience across all devices and interaction modes.

- Visual design MUST follow a documented design-token system: a single
  source of truth for colors, typography scale, spacing scale, border
  radii, and shadow elevations.
- Responsive behavior MUST be defined for at minimum three breakpoints:
  mobile (< 768px), tablet (768px–1024px), and desktop (> 1024px).
- All interactive elements MUST be keyboard navigable and have visible
  focus indicators meeting WCAG 2.1 AA contrast ratios.
- All images MUST have descriptive `alt` text; decorative images MUST
  use `alt=""` with `aria-hidden="true"`.
- Motion and animations MUST respect `prefers-reduced-motion` and MUST
  NOT exceed 300ms duration for UI transitions.
- Content hierarchy MUST use semantic HTML (`h1`–`h6` in order, `nav`,
  `main`, `section`, `footer`) verified by automated accessibility
  audits (axe-core or Lighthouse).
- Typography MUST maintain a minimum body text size of 16px and a
  minimum contrast ratio of 4.5:1 for normal text.

**Rationale**: The landing page is the first impression of the hackathon.
Inconsistent UX, broken responsiveness, or inaccessible content
directly damages credibility and excludes potential participants.

### V. Performance Requirements (NON-NEGOTIABLE)

The landing page MUST load fast and remain responsive on constrained
devices and networks.

- Lighthouse Performance score MUST be >= 90 on mobile simulation
  (Moto G Power on throttled 4G).
- Largest Contentful Paint (LCP) MUST be < 2.5 seconds.
- First Input Delay (FID) / Interaction to Next Paint (INP) MUST be
  < 200ms.
- Cumulative Layout Shift (CLS) MUST be < 0.1.
- Total transferred page weight MUST NOT exceed 500 KB (compressed).
- Images MUST use modern formats (WebP/AVIF) with responsive `srcset`
  and lazy loading for below-the-fold content.
- JavaScript bundle MUST be code-split; no single chunk MUST exceed
  50 KB (gzipped).
- Third-party scripts MUST be loaded asynchronously and MUST NOT block
  the critical rendering path.
- Font loading MUST use `font-display: swap` and MUST preload critical
  font files.

**Rationale**: Hackathon participants access the page from diverse
devices and networks worldwide. Poor performance translates directly
to abandonment and lost registrations.

## Technology Standards & Constraints

The following technology decisions are binding for all contributors:

- **Framework**: Next.js (App Router) with React 18+ and TypeScript
  strict mode.
- **Styling**: Tailwind CSS with a custom theme configuration derived
  from design tokens. No inline style objects unless dynamically
  computed.
- **Testing**: Vitest for unit/integration tests, Testing Library for
  component tests, Playwright for end-to-end tests.
- **Linting/Formatting**: ESLint (with `eslint-config-next` and
  accessibility plugin) + Prettier. Pre-commit hooks via Husky +
  lint-staged.
- **Accessibility**: axe-core integrated into CI; Lighthouse CI for
  performance and accessibility audits.
- **Deployment**: Static export or edge-rendered via Vercel (or
  equivalent). Assets served from CDN.
- **Version Control**: Git with conventional commits
  (`feat:`, `fix:`, `docs:`, `test:`, `chore:`).
- **Node Version**: LTS (>= 20.x). Enforced via `.nvmrc`.
- **Package Manager**: pnpm for deterministic, fast installs.
- **Browser Support**: Last 2 versions of Chrome, Firefox, Safari,
  Edge. No IE support.

## Development Workflow & Quality Gates

All changes MUST pass through the following workflow:

1. **Branch from `main`**: Feature branches follow
   `<issue-number>-<short-description>` naming.
2. **Local development loop**:
   - Write failing test (Red).
   - Implement minimum code to pass (Green).
   - Refactor while tests stay green (Refactor).
   - Run `pnpm lint && pnpm test` before committing.
3. **Pre-commit gates** (enforced by Husky):
   - ESLint + Prettier on staged files.
   - TypeScript type-check (`tsc --noEmit`).
   - Affected unit tests run via lint-staged.
4. **Pull request requirements**:
   - All CI checks MUST pass (lint, type-check, test suite,
     Lighthouse audit, accessibility audit).
   - At least one approval from a team member.
   - PR description MUST reference the spec or user story.
   - No `TODO` or `FIXME` comments unless tracked in an issue.
5. **Merge strategy**: Squash-and-merge to `main` with a conventional
   commit message.
6. **Post-merge**: Automated deployment to preview/staging. Production
   deploy requires explicit approval.

## Governance

This constitution is the highest-authority document for the Tinku
Hackathon Landing Page project. All development practices, code reviews,
and architectural decisions MUST comply with the principles defined here.

- **Amendments** require: (a) a written proposal referencing the
  principle(s) affected, (b) team review, (c) updated version number
  following semver, and (d) propagation to all dependent templates and
  documentation.
- **Versioning**: MAJOR for principle removals or incompatible
  redefinitions, MINOR for new principles or material expansions,
  PATCH for clarifications and wording fixes.
- **Compliance review**: Every pull request MUST include a self-check
  against the five core principles. Reviewers MUST verify compliance
  before approval.
- **Exceptions**: Any deviation from a NON-NEGOTIABLE principle
  requires a documented exception with justification, an expiration
  date, and a remediation plan tracked as a GitHub issue.

**Version**: 1.0.0 | **Ratified**: 2026-03-09 | **Last Amended**: 2026-03-09
