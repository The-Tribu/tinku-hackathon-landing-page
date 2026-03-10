# Contract: i18n URL Structure

## Routing Pattern

Spanish is the default locale (no prefix). English uses `/en/` prefix.

| Page | Spanish (default) | English |
|------|-------------------|---------|
| Landing page | `/` | `/en/` |
| Blog listing | `/blog/` | `/en/blog/` |
| Blog post | `/blog/{slug}/` | `/en/blog/{slug}/` |

## Language Detection Flow

```
1. First visit (no localStorage preference):
   ├── Read navigator.language / navigator.languages
   ├── If starts with "en" → redirect to /en/ (if not already there)
   ├── If starts with "es" or anything else → stay on / (Spanish default)
   └── Store preference in localStorage("tinku-lang")

2. Return visit (localStorage preference exists):
   ├── Read localStorage("tinku-lang")
   └── Redirect to matching locale if different from current URL

3. Manual toggle (language switcher):
   ├── Update localStorage("tinku-lang")
   └── Navigate to alternate locale URL
```

## HTML `lang` Attribute

- Spanish pages: `<html lang="es">`
- English pages: `<html lang="en">`

## Meta Tags per Locale

Each locale page includes:
- `<link rel="alternate" hreflang="es" href="https://DOMAIN/{path}">`
- `<link rel="alternate" hreflang="en" href="https://DOMAIN/en/{path}">`
- `<link rel="alternate" hreflang="x-default" href="https://DOMAIN/{path}">`
