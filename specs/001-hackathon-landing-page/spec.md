# Feature Specification: Tinku Hackathon Landing Page

**Feature Branch**: `001-hackathon-landing-page`  
**Created**: 2026-03-10  
**Status**: Draft  
**Input**: User description: "Build the single-page landing for Tinku — Ritual CreAItivo, the first hackathon in Cartago, Valle del Cauca. The page must communicate event details, generate excitement, and drive hackathon applications through a visually striking 'Ritual Digital' themed experience."

## Clarifications

### Session 2026-03-10

- Q: How should visitors switch between English and Spanish? → A: Auto-detect from browser preferred language + visible language toggle in the navigation bar for manual override.
- Q: What is the default/fallback language when the browser language is neither Spanish nor English? → A: Spanish (primary local audience).
- Requirement added: Page MUST have good SEO (semantic HTML, meta tags, Open Graph, structured data).
- Requirement added: Page MUST use `resources_for_agents/Tinku - ISOTIPO-24.png` as the favicon.
- Q: Should brand identity terms be translated to English or kept in Spanish? → A: Keep brand terms in Spanish (event name "Tinku", tagline "Ritual CreAItivo", motto "Tu vIAje comienza aquí"); translate all functional/informational content (track names, rules, FAQ, descriptions).
- Requirement added: Page MUST be optimized for LLM discoverability following the llms.txt standard and Generative Engine Optimization (GEO) best practices.
- Requirement added: Site MUST include a blog section where event-related content is published for participants to find detailed information about topics.
- Q: Should the landing page include a blog preview section or only link to the blog via navigation? → A: Blog accessible only via navigation bar link (no preview section on the landing page).
- Q: What level of search does the blog need? → A: Both full-text search (keyword input filtering across post titles and body) and tag-based filtering.
- Requirement refined: Countdown timer has two modes — (1) before event: counts down to event start, (2) during event: switches to show remaining hours/minutes/seconds until the hackathon ends.
- Requirement refined: All "Aplicar al Hackathon" CTA buttons MUST open a Tally popup (form ID: `kdA05d`) instead of navigating to an external URL. Integration via Tally embed script + data attributes. See `docs/tally_popup.md` for implementation details.

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Discover the Event and Apply (Priority: P1)

A potential participant lands on the page and immediately understands what Tinku is: a 24-hour hackathon in Cartago, Colombia on April 17–18. They see a countdown timer, key stats (24h, 12 teams, 2 countries, $1,000 USD), and a prominent call-to-action to apply. They click "Aplicar al Hackathon" and a Tally popup opens with the application form.

**Why this priority**: The primary conversion goal of the entire landing page. Without a clear value proposition and easy application path, the event gets no participants.

**Independent Test**: Can be fully tested by loading the page and verifying the hero section displays event info, countdown, stats, and CTA button that opens the Tally application popup.

**Acceptance Scenarios**:

1. **Given** a visitor loads the page before the event, **When** the hero section renders, **Then** they see the Tinku logo, "Ritual CreAItivo" tagline, event date/location badge, a live countdown to April 17 (days/hours/min/sec), key stats, and two CTA buttons ("Aplicar al Hackathon" and "Ver agenda"). During the event, the countdown switches to show time remaining until the hackathon ends.
2. **Given** a visitor sees the hero section, **When** they click "Aplicar al Hackathon", **Then** a Tally popup opens displaying the application form (form ID: `kdA05d`) with a wave emoji animation.
3. **Given** a visitor sees the hero section, **When** they click "Ver agenda", **Then** the page scrolls smoothly to the Schedule section.

---

### User Story 2 — Explore Event Details via Navigation (Priority: P2)

A visitor wants to learn more before applying. They use the sticky navigation bar to jump between sections: About, Tracks, Schedule, Prizes, Rules, Evaluation Criteria, FAQ, and Sponsors. Each section provides the specific information they need to make a decision.

**Why this priority**: Informed visitors convert at higher rates. Navigation enables self-directed exploration of all event facets — tracks they can compete in, what they can win, what rules apply, and who is behind the event.

