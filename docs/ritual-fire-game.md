# Ritual Fire Builder — Mini-Game Design Document

## 1. Concept

**One-liner:** A hidden easter egg — clicking the "AI" letters in the hero tagline opens a fullscreen mini-game where players gather floating ritual offerings to ignite the tribe's sacred fire.

**Metaphor:** Each offering (ofrenda) represents a gift brought to the ritual — knowledge, creativity, collaboration, courage, vision, code, community. When all 7 offerings are gathered, the ritual fire ignites, symbolizing the hackathon's collective creative power. Rooted in Andean ceremonial tradition where participants bring physical offerings before a community ritual begins.

**Discovery:** The game is intentionally hidden. No hints, no tooltips, no section in the nav. Only curious users who click the glowing "AI" text in "Ritual CreAItivo" will find it. This rewards exploration — a hacker's instinct.

**Thematic fit:** The hero already renders "AI" as a highlighted `<span>` with brand magenta glow. Making it clickable is invisible to the layout but transforms it into a portal to the game.

---

## 2. Trigger: The "AI" Easter Egg

### Current Hero Tagline (Hero.astro)

The tagline "Ritual CreAItivo" already splits "AI" into its own styled `<span>`:

```astro
{t("hero.tagline").split("AI")[0]}
<span class="text-brand drop-shadow-[0_0_12px_var(--color-brand-glow)]">AI</span>
{t("hero.tagline").split("AI").slice(1).join("AI")}
```

### Modification

Turn the `<span>` into a clickable trigger:

- Add `role="button"`, `tabindex="0"`, `cursor-pointer` to the "AI" span.
- On click (or Enter/Space key), open the fullscreen game modal.
- **Subtle hint (optional):** On hover, the "AI" glow intensifies slightly (e.g., `drop-shadow` goes from 12px to 20px with a 0.3s transition). This is purely cosmetic — no tooltip, no label. Curious users will try clicking it.

### No Visual Breakage

The "AI" span stays inline in the heading. No layout shift. The only change is that it becomes interactive, with a very subtle hover glow enhancement.

---

## 3. Fullscreen Modal

### Behavior

- Opens as a **fullscreen overlay** (`position: fixed; inset: 0; z-index: 9999`) above all page content.
- Dark background matching `--color-bg` with a subtle fade-in transition (300ms opacity).
- Body scroll is locked while the modal is open (`overflow: hidden` on `<body>`).
- A close button (✕) sits in the top-right corner — always visible, always accessible.
- Pressing `Escape` also closes the modal.
- Focus is trapped inside the modal while open (focus trap for accessibility).

### Layout Inside the Modal

```
┌──────────────────────────────────────────────┐
│                                          [✕] │
│                                              │
│              [prompt text]                   │
│                                              │
│         ┌──────────────────────┐             │
│         │                      │             │
│         │    GAME CANVAS       │             │
│         │    (sparks float     │             │
│         │     fire pit center) │             │
│         │                      │             │
│         └──────────────────────┘             │
│                                              │
│            ● ● ● ○ ○ ○ ○  (3/7)             │
│                                              │
└──────────────────────────────────────────────┘
```

- Canvas fills most of the modal (full width, ~70–80% height).
- Prompt text sits above the canvas.
- Progress indicator sits below the canvas.
- On completion, the canvas shows the fire and the text/CTA replace the prompt and progress.

### Responsive

- On desktop: modal content is centered with max-width constraint for readability.
- On mobile: truly fullscreen, edge-to-edge canvas. Close button has generous padding (48px touch area).

---

## 4. Gameplay Flow

### States

```
IDLE → PLAYING → COMPLETED
```

### IDLE (modal just opened)

- The canvas renders with a dim, unlit fire pit at the center (concentric rings of faint ember glow).
- 7 offerings float across the canvas in organic, drifting paths, each with a soft glowing aura.
- Prompt text:
  - **ES:** "Recoge las ofrendas para iniciar el ritual"
  - **EN:** "Gather the offerings to start the ritual"
- A subtle pulsing glow on each offering signals it's interactive.
- State transitions to PLAYING automatically once offerings are positioned.

