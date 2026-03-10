---
name: add-blog-post
description: Create bilingual blog posts for the Tinku hackathon site. Use when the user wants to add a blog post, write an article, create content for the blog, or publish event information.
---

# Add Blog Post

## Workflow

1. **Determine the topic and slug** from the user's request
2. **Create both locale files** simultaneously:
   - `src/content/blog/es/YYYY-MM-DD_slug.md`
   - `src/content/blog/en/YYYY-MM-DD_slug.md`
3. **Verify tags exist** — check `src/content/tags/` for available tag IDs
4. **Build and verify** — run `pnpm build` to confirm no schema errors

## Frontmatter Template

```markdown
---
title: "Post Title"
date: YYYY-MM-DD
excerpt: "Short description, max 160 characters for card display"
tags: ["tracks", "tools"]
author: "Author Name"
---
```

## Required Fields

| Field | Type | Constraints |
|-------|------|------------|
| `title` | string | Localized per language |
| `date` | date | `YYYY-MM-DD` format |
| `excerpt` | string | Max 160 chars, localized |
| `tags` | string[] | Must match IDs in `src/content/tags/` |
| `author` | string | Optional |
| `image` | string | Optional, path to image |

## Available Tags

Read `src/content/tags/` directory for current tags. Default set: `tracks`, `tools`, `logistics`, `community`.

To add a new tag, create `src/content/tags/tag-id.md` with:

```markdown
---
name_es: "Nombre en español"
name_en: "English name"
description: "What this tag covers"
order: 5
---
```

## Checklist

- [ ] Both `es/` and `en/` files created with matching date and slug pattern
- [ ] Excerpt under 160 chars in both languages
- [ ] Tags reference existing tag IDs
- [ ] Brand terms stay in Spanish in the English version ("Tinku", "Ritual CreAItivo")
- [ ] `pnpm build` succeeds with no content collection errors