**Independent Test**: Can be fully tested by clicking each navigation link and verifying smooth scroll to the correct section with accurate content displayed.

**Acceptance Scenarios**:

1. **Given** a visitor is anywhere on the page, **When** they scroll down, **Then** a sticky navigation bar remains visible at the top with the Tinku logo and section links.
2. **Given** a visitor clicks a navigation link (e.g., "Tracks"), **When** the page scrolls, **Then** it smoothly navigates to the corresponding section.
3. **Given** a visitor is on a mobile device, **When** they tap the hamburger menu icon, **Then** a full-screen navigation overlay appears with all section links.

---

### User Story 3 — Understand the Hackathon Tracks and Prizes (Priority: P2)

A potential participant wants to know what challenge areas are available and what rewards are at stake. They browse the Tracks section to see the 5 challenge areas (Sustentabilidad, Inteligencia Artificial, Educación, Cloud AI, Human & Agents) and the Prizes section to see the $1,000 USD main prize plus tech credits from Cursor, MiniMax, and Runway.

**Why this priority**: Tracks and prizes are key motivators for hackathon participation. Understanding the challenge areas helps participants assess fit, and prizes drive competitive interest.

**Independent Test**: Can be fully tested by scrolling to the Tracks and Prizes sections and verifying all 5 tracks and all prize tiers are displayed with correct information.

**Acceptance Scenarios**:

1. **Given** a visitor views the Tracks section, **When** it renders, **Then** all 5 tracks are displayed as cards with emoji icons, track names, and descriptions.
2. **Given** a visitor views the Prizes section, **When** it renders, **Then** the main prize ($1,000 USD) is prominently displayed along with 3 secondary prizes (Cursor, MiniMax, Runway credits).

---

### User Story 4 — Review Rules and Evaluation Criteria (Priority: P3)

A serious applicant wants to understand the competition rules and how projects will be judged. They navigate to the Rules section to learn about pitch duration (5 min max), pitch deck (optional, 10 slides max), GitHub repository requirements, and mandatory public deployment. They then check the Evaluation Criteria: Originality, Technical Excellence, Viability, and Pitch.

**Why this priority**: Clarity on rules prevents disqualification and helps teams prepare. Understanding evaluation criteria helps teams prioritize effort during the 24-hour sprint.

**Independent Test**: Can be fully tested by scrolling to Rules and Evaluation Criteria sections and verifying all delivery requirements and the 4 judging dimensions are visible.

**Acceptance Scenarios**:

1. **Given** a visitor views the Rules section, **When** it renders, **Then** 4 rule cards are displayed covering: Pitch (5 min max), Pitch Deck (optional, 10 slides), GitHub repository (README, license, setup instructions), and Product (public URL required).
2. **Given** a visitor views the Evaluation Criteria section, **When** it renders, **Then** 4 criteria are shown: Originalidad, Técnica, Viabilidad, Pitch — each with a number, name, and description.

---

### User Story 5 — Get Answers from FAQ (Priority: P3)

A visitor has questions about the event — who can attend, cost, team sizes, what to bring, intellectual property. They scroll to the FAQ section and interact with the collapsible accordion to find answers.

**Why this priority**: FAQs reduce friction for undecided visitors and minimize organizer support burden. Common questions about cost (free for visitors), team size (1–3 people), and IP ownership (100% team-owned, MIT license) are key decision factors.

**Independent Test**: Can be fully tested by clicking each FAQ item and verifying it expands to show the correct answer, and collapses when clicked again.

**Acceptance Scenarios**:

1. **Given** a visitor views the FAQ section, **When** it renders, **Then** all FAQ questions are visible in a collapsed state.
2. **Given** a visitor clicks a FAQ question, **When** the accordion expands, **Then** the answer is revealed with a smooth animation and the diamond indicator rotates.
3. **Given** a visitor clicks an already-open FAQ question, **When** the accordion collapses, **Then** the answer is hidden with a smooth animation.

---

### User Story 6 — Experience the Visual Identity and Animations (Priority: P4)