### PLAYING (gathering offerings)

- The user clicks (desktop) or taps (mobile) floating offerings to gather them.
- On gather:
  - The offering bursts with a radial flash (magenta/amber glow expanding outward, fading over ~300ms).
  - The offering disappears from the canvas.
  - A progress indicator updates (7 dots: filled = gathered, empty = remaining; plus "3/7" counter).
  - The fire pit grows brighter with each gathered offering (opacity ramps from ~0.05 to ~0.3).
- Remaining offerings continue floating. They bounce off canvas edges with velocity reflection — never leave the playable area.
- Hit area: ~48px radius on mobile (exceeds WCAG 44px minimum), ~32px on desktop.

### COMPLETED (fire ignited)

- Once 7/7 offerings are gathered:
  - A brief pause (~500ms) builds anticipation.
  - The fire ignites: animated flame rises from the pit center (canvas-based particle flame, magenta/amber palette).
  - The background pulses with a warm brand glow.
  - Prompt text and progress fade out. Replaced by:
    - **ES:** "🔥 Ritual Activado" + "Bienvenido a TINKU"
    - **EN:** "🔥 Ritual Activated" + "Welcome to TINKU"
  - A CTA button fades in: "Apply Now" / "Registra tu equipo" (opens Tally popup).
  - A small "Replay" button (↻) appears to restart the game.
- The fire continues animating in the background while the user reads the completion text.

---

## 5. Visual Design

### Color Palette (existing design tokens)

| Element             | Color                                  | Token                        |
| ------------------- | -------------------------------------- | ---------------------------- |
| Modal background    | `#020617`                              | `--color-bg`                 |
| Offering core       | `#c621e5`                              | `--color-brand`              |
| Offering glow       | `rgb(198 33 229 / 0.45)`              | `--color-brand-glow-strong`  |
| Offering soft aura  | `rgb(198 33 229 / 0.25)`              | `--color-brand-glow`         |
| Fire warm tones     | `#ff8c28`, `#ffaf46`                   | Same as existing ember colors |
| Fire hot core       | `#fff0d0` (white-amber)               | New — center of flame        |
| Progress dots       | `--color-text-muted` → `--color-brand` | Unfilled → filled           |
| Prompt text         | `#a1a1c4`                              | `--color-text-secondary`     |
| Completion text     | `#f5f5f5`                              | `--color-text-primary`       |
| Close button        | `#a1a1c4` → `#f5f5f5` on hover        | `--color-text-secondary/primary` |

### Offering Visual Design — Ideas

The 7 offerings should feel like sacred, glowing objects drifting through a cosmic ritual space. Here are design directions to explore:

#### Option A: Iconic Offerings (each offering is a different symbol)

Each of the 7 offerings is a distinct shape representing an Andean ritual gift, drawn as a simple glowing outline/icon on the canvas:

| # | Symbol | Meaning | Visual |
|---|--------|---------|--------|
| 1 | 🍃 Coca leaf | Wisdom, connection to earth | Small leaf silhouette, green-magenta glow |
| 2 | 🌸 Flower | Beauty, creativity | 5-petal flower, magenta glow |
| 3 | 🔥 Small flame | Passion, energy | Flickering teardrop, amber-magenta |
| 4 | 💎 Crystal/Stone | Strength, foundation | Diamond shape, white-magenta glow |
| 5 | ⭐ Star | Vision, aspiration | 4-point star, bright white-magenta |
| 6 | 🌀 Spiral | Community, cycles | Fibonacci spiral, magenta pulse |
| 7 | ✦ Chakana fragment | Andean identity | Small stepped cross, deep magenta |

Each is drawn as a ~20px canvas shape (not emoji) with a radial glow aura around it. When gathered, it bursts into particles matching its color.

#### Option B: Uniform Glowing Orbs with Inner Symbols

All offerings share the same outer form — a glowing magenta orb (~24px) with a soft pulsing aura — but each contains a faint inner symbol (tiny leaf, star, spiral, etc.) visible at close range. Simpler to implement, still varied on close inspection.

