---
name: add-translation-keys
description: Add new translation keys to the Tinku bilingual system. Use when adding UI strings, updating text content, adding labels, or when translation parity tests fail.
---

# Add Translation Keys

## File Locations

- Spanish: `src/lib/translations/es.ts`
- English: `src/lib/translations/en.ts`
- Type enforcement: `en.ts` imports `TranslationKeys` from `es.ts`

## Steps

1. Add the key with Spanish value to `es.ts`
2. Add the same key with English value to `en.ts`
3. Run `pnpm test` to verify parity

Both files must have **identical keys** — TypeScript enforces this at compile time, and `tests/unit/translations.test.ts` verifies it at test time.

## Key Naming Convention

Use dot-notation: `section.subsection.element`

```
nav.apply           # Navigation labels
hero.cta.apply      # Section → sub-area → element
faq.q1.question     # Section → item ID → field
tracks.ai.name      # Section → item ID → field
```

## Brand Terms (Never Translate)

These stay in Spanish in `en.ts`:

- `"Ritual CreAItivo"` — event tagline
- `"Tu vIAje comienza aquí"` — event motto
- `"Tinku"` — event name
- Sponsor and organizer proper names

## Referencing in Components

```typescript
// In Astro components
import { getLangFromUrl, useTranslations } from "@/lib/i18n";
const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
// Usage: t("section.key")
```

```typescript
// In data files — reference the key, don't call t()
import type { TranslationKey } from "../i18n";
export interface Item {
  nameKey: TranslationKey;
}
```

## Checklist

- [ ] Key added to `es.ts` with Spanish value
- [ ] Same key added to `en.ts` with English value
- [ ] Brand terms remain in Spanish in English translation
- [ ] `pnpm test` passes (translation parity)