A visitor experiences the "Ritual Digital" aesthetic — particle constellation animation in the hero, orbital rings, pulsing diamonds, woven textures, and scroll-triggered section reveals. The visual experience reinforces the Andean-meets-futuristic brand identity and creates a memorable impression.

**Why this priority**: The visual experience differentiates Tinku from generic event pages and reinforces the cultural narrative. However, core content delivery matters more than visual polish.

**Independent Test**: Can be fully tested by loading the page and observing particle animation, mouse interaction (particle repulsion), orbital ring rotation, scroll-triggered fade-in of sections, and hover states on interactive elements.

**Acceptance Scenarios**:

1. **Given** a visitor loads the page, **When** the hero section renders, **Then** a particle constellation animation plays with floating particles, some forming a diamond knot shape.
2. **Given** a visitor moves their mouse over the hero, **When** the cursor approaches particles, **Then** nearby particles are repelled within a ~180px radius.
3. **Given** a visitor scrolls down the page, **When** a new section enters the viewport, **Then** it fades in with a subtle upward translation animation.
4. **Given** a visitor hovers over a track card, **When** the hover state activates, **Then** the card lifts slightly and a brand-colored glow border appears.

---

### User Story 7 — Browse on Mobile Device (Priority: P2)

A visitor accesses the landing page from a smartphone. The layout adapts to a single-column view, the navigation becomes a hamburger menu, grids stack vertically, and all content remains readable and interactive. The countdown timer, FAQ accordion, and CTAs are fully functional on touch devices.

**Why this priority**: A significant portion of the target audience (Colombian tech community) will discover the event via social media on mobile. A broken mobile experience directly hurts conversion.

**Independent Test**: Can be fully tested by loading the page on a mobile viewport (< 640px) and verifying all sections render in single-column layout, navigation works via hamburger menu, and all interactive elements respond to touch.

**Acceptance Scenarios**:

1. **Given** a visitor loads the page on a screen narrower than 640px, **When** the page renders, **Then** all content displays in a single-column layout with no horizontal overflow.
2. **Given** a visitor is on mobile, **When** they tap the hamburger icon, **Then** a full-screen navigation overlay opens with all section links.
3. **Given** a visitor is on a tablet (640–1024px), **When** the page renders, **Then** grids adapt to 2-column layouts and the timeline is simplified.

---

### User Story 8 — Browse Blog for Event Information (Priority: P3)

A participant or potential applicant wants deeper information about event topics — track details, tool guides, logistics, or community updates. They click "Blog" in the navigation bar, arrive at the blog listing page, and browse posts using tags or keyword search to find the specific information they need. They click a post card to read the full article.

**Why this priority**: The blog extends the landing page's informational scope, giving participants a place to find detailed content that doesn't fit in the landing page sections. It supports informed decision-making and engagement.

**Independent Test**: Can be fully tested by navigating to the blog, verifying posts display as cards with title/date/excerpt/tags, using tag filtering and keyword search, and clicking through to read a full post.

**Acceptance Scenarios**:

1. **Given** a visitor clicks "Blog" in the navigation bar, **When** the blog listing page loads, **Then** they see a grid of post cards (title, date, excerpt, tags), a search input, and clickable tag filters.
2. **Given** a visitor is on the blog listing page, **When** they click a tag, **Then** the post grid filters to show only posts with that tag.
3. **Given** a visitor is on the blog listing page, **When** they type a keyword in the search input, **Then** the post grid filters in real-time to show only posts matching the keyword in title or body.
4. **Given** a visitor clicks a post card, **When** the post page loads, **Then** they see the full article content with title, date, tags, and body text.

---

### Edge Cases