#### Option C: Abstract Sacred Geometry

Instead of recognizable icons, each offering is a different sacred geometry form: triangle, circle, square, diamond, hexagon, cross, spiral. Drawn as thin glowing outlines rotating slowly. Very minimal and elegant.

#### Recommended: Option A

Option A gives the richest visual experience. Each offering feels unique and meaningful. The player intuitively understands they're gathering diverse gifts — not just identical dots. It's also the most Andean-authentic approach.

### Fire Pit (idle/playing state)

- Concentric rings of faint magenta/amber glow at the canvas center.
- Stone circle suggested by faint arc segments (like arranged ritual stones).
- Very subtle — not a prominent element until the fire ignites.
- Grows brighter with each gathered offering (opacity ramps from ~0.05 to ~0.3 over 7 offerings).
- Optional: as each offering is gathered, a faint afterimage of its symbol appears around the fire pit ring, showing the offerings "placed" at the altar.

### Fire Animation (completed state)

- Canvas-based particle system: 30–50 upward-drifting particles.
- Color gradient from white-amber (core) → orange → magenta (tips).
- Particles spawn from a narrow base, drift upward with slight horizontal sway.
- Fade out as they rise (opacity tied to lifetime).
- Glowing base circle beneath the flame.
- Optional enhancement: the 7 offering symbols orbit slowly around the base of the fire, now glowing brightly — the gifts have been accepted.

### Background Atmosphere

The modal background isn't plain black. To create a ritual environment:

- **Faint star field:** 40–60 tiny twinkling dots across the background (reuse existing star logic from ParticleCanvas).
- **Central vignette:** Radial gradient from slightly lighter center to darker edges, drawing the eye to the fire pit.
- **Faint concentric circles:** Very low opacity (~0.02) rings radiating from the center outward, suggesting an energy field or sacred space.

### Typography

- Prompt text: `font-satoshi`, weight 500, `text-lg sm:text-xl`.
- Progress counter: `font-mono`, `text-sm`.
- Completion heading: `font-inter`, weight 900, `text-3xl sm:text-5xl`.
- Completion subheading: `font-satoshi`, weight 500, `text-lg sm:text-xl`.
- Close button: `font-mono`, `text-xl`.

---

## 6. Technical Architecture

### Components

Two components are needed:

| Component | Type | Location | Purpose |
| --- | --- | --- | --- |
| `RitualFireGame.svelte` | Svelte 5 | `src/components/ui/RitualFireGame.svelte` | The fullscreen modal + canvas game |
| Modified `Hero.astro` | Astro | `src/components/home/Hero.astro` | Add clickable "AI" trigger |

### RitualFireGame.svelte

**Loading:** `client:load` (must be ready when user clicks "AI" in the hero, which is above the fold).

**Props:**

```typescript
interface Props {
  promptText: string;        // "Collect the sparks..."
  completedTitle: string;    // "🔥 Ritual Activated"
  completedSubtitle: string; // "Welcome to TINKU"
  ctaText: string;           // "Register my team"
  replayLabel: string;       // "Replay"
  closeLabel: string;        // "Close"
  progressLabel: string;     // "{count} of {total}"
}
```

**Internal State (Svelte 5 runes):**

```typescript
let isOpen: boolean = $state(false);
let gameState: "idle" | "playing" | "completed" = $state("idle");
let sparksCollected: number = $state(0);
let canvas: HTMLCanvasElement | undefined = $state();
```

**Exported methods:**

```typescript
export function open() {
  isOpen = true;
  gameState = "idle";
  sparksCollected = 0;
  // Lock body scroll
  document.body.style.overflow = "hidden";
  // Start game loop after brief delay for fade-in
  requestAnimationFrame(initAndAnimate);
}

export function close() {
  isOpen = false;
  document.body.style.overflow = "";
  cancelAnimationFrame(animationId);
}
```

### Communication: Hero → Game Modal

The Hero needs to tell the game modal to open. Two approaches:

**Option A — Custom Event (recommended):**

The "AI" span dispatches a custom event on click. The game component listens for it.

