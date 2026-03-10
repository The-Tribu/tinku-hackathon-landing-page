---
name: add-landing-section
description: Add or modify a landing page section for the Tinku site. Use when the user wants to add a new section, modify an existing section, or change landing page content structure.
---

# Add Landing Section

## Workflow

1. **Create the component** in `src/components/home/SectionName.astro`
2. **Add translation keys** to both `src/lib/translations/es.ts` and `en.ts`
3. **Add data file** (if needed) in `src/lib/data/section.ts` with typed arrays referencing translation keys
4. **Integrate into pages** — add to both `src/pages/index.astro` and `src/pages/en/index.astro`
5. **Add section divider** — place `<SectionDivider />` between sections
6. **Verify** — run `pnpm build && pnpm test`

## Component Template

```astro
---
import SectionLabel from "@/components/ui/SectionLabel.astro";
import { getLangFromUrl, useTranslations } from "@/lib/i18n";

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
---

<section id="section-id" class="py-20 px-4">
  <div class="max-w-6xl mx-auto">
    <SectionLabel text={t("section.label")} />
    <h2 class="text-3xl sm:text-4xl font-inter font-black text-text-primary mb-4">
      {t("section.title")}
    </h2>
    <!-- Section content -->
  </div>
</section>
```

## Design Tokens

Always use CSS variable classes, never raw hex:

| Token Class | Usage |
|-------------|-------|
| `bg-bg` | Page background (#020617) |
| `bg-surface` | Cards, elevated surfaces (#1E1B4B) |
| `text-brand` | Accent color (#C621E5) |
| `text-text-primary` | Headings (#F5F5F5) |
| `text-text-secondary` | Body text (#A1A1C4) |
| `text-text-muted` | Labels, captions (#6366A0) |

## Typography

- Headings: `font-inter font-black`
- Body text: `font-satoshi`
- Monospace (timers, code): `font-mono`

## Interactive Components

If the section needs client-side JS (accordion, search, animation), use a `.svelte` file with `client:visible` (below fold) or `client:load` (above fold).

## Checklist

- [ ] Section has an `id` attribute for nav anchor links
- [ ] Translation keys added to both `es.ts` and `en.ts`
- [ ] `pnpm test` passes (translation parity check)
- [ ] Section added to both locale landing pages
- [ ] Nav link added in `MainLayout.astro` `navLinks` array (if applicable)