- What happens when the pre-event countdown reaches zero? The timer automatically switches to during-event mode, showing remaining time until the hackathon ends (24h countdown). When the during-event countdown also reaches zero, the timer displays a completed/finished state (e.g., "Event concluded").
- What happens when JavaScript is disabled? Core content (text, images, links) must remain accessible. The countdown shows a static fallback date. The FAQ remains expanded or shows all answers. Navigation links still work as anchor links.
- What happens on very large screens (> 1920px)? Content is constrained to a maximum width to prevent overly wide layouts, keeping readability optimal.
- What happens when a user rapidly clicks multiple FAQ items? Each item toggles independently without visual glitches or animation conflicts.
- What happens with slow network connections? The page should render meaningful content before web fonts and images finish loading, using font-display: swap and appropriate image loading strategies.
- What happens when a visitor's browser language is unsupported (not Spanish or English)? The page defaults to Spanish. The language toggle remains available for manual switch to English.
- What happens when a blog search returns no results? The blog displays a friendly "no results found" message with a suggestion to clear filters or try different keywords.
- What happens when the blog has no posts yet? The blog listing page displays a message indicating content is coming soon, with a link back to the landing page.
- What happens when the Tally embed script fails to load (network error, ad blocker)? The CTA buttons must still be clickable and gracefully degrade — falling back to opening the Tally form in a new tab via direct URL (`https://tally.so/r/kdA05d`).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Page MUST display a sticky navigation bar with the Tinku logo, section anchor links, and an "Aplicar" CTA button that remains visible during scroll.
- **FR-002**: Page MUST display a hero section with: event date/location badge, Tinku logo (200px height), "Ritual CreAItivo" tagline with highlighted "AI" letters, supporting description, live countdown to April 17 2026, two CTA buttons, and a stats strip.
- **FR-003**: Page MUST include an About section explaining what Tinku is, its mission, and its promise to participants (food, coffee, space).
- **FR-004**: Page MUST display all 5 hackathon tracks (Sustentabilidad, Inteligencia Artificial, Educación, Cloud AI, Human & Agents) as interactive cards with emoji icons, names, and descriptions.
- **FR-005**: Page MUST present a vertical timeline schedule showing the full 24-hour event agenda with time, event name, and description for each entry.
- **FR-006**: Page MUST showcase the prize structure: $1,000 USD main prize prominently displayed, plus 3 secondary prize cards for Cursor, MiniMax, and Runway tech credits.
- **FR-007**: Page MUST display delivery rules as cards covering: Pitch (5 min max), Pitch Deck (optional, 10 slides max), GitHub repo (README, license, setup), and Product (public URL).
- **FR-008**: Page MUST present 4 evaluation criteria (Originalidad, Técnica, Viabilidad, Pitch) with numbered items, names, and descriptions.
- **FR-009**: Page MUST include a collapsible FAQ accordion with smooth expand/collapse animations, covering at minimum: what is a hackathon, who can attend/cost, required knowledge, team formation, what to bring, what to build, pre-existing code policy, and intellectual property.
- **FR-010**: Page MUST display sponsors organized in tiers: Organizadores (The Tribu), Universidad (UCC), Tecnología (Cursor, MiniMax, Runway), Comunidad (Persano, La 7 Incluyente, Techos Renovables).
- **FR-011**: Page MUST include a footer CTA section repeating the "Aplicar al Hackathon" call-to-action, and a footer with brand logo, location info, dates, and copyright.
- **FR-012**: Navigation MUST transform into a hamburger menu on mobile viewports (< 640px) that opens a full-screen overlay.
- **FR-013**: Page MUST be responsive across 3 breakpoints: mobile (< 640px, single column), tablet (640–1024px, 2-column grids), and desktop (> 1024px, full layout with 3-column grids).
- **FR-014**: Hero section MUST include a particle constellation animation with mouse-repulsion interaction (approximately 90 floating particles, 12 forming a diamond knot shape).
- **FR-015**: Page sections MUST animate into view on scroll using fade-up transitions triggered by viewport intersection.
- **FR-016**: All user-facing content MUST be available in both Spanish and English. The page MUST auto-detect the visitor's browser preferred language and display the matching locale. If the browser language is neither Spanish nor English, the page MUST default to Spanish.
- **FR-019**: The navigation bar MUST include a visible language toggle allowing visitors to manually switch between Spanish and English, overriding the auto-detected language.
- **FR-017**: The hero countdown timer MUST operate in two modes, updating every second: (1) **Pre-event mode** — displays days, hours, minutes, and seconds remaining until the event start (April 17, 2026); (2) **During-event mode** — once the event has started, the timer switches to show the remaining hours, minutes, and seconds until the hackathon ends (24 hours after start). After the event ends, the timer displays a completed/finished state.
- **FR-018**: All "Aplicar al Hackathon" CTA buttons MUST open a Tally popup (form ID: `kdA05d`) displaying the application form in-page. The Tally embed script (`https://tally.so/widgets/embed.js`) MUST be loaded asynchronously in the `<head>`. CTA elements use `data-tally-open="kdA05d"`, `data-tally-hide-title="1"`, `data-tally-emoji-text="👋"`, and `data-tally-emoji-animation="wave"` attributes.
- **FR-020**: Page MUST use the Tinku isotipo (`resources_for_agents/Tinku - ISOTIPO-24.png`) as the browser favicon, provided in appropriate sizes for different devices and platforms.
- **FR-021**: Page MUST include SEO best practices: semantic HTML structure (proper heading hierarchy, landmark elements), descriptive page title and meta description (localized per active language), Open Graph and Twitter Card meta tags for social sharing, and structured data (Event schema) for search engine rich results.
- **FR-022**: Page MUST set the `lang` attribute on the HTML element to match the active language (`es` or `en`) for accessibility and SEO.
- **FR-023**: When displaying in English, brand identity terms MUST remain in Spanish: the event name "Tinku", the tagline "Ritual CreAItivo", the motto "Tu vIAje comienza aquí", and sponsor/organizer proper names. All other content (track names, descriptions, rules, FAQ, evaluation criteria, UI labels, meta descriptions) MUST be translated to English.
- **FR-024**: Site MUST serve a `/llms.txt` file at the root domain — a Markdown file following the llms.txt standard (proposed by Answer.AI) that provides a curated summary of the event with annotated links to key content sections. It MUST include: an H1 with the site name, a blockquote description of the event, and H2 sections with annotated links covering event overview, tracks, prizes, rules, schedule, FAQ, and application link.
- **FR-025**: Site MUST serve a `/llms-full.txt` file at the root domain — a comprehensive Markdown document containing the full text content of all page sections in a clean, token-efficient format (no HTML, no CSS, no JavaScript). This allows LLMs to ingest the complete event information in a single request.
- **FR-026**: Site MUST include a `robots.txt` file that explicitly allows AI crawlers (GPTBot, ChatGPT-User, ClaudeBot, Anthropic, Google-Extended, PerplexityBot, Bytespider) alongside traditional search engine crawlers, and references both `sitemap.xml` and `llms.txt`.
- **FR-027**: Page content MUST follow Generative Engine Optimization (GEO) best practices: answer-first structure (key information in the first 40–60 words after each section heading), one core idea per heading, declarative factual statements over marketing fluff, and FAQ content structured as direct question-answer pairs to maximize LLM extraction and citation likelihood.
- **FR-028**: Site MUST include a blog section at a `/blog` route (or equivalent) where event-related articles are published. Blog posts provide detailed information about the hackathon — tracks, tools, event logistics, community updates, and topic deep-dives — for participants seeking more context.
- **FR-029**: The blog MUST support bilingual content (Spanish and English), following the same language detection and toggle behavior as the landing page (FR-016, FR-019). Blog posts are authored per language.
- **FR-030**: The blog listing page MUST display posts as cards in a grid, with each card showing the post title, publication date, a brief excerpt, and tags.
- **FR-031**: The blog MUST support tag-based filtering so visitors can browse posts by topic (e.g., tracks, tools, logistics, community).
- **FR-033**: The blog listing page MUST include a full-text search input that filters posts in real-time by matching keywords against post titles and body content. Search and tag filtering MUST work together (combined filters).
- **FR-032**: The navigation bar (FR-001) MUST include a "Blog" link that navigates to the blog listing page. No blog preview section is added to the landing page itself.

