# Data Model: Tinku Hackathon Landing Page

**Feature**: `001-hackathon-landing-page`  
**Date**: 2026-03-10

All data is static content defined at build time. No runtime database or API.

## Entities

### Translation (UI strings)

Flat key-value maps per locale. Stored in `src/lib/translations/{es,en}.ts`.

| Field | Type | Description |
|-------|------|-------------|
| key | string | Dot-notation identifier (e.g., `nav.apply`, `hero.tagline`) |
| value | string | Localized string for the given locale |

**Constraints**: Every key present in `es.ts` MUST also be present in `en.ts`. TypeScript interface enforces parity at compile time.

---

### Track

Represents a hackathon challenge area. Defined in translation files (localized names/descriptions) with shared metadata.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique slug (e.g., `sustainability`, `ai`, `education`, `cloud-ai`, `human-agents`) |
| emoji | string | Emoji icon (e.g., `♻️`, `🤖`, `🎓`, `☁️`, `🧑‍💻`) |
| name | string | Localized display name |
| description | string | Localized short description |

**Constraints**: Exactly 5 tracks. IDs are stable across locales; only name and description are translated.

---

### Schedule Entry

Timeline items for the 24-hour event agenda. Defined as a static array in a data file.

| Field | Type | Description |
|-------|------|-------------|
| time | string | Display time (e.g., `09:00`, `14:30`) |
| name | string | Localized event name |
| description | string | Localized event description |
| isHighlight | boolean | Whether this is a key moment (visual emphasis) |

**Constraints**: Ordered chronologically. Times are display-only strings (no timezone computation needed).

---

### Prize

Reward tiers for the hackathon.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier (`main`, `cursor`, `minimax`, `runway`) |
| name | string | Localized prize name |
| value | string | Display value (e.g., `$1,000 USD`) |
| description | string | Localized description |
| tier | `'main' \| 'secondary'` | Visual prominence level |

**Constraints**: Exactly 1 main prize, 3 secondary prizes.

---

### Rule

Delivery requirements for hackathon submissions.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier (`pitch`, `deck`, `repo`, `product`) |
| emoji | string | Icon emoji |
| title | string | Localized rule title |
| description | string | Localized rule details |

**Constraints**: Exactly 4 rules.

---

### Evaluation Criterion

Judging dimensions.

| Field | Type | Description |
|-------|------|-------------|
| number | number | Display order (1–4) |
| name | string | Localized criterion name |
| description | string | Localized criterion description |

**Constraints**: Exactly 4 criteria, numbered 1–4.

---

### FAQ Item

Question-answer pairs for the FAQ accordion.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| question | string | Localized question text |
| answer | string | Localized answer text (may contain inline HTML for links/formatting) |

**Constraints**: Minimum 8 items (per FR-009). Order determines display order.

---

### Sponsor

Organizations backing the event.

| Field | Type | Description |
|-------|------|-------------|
| name | string | Organization name (not translated — proper names) |
| tier | `'organizer' \| 'university' \| 'technology' \| 'community'` | Sponsorship level |
| url | string? | Optional website link |
| logo | string? | Optional logo image path |

**Constraints**: Tiers have display order: organizer > university > technology > community.

---

### Blog Post (Content Collection)

Astro Content Collection with schema validation. Files: `src/content/blog/{en,es}/YYYY-MM-DD_slug.md`.

| Field | Type | Source | Description |
|-------|------|--------|-------------|
| title | string | frontmatter | Post title |
| date | date | frontmatter | Publication date |
| excerpt | string | frontmatter | Short description for cards (max 160 chars) |
| tags | string[] | frontmatter | Array of tag IDs |
| author | string? | frontmatter | Optional author name |
| image | string? | frontmatter | Optional cover image path |
| body | markdown | file content | Full post content |

**Constraints**: Slug derived from filename. Language derived from parent directory (`en/` or `es/`). Tags must reference existing Tag definitions.

---

### Tag (Content Collection)

Tag definitions for blog categorization. Files: `src/content/tags/*.md`.

| Field | Type | Source | Description |
|-------|------|--------|-------------|
| id | string | filename | Tag slug (e.g., `tracks`, `tools`, `logistics`) |
| name_es | string | frontmatter | Spanish display name |
| name_en | string | frontmatter | English display name |
| description | string? | frontmatter | Optional tag description |
| order | number | frontmatter | Display sort order |

**Constraints**: Tag IDs are stable and referenced by blog posts.

---

## Relationships

```
Track ──── (content defined in) ──── Translation
Schedule Entry ── (content defined in) ── Translation
Prize ──── (content defined in) ──── Translation
Rule ───── (content defined in) ──── Translation
Evaluation Criterion ── (content in) ── Translation
FAQ Item ── (content defined in) ──── Translation
Sponsor ── (names not translated) ──── Static data

Blog Post ──── many-to-many ──── Tag
Blog Post ──── belongs-to ──── Language (en | es)
```

## State Transitions

### Countdown Timer

```
PRE_EVENT ──(event start time reached)──> DURING_EVENT ──(event end time reached)──> COMPLETED
```

- **PRE_EVENT**: Shows days/hours/min/sec to event start
- **DURING_EVENT**: Shows hours/min/sec to event end
- **COMPLETED**: Shows finished state

### FAQ Item

```
COLLAPSED ──(click)──> EXPANDED ──(click)──> COLLAPSED
```

### Mobile Menu

```
CLOSED ──(hamburger click)──> OPEN ──(link click | close click | overlay click)──> CLOSED
```