```typescript
// In Hero.astro (inline script)
document.querySelector("[data-ritual-trigger]")?.addEventListener("click", () => {
  document.dispatchEvent(new CustomEvent("open-ritual-game"));
});

// In RitualFireGame.svelte
$effect(() => {
  const handler = () => open();
  document.addEventListener("open-ritual-game", handler);
  return () => document.removeEventListener("open-ritual-game", handler);
});
```

**Option B — Svelte bind:this + method call:**

Hero imports the game component and calls `.open()` directly. More coupled but simpler.

Recommendation: **Option A** — keeps the trigger in static Astro HTML and the game in its Svelte island, with no coupling between them.

### Canvas Rendering

- Same `requestAnimationFrame` loop pattern as existing `ParticleCanvas.svelte`.
- Spark positions updated each frame with organic floating motion (sine-based drift + velocity).
- Hit detection: on `pointerdown`, check distance from event coordinates to each spark center. If within hit radius, collect it.
- Use `pointerdown` (not `click`) for snappier mobile response.

### Spark Movement

```
x += vx + sin(time * freqX + phaseX) * amplitudeX
y += vy + cos(time * freqY + phaseY) * amplitudeY
```

Each spark gets randomized `freq`, `phase`, and `amplitude` values for organic, non-uniform motion. Sparks bounce off canvas edges with velocity reflection.

### Modal Focus Trap

When the modal opens:
1. Save the previously focused element.
2. Move focus to the close button.
3. Trap Tab/Shift+Tab within the modal (close button, skip button, CTA button when visible).
4. On close, restore focus to the "AI" span.

---

## 7. Accessibility

### Reduced Motion

When `prefers-reduced-motion: reduce` is active:

- The modal still opens (it's user-initiated, not an animation).
- Skip the spark-collecting game entirely.
- Show the completed state immediately (static fire glow + completion text + CTA).
- No canvas animation runs.

### Keyboard

- "AI" span: `role="button"`, `tabindex="0"`. Activates on Enter or Space.
- Close button: focusable, activates on Enter/Space/Escape.
- "Skip game" link: always visible at bottom of modal for users who don't want to play. Jumps to completed state.
- Focus trap prevents tabbing out of the modal while open.

### Screen Readers

- "AI" span gets `aria-label="AI – Open secret game"` (localized).
- Modal uses `role="dialog"`, `aria-modal="true"`, `aria-label` with the game title.
- Canvas has `aria-hidden="true"`.
- Prompt text, progress, and completion text are live DOM elements outside the canvas.
- Progress uses `aria-live="polite"` so screen readers announce spark count changes.
- Completion text uses `role="status"`.

### Color Contrast

- All text meets WCAG AA contrast against `--color-bg`.
- Spark glow is decorative — game state is communicated via text, not color alone.

---

## 8. Mobile Considerations

| Concern             | Solution                                                                |
| ------------------- | ----------------------------------------------------------------------- |
| Touch targets       | Hit radius 48px (exceeds WCAG 44px minimum)                            |
| Spark count         | Keep 7 on all viewports (fullscreen modal gives plenty of space)        |
| Performance         | Cap at 30fps on mobile via frame-skip logic                             |
| Canvas resolution   | Use `devicePixelRatio` capping at 2x to avoid GPU strain               |
| Scroll lock         | `document.body.style.overflow = "hidden"` while modal is open           |
| Close gesture       | Close button (top-right, 48px touch area) + swipe-down optional in v2   |
| "AI" trigger on mobile | Touch target is the full "AI" text span — small but discoverable     |

---

## 9. Sound (Optional — v2)

Deferred to a future iteration:

- **Spark collect:** Short crystalline chime (~100ms), pitch increasing with each spark.
- **Fire ignite:** Low warm rumble with a bright crescendo (~800ms).
- **Trigger:** Only on user-initiated actions (satisfies autoplay policies).

Not a launch requirement.

---

## 10. Translation Keys

New keys for both `es.ts` and `en.ts`:

```typescript
// Spanish (es.ts)
"ritual.trigger.aria": "AI – Abrir juego secreto",
"ritual.prompt": "Recoge las chispas para iniciar el ritual",
"ritual.progress": "{count} de {total}",
"ritual.completed.title": "🔥 Ritual Activado",
"ritual.completed.subtitle": "Bienvenido a TINKU",
"ritual.cta": "👉 Registra tu equipo",
"ritual.replay": "Repetir",
"ritual.skip": "Saltar juego",
"ritual.close": "Cerrar",

// English (en.ts)
"ritual.trigger.aria": "AI – Open secret game",
"ritual.prompt": "Collect the sparks to start the ritual",
"ritual.progress": "{count} of {total}",
"ritual.completed.title": "🔥 Ritual Activated",
"ritual.completed.subtitle": "Welcome to TINKU",
"ritual.cta": "👉 Register my team",
"ritual.replay": "Replay",
"ritual.skip": "Skip game",
"ritual.close": "Close",
```

---

## 11. Integration in Hero.astro

The Hero component needs minimal changes:

```astro
<!-- Before (current) -->
<span class="text-brand drop-shadow-[0_0_12px_var(--color-brand-glow)]">AI</span>

<!-- After -->
<span
  class="text-brand drop-shadow-[0_0_12px_var(--color-brand-glow)]
         hover:drop-shadow-[0_0_20px_var(--color-brand-glow-strong)]
         transition-all duration-300 cursor-pointer select-none"
  role="button"
  tabindex="0"
  aria-label={t("ritual.trigger.aria")}
  data-ritual-trigger
>AI</span>
```

The game component is added to the layout (not the Hero section) so it renders as a top-level overlay:

```astro
<!-- In Hero.astro or MainLayout.astro -->
<RitualFireGame
  client:load
  promptText={t("ritual.prompt")}
  completedTitle={t("ritual.completed.title")}
  completedSubtitle={t("ritual.completed.subtitle")}
  ctaText={t("ritual.cta")}
  replayLabel={t("ritual.replay")}
  closeLabel={t("ritual.close")}
  progressLabel={t("ritual.progress")}
/>

<script>
  const trigger = document.querySelector("[data-ritual-trigger]");
  trigger?.addEventListener("click", () => {
    document.dispatchEvent(new CustomEvent("open-ritual-game"));
  });
  trigger?.addEventListener("keydown", (e) => {
    if (e instanceof KeyboardEvent && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      document.dispatchEvent(new CustomEvent("open-ritual-game"));
    }
  });
</script>
```

---

## 12. Integration Checklist

- [ ] Add translation keys to `es.ts` and `en.ts` (9 new keys each)
- [ ] Create `RitualFireGame.svelte` (fullscreen modal + canvas game logic)
- [ ] Modify `Hero.astro` — make "AI" span clickable with `data-ritual-trigger`
- [ ] Add `RitualFireGame` to `MainLayout.astro` (or `Hero.astro`) with `client:load`
- [ ] Add custom event listener script for trigger → modal communication
- [ ] Implement `prefers-reduced-motion` handling (skip to completed state)
- [ ] Implement focus trap and Escape-to-close
- [ ] Implement "Skip game" button for accessibility
- [ ] Test on mobile (touch targets, fullscreen modal, performance)
- [ ] Test with keyboard only (Tab, Enter, Escape flow)
- [ ] Test with screen reader (VoiceOver / NVDA)
- [ ] Run `pnpm test` to verify translation parity
- [ ] Run `pnpm check` to verify Biome compliance

---

## 13. Open Questions

1. **Subtle hover hint:** Should the "AI" glow enhancement on hover be included, or should it be completely invisible until clicked? (Pure discovery vs. slight affordance.)
2. **Reward:** Should the completed state include anything beyond the fire + CTA? (Motivational quote, confetti burst, shareable badge?)
3. **Persistence:** Should completion state persist in `sessionStorage` so re-opening the modal shows the fire directly? Or always replay from scratch?
4. **Sound:** Include audio in v1 or defer to v2?
5. **Analytics:** Track modal-open and completion events to measure discovery rate?