### Key Entities

- **Section**: A distinct content block on the landing page (hero, about, tracks, schedule, prizes, rules, evaluation, FAQ, sponsors, footer CTA, footer). Each has a unique anchor ID for navigation.
- **Track**: A hackathon challenge area with a name, emoji icon, and description. There are 5 tracks.
- **Schedule Entry**: A timeline item with a time, event name, and description representing a moment in the 24-hour agenda.
- **Prize**: A reward tier with a name, value/description, and visual prominence level (main vs. secondary).
- **Rule**: A delivery requirement with an icon, title, and description.
- **Evaluation Criterion**: A judging dimension with a number (1–4), name, and description.
- **FAQ Item**: A question-answer pair with collapsible interactive state (open/closed).
- **Sponsor**: An organization with a name, tier (Organizadores/Universidad/Tecnología/Comunidad), and optional logo/link.
- **Blog Post**: An article with a title, publication date, author (optional), excerpt, body content, language (es/en), and one or more tags. Posts are authored as Markdown/MDX files per language.
- **Tag**: A content category label used to classify blog posts by topic. Each tag has a name and optional description.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Visitors can identify the event name, date, location, and purpose within 5 seconds of page load.
- **SC-002**: Visitors can navigate from any point on the page to the application CTA in no more than 2 interactions (scroll + click or nav link + click).
- **SC-003**: The page loads all visible above-the-fold content (hero section) within 3 seconds on a standard mobile connection.
- **SC-004**: 100% of the page content is accessible and readable on viewports from 320px to 2560px wide without horizontal scrolling.
- **SC-005**: All interactive elements (FAQ accordion, navigation, CTAs, hover states) respond to user input within 100ms.
- **SC-006**: The page meets accessibility standards (WCAG 2.1 AA) with a score of 90 or above on standard accessibility audits.
- **SC-007**: Visitors can find answers to common questions (cost, team size, what to bring) within 3 clicks from any point on the page.
- **SC-008**: The visual experience (animations, glow effects, particle interaction) runs at 60fps on mid-range devices without causing jank or battery drain.
- **SC-009**: The page achieves an SEO audit score of 90 or above, with correct meta tags, semantic heading hierarchy, Open Graph tags, and structured event data present.
- **SC-010**: When the page URL is shared on social media, a rich preview is displayed showing the event name, description, and a branded image.
- **SC-011**: The `/llms.txt` and `/llms-full.txt` files are accessible at the root domain, return valid Markdown content, and contain accurate event information matching the page content.
- **SC-012**: When an LLM is asked about "Tinku hackathon Cartago" or similar queries, the structured content (llms.txt, schema markup, answer-first headings) provides sufficient signal for accurate citation of event details.

