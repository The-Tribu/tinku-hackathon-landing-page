
# Tinku — Ritual CreAItivo | Landing Page Specification

## Context

Single landing page for **Tinku - Ritual CreAItivo**, the first hackathon in Cartago, Valle del Cauca.

- Event info: `docs/info_event.md`
- Tech stack: `docs/tech_plan.md`
- Landing page: `index.html`

---

## Sections

1. **Hero** — Logo, tagline, countdown, CTAs, stats
2. **About** — What is Tinku, the promise
3. **Tracks** — 5 challenge areas
4. **Schedule** — Full 24h timeline
5. **Prizes** — Main prize + tech credits
6. **Rules** — Delivery requirements
7. **Evaluation Criteria** — 4 judging dimensions
8. **FAQ** — Collapsible accordion
9. **Sponsors** — Tiered rows
10. **Footer CTA** — Repeat apply CTA + footer

---

## Design Guidelines

### Concept: "Ritual Digital"

The name **Tinku** comes from an Andean indigenous ritual of encounter between communities. The logo's interlocking diamond knot is inspired by Andean textile weaving patterns. The design fuses this **ritual/ancestral identity** with a **futuristic tech aesthetic**.

### Color Palette

| Token               | Hex         | Usage                                     |
|----------------------|-------------|-------------------------------------------|
| `--bg`               | `#020617`   | Page background                           |
| `--brand`            | `#C621E5`   | Primary accent, CTAs, highlights, links   |
| `--surface`          | `#1E1B4B`   | Cards, nav, footer, elevated surfaces     |
| `--brand-glow`       | `#C621E5` 25% opacity | Glows, shadows, hover states   |
| `--brand-glow-strong`| `#C621E5` 45% opacity | Intense glow effects           |
| `--text-primary`     | `#F5F5F5`   | Headings, primary text                    |
| `--text-secondary`   | `#A1A1C4`   | Body text, descriptions                   |
| `--text-muted`       | `#6366A0`   | Captions, labels, metadata                |

Dark-mode only. The `--bg` background has a deep blue undertone for depth.

### Typography

| Role              | Font     | Weights                     | Usage                              |
|-------------------|----------|-----------------------------|------------------------------------|
| Titles / Headings | Inter    | Black (900), ExtraBold (800), Bold (700), SemiBold (600) | Section titles, nav, hero heading, buttons |
| Body / Flow text  | Satoshi  | Regular (400), Medium (500), Bold (700) | Paragraphs, FAQ answers, rules, descriptions |
| Monospace accent  | System monospace or JetBrains Mono | Regular | Countdown timer, stats, timeline times |

Font loading: self-hosted from `/public/fonts/` via `@font-face` with `font-display: swap`.

Source files:
- `resources_for_agents/TIPOGRAFÍAS/INTER/*.TTF`
- `resources_for_agents/TIPOGRAFÍAS/SATOSHI/*.otf`

### Brand Assets

| Asset          | Source File                          | Usage                        |
|----------------|--------------------------------------|------------------------------|
| Favicon        | `Tinku - ISOTIPO-24.png`            | Browser tab icon (white knot on transparent) |
| Hero logo      | `Tinku - Logo oficial - H-16.png`   | Hero section (200px height), dark backgrounds |
| Nav logo       | `Tinku - Logo oficial - H-16.png`   | Sticky nav (34px height)     |
| Light variant  | `Tinku - Logo oficial - H-11.png`   | For any light surfaces       |

### Ritual Motif — Recurring Visual Elements

The interlocking knot from the isotipo inspires three recurring patterns:

1. **Diamond shapes** — The rotated square (diamond) from the logo appears as:
   - Section dividers (thin diamond + gradient lines between sections)
   - Section label markers (small diamond before label text)
   - Timeline markers (diamond nodes along the vertical line)
   - FAQ expand/collapse indicator (rotating diamond)
   - Stat strip separators

2. **Woven grid texture** — Faint diagonal crosshatch lines (45deg) in `#1E1B4B` on certain sections (About, Footer CTA), evoking Andean textile weaving

3. **Glowing accents** — Cards and interactive elements use `#C621E5` glow effects (`box-shadow`) to create a futuristic ceremonial energy

---

## Section Specifications

### 1. Navigation (sticky)

- Fixed top, `backdrop-filter: blur(20px)`, semi-transparent `--bg`
- Left: `Tinku - Logo oficial - H-16.png` as `<img>` (34px height)
- Right: Section anchor links (Satoshi Medium 14px) + "Aplicar" primary button
- Border bottom: 1px `--brand` at 8% opacity
- Mobile: hamburger menu → full-screen overlay

### 2. Hero (100vh)

**Background layers (bottom to top):**
- `#020617` solid background
- `<canvas>` particle constellation animation (90 particles, 12 forming diamond knot shape)
- Subtle grid overlay (60px grid, `--brand` at 3% opacity, radial mask fade)
- Faint horizontal scanlines
- 3 orbital rings (CSS, rotating at different speeds: 30s, 50s, 70s), 2 with glowing dot satellites

