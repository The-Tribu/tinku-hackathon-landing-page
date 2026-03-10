---
name: run-quality-checks
description: Run the full quality check suite for the Tinku project. Use when verifying code quality, before committing changes, before deployment, or when the user asks to validate the project.
---

# Run Quality Checks

## Quick Check (run after every change)

```bash
pnpm build && pnpm test
```

This catches:
- Astro build errors (broken imports, bad Svelte syntax, content schema violations)
- Translation parity mismatches
- Countdown state machine regressions
- i18n routing logic errors

## Full Check (run before commit/deploy)

```bash
pnpm check        # Biome lint + format
pnpm typecheck    # TypeScript strict mode
pnpm test         # Vitest (30 unit tests)
pnpm build        # Static build (8 pages)
```

## What Each Check Catches

| Command | Catches |
|---------|---------|
| `pnpm check` | Lint errors, formatting issues, `any` types |
| `pnpm typecheck` | Type errors, missing imports, wrong prop types |
| `pnpm test` | Translation parity, countdown logic, i18n routing |
| `pnpm build` | Broken Astro/Svelte components, content schema errors, bad static paths |

## Common Failures

**Translation parity**: Added a key to `es.ts` but not `en.ts` (or vice versa).
Fix: Add the missing key to the other file.

**Svelte class directive**: Used `class:bg-surface/50={cond}` — slashes break Svelte's `class:` syntax.
Fix: Use string interpolation: `class="{cond ? 'active-class' : 'bg-surface/50'}"`.

**Content schema**: Blog post frontmatter missing required field.
Fix: Ensure `title`, `date`, `excerpt`, and `tags` are all present.

## Build Output Verification

After `pnpm build`, verify:
- 8 HTML pages generated (2 landing + 2 blog listings + 4 blog posts)
- `dist/` under 3MB total
- No JS chunk over 50KB
- `sitemap-index.xml` present in `dist/`