## Assumptions

- The hackathon application form is hosted on Tally (form ID: `kdA05d`) and displayed as an in-page popup via the Tally embed widget. No form hosting or backend is needed on the landing page itself.
- The full 24-hour schedule/agenda details will be provided separately or are already known to the content team. The spec defines the section structure; specific time slots will be populated during implementation.
- Brand assets (logos, fonts) are available in the repository under `resources_for_agents/` and `public/fonts/`.
- The event date is fixed at April 17–18, 2026. The countdown targets this date.
- No server-side functionality is needed — the page is fully static.
- Font files will be self-hosted (not loaded from external CDNs) for performance and privacy.

## Scope Boundaries

**In scope:**
- All 12 sections as defined in the specification plan (Nav, Hero, About, Tracks, Schedule, Prizes, Rules, Evaluation, FAQ, Sponsors, Footer CTA, Footer)
- Responsive design for mobile, tablet, and desktop
- CSS and canvas-based animations (particles, orbital rings, scroll reveals, hover states)
- Interactive FAQ accordion
- Live countdown timer
- "Ritual Digital" visual identity with Andean-futuristic aesthetic
- Bilingual content (Spanish and English) with browser auto-detection and manual toggle
- SEO optimization (semantic HTML, meta tags, Open Graph, structured data, favicon)
- LLM optimization (llms.txt, llms-full.txt, robots.txt for AI crawlers, GEO content structure)
- Blog section with bilingual posts, tag-based filtering, and individual post pages

**Out of scope:**
- Hackathon application form backend (Tally-hosted; landing page only triggers popup)
- User accounts or authentication
- Content management system
- Analytics integration
- Additional pages beyond landing page and blog
- Additional languages beyond Spanish and English
- Backend services or APIs