**Content (centered, z-index: 2):**
- Badge pill: green dot + "17-18 de abril · Cartago, Colombia · Universidad Cooperativa de Colombia" (glassmorphism)
- **Logo** `Tinku - Logo oficial - H-16.png` at **200px height** — the main visual element, with `drop-shadow` glow
- `<h3>` main motto: **"Ritual CreAItivo"** in Satoshi Black — the "AI" letters highlighted in `--brand` with text-shadow glow + underline bar
- Supporting text: "24 horas para construir, aprender y conectar con el mundo tech." (Satoshi Medium, `--text-secondary`)
- Countdown: 4 boxes (days/hours/min/sec) in `--surface` with `--brand` numbers, backdrop-blur, hover glow
- CTA row: "Aplicar al Hackathon" (solid `--brand`) + "Ver agenda ↓" (ghost outline)
- Stats strip: `24h | 12 equipos | 2 países | $1,000 USD` with diamond dividers

**Entrance animation:** Staggered `fadeIn + translateY` (0.1s → 0.9s delays)

**Particle interaction:** Mouse repels nearby particles (180px radius force field)

### 3. About

- Two-column grid (1.1fr / 0.9fr)
- Left: section label + "Bienvenid@ a Tinku" title + description + promise card (`--surface` bg, 4px left `--brand` border)
- Right: 3 concentric animated diamond shapes (pulsing glow)
- Woven crosshatch background texture

### 4. Tracks

- Section label + title + description
- 3-column grid (top row) + 2-column centered (bottom row)
- Cards: `--surface` bg, 18px border-radius, emoji icon + name (Inter Bold) + description (Satoshi)
- Hover: `--brand` top border reveal + glow shadow + translateY(-4px)

### 5. Schedule

- Vertical timeline with gradient line (`--surface` → `--brand` → `--surface`)
- Diamond-shaped markers at each event
- Each item: time (Inter monospace, `--brand`), event name (Inter Bold), description (Satoshi, `--text-muted`)

### 6. Prizes

- Centered main prize card: `--surface` bg, 2px `--brand` border, 24px radius, large glow shadow
- "$1,000" in gradient text (`--brand` → `#E879F9` → `#C084FC`)
- 3 secondary cards below: Cursor, MiniMax, Runway

### 7. Rules

- 2x2 card grid
- Each card: `--surface` bg, 3px `--brand` top border, emoji icon + title + description

### 8. Evaluation Criteria

- 4 items in a single connected strip (`--surface` bg)
- Large number in `--brand` (Inter Black 44px, 70% opacity) + name + description

### 9. FAQ

- Collapsible accordion (Svelte interactive component)
- `--surface` cards with 1px border
- Question: Inter SemiBold 15px, diamond icon rotates on open/close
- Answer: Satoshi 15px, `--text-secondary`, smooth `max-height` transition

### 10. Sponsors

- Tiered rows with uppercase labels (Satoshi Bold 11px, `--text-muted`)
- Tiers: Organizadores → Universidad → Tecnología → Comunidad
- Sponsor pills: `--surface` bg, Inter Bold, hover brightens text + border

### 11. Footer CTA

- Full-width section with woven crosshatch background texture
- Repeat: "Tu vIAje comienza aquí" (h2) + "Aplicar al Hackathon" button
- Radial glow behind content

### 12. Footer

- Brand logo diamond + "Tinku"
- "Hecho con amor en Cartago, Colombia"
- Date + venue: "17–18 de abril · Universidad Cooperativa de Colombia"
- Copyright

---

## Animations & Interactions

| Element            | Animation                          | Trigger                    |
|--------------------|-------------------------------------|---------------------------|
| Hero content       | Staggered fade up + scale          | Page load (CSS)           |
| Hero particles     | Floating constellation + mouse repel | Continuous (canvas JS)   |
| Hero orbital rings | Continuous rotation (30s/50s/70s)  | Continuous (CSS)          |
| Hero countdown     | Glow + lift on hover               | Hover (CSS)               |
| Sections           | Fade up + translateY(30px)         | Scroll into view (IntersectionObserver) |
| Track cards        | Glow border + lift                 | Hover (CSS)               |
| FAQ items          | max-height expand + diamond rotate | Click (Svelte)            |
| About diamonds     | Pulsing glow                       | Continuous (CSS)          |
| Buttons            | Glow intensify + translateY(-2px)  | Hover (CSS)               |

## Responsive Breakpoints

| Breakpoint     | Target                                              |
|----------------|------------------------------------------------------|
| `< 640px`      | Mobile — single column, stacked layout, hamburger nav |
| `640–1024px`   | Tablet — 2-column grids, simplified timeline          |
| `> 1024px`     | Desktop — full layout, 3-col grids, all effects       |

## Language

All user-facing content is in **Spanish**. All code, comments, and documentation in **English**.