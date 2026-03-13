---
name: generate-team-card
description: Generate branded team card images for Tinku hackathon teams. Use when the user wants to create team cards, generate team images, produce social media assets for hackathon teams, or mentions team card generation.
---

# Generate Team Card

Generate branded image cards for Tinku hackathon teams using the `GenerateImage` tool. Each card features the Tinku logo, a team logo derived from the team name, and participant names.

## Language Rule

All text rendered on the generated images **must be in Spanish**. The target audience is Spanish-speaking. Team names, participant names, and any labels on the card must preserve Spanish accents and special characters exactly (e.g. "Patacón", "Pérez").

## Reference

See [reference.png](reference.png) for the canonical card layout design.
See [background-reference.png](background-reference.png) for the background style — a deep-space starry sky.

## Required Input

Collect from the user before generating:

| Field | Description |
|-------|-------------|
| **Team name** | The team's name in Spanish (preserve accents and special characters exactly) |
| **Participants** | Exactly 3 participant full names |

The **team logo** is not provided — it is generated based on the team name (e.g. team "Patacón" gets a fried plantain, team "Cóndor" gets a condor bird).

## Design Specification

### Visual Identity

- **Background**: Deep-space starry night sky — very dark near-black base (#0a0a14) with scattered stars of varying brightness (tiny white and blue-white dots), subtle blue-tinted nebula clouds, and a few brighter star points with soft glow. See [background-reference.png](background-reference.png) for the exact look
- **Card border**: A subtle rounded-rectangle card border with a faint blue-purple gradient glow, floating over the starry background
- **Tinku logo**: Positioned at the top center — a geometric interlocking knot symbol in purple/violet with "Tinku" text in clean white sans-serif
- **Team logo**: Centered, circular, with a glowing purple/violet ring aura (neon glow effect). The logo image is a realistic representation of the object the team name refers to
- **Team name**: Large, bold, white sans-serif text below the logo. Must preserve all Spanish accents and special characters exactly
- **Participant names**: Centered below team name, medium weight, slightly smaller, lighter white text. One name per line, 3 lines total

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| Background base | `#0a0a14` | Deep-space sky base |
| Nebula tint | `#0d1b2a` | Blue-tinted nebula clouds |
| Star bright | `#ffffff` | Brightest star points |
| Star dim | `#8899aa` | Fainter background stars |
| Brand purple | `#a855f7` | Logo glow, border accents |
| Brand glow | `#7c3aed` | Outer glow ring |
| Text primary | `#ffffff` | Team name |
| Text secondary | `#e2e8f0` | Participant names |

## Formats

Generate **all three formats** for each team:

| Format | Aspect Ratio | Target Pixels | Layout | Filename suffix |
|--------|-------------|---------------|--------|-----------------|
| **Vertical** | 4:5 | 1080 × 1350 | Stacked: logo top → team image center → name → participants bottom | `-4x5.png` |
| **Horizontal** | 16:9 | 1920 × 1080 | Team image left with glow, Tinku logo + name + participants right-aligned | `-16x9.png` |
| **Square** | 1:1 | 1080 × 1080 | Stacked centered: logo top → team image center → name → participants | `-1x1.png` |

## Generation Workflow

1. **Gather team data** — Confirm team name (exact Spanish spelling with accents) and 3 participant names
2. **Determine team logo subject** — Infer a visual representation from the team name (e.g. food, animal, object). If ambiguous, ask the user
3. **Generate all 3 formats** — Use `GenerateImage` with the reference image and the design spec below. Generate all 3 in parallel. Each prompt specifies the exact pixel dimensions to request the correct size natively
4. **Resize if needed** — The `GenerateImage` tool has a known limitation: it may output all images at a fixed default size (e.g. 1376×768) regardless of prompt instructions. If any image has wrong dimensions, resize it with `sips -z {height} {width}` to the target size
5. **Verify dimensions** — Run `sips -g pixelWidth -g pixelHeight` on all 3 files to confirm correct sizes
6. **Verify text accuracy** — Check that Spanish accents in the team name and participant names are correct in the output
7. **Save to output directory** — Files go to `public/images/teams/`

### Image Prompt Template

Use this structure when calling `GenerateImage`. Replace `{placeholders}` with actual values:

```
IMPORTANT: This image MUST be exactly {width} pixels wide and {height} pixels
tall ({aspect_ratio} aspect ratio). Do NOT use any other dimensions.

A {format_description} team card for the "Tinku" hackathon.
Deep-space starry night sky background: very dark near-black base (#0a0a14)
filled with scattered stars of varying brightness — tiny white and blue-white
dots, subtle blue-tinted nebula clouds with soft diffuse glow, and a few
brighter star points with gentle halos. The starfield should feel realistic
and atmospheric, like a photograph of deep space.
A subtle rounded-rectangle card border with a faint blue-purple gradient glow,
floating over the starry background.
{layout_description}
The Tinku logo: a geometric interlocking knot symbol in purple/violet with
"Tinku" in clean white sans-serif text.
A realistic {team_logo_subject} as the team logo, circular, with a glowing
purple/violet neon ring aura effect around it.
The team name "{team_name}" in large bold white sans-serif text.
CRITICAL: All text on this image must be in Spanish. The team name must be
exactly "{team_name}" preserving all Spanish accents and special characters.
Three participant names in centered lighter white text, one per line:
"{participant_1}", "{participant_2}", "{participant_3}".
Overall aesthetic: dark, premium, cosmic/space-themed with purple accent glows.
The final image must be {width}x{height} pixels.
```

**Dimensions and layout descriptions per format:**

- **4:5 Vertical** (width=1080, height=1350): `Vertical portrait 4:5 layout, 1080x1350 pixels. Elements stacked vertically and centered: Tinku logo at top, team logo image in center, team name below, participant names at bottom.`
- **16:9 Horizontal** (width=1920, height=1080): `Horizontal widescreen 16:9 layout, 1920x1080 pixels. Team logo image with glow on the left side. Tinku logo, team name, and participant names right-aligned on the right side.`
- **1:1 Square** (width=1080, height=1080): `Square 1:1 layout, 1080x1080 pixels. Elements stacked vertically and centered: Tinku logo at top, team logo image in center, team name below, participant names at bottom.`

### Reference Image

Always pass the reference image when calling `GenerateImage`:

```
reference_image_paths: [".cursor/skills/generate-team-card/reference.png", ".cursor/skills/generate-team-card/background-reference.png"]
```

### Dimension Verification and Resize Fallback

After generating and copying images to `public/images/teams/`, verify dimensions:

```bash
sips -g pixelWidth -g pixelHeight public/images/teams/{slug}-4x5.png public/images/teams/{slug}-16x9.png public/images/teams/{slug}-1x1.png
```

Expected output:
- `{slug}-4x5.png` → 1080 × 1350
- `{slug}-16x9.png` → 1920 × 1080
- `{slug}-1x1.png` → 1080 × 1080

If any image has wrong dimensions, resize with `sips`:

```bash
sips -z 1350 1080 public/images/teams/{slug}-4x5.png
sips -z 1080 1920 public/images/teams/{slug}-16x9.png
sips -z 1080 1080 public/images/teams/{slug}-1x1.png
```

**Note:** This is a fallback for a known `GenerateImage` tool limitation. The prompts request exact pixel dimensions, but the tool may ignore them.

## File Naming

```
public/images/teams/{slug}-4x5.png
public/images/teams/{slug}-16x9.png
public/images/teams/{slug}-1x1.png
```

Where `{slug}` is the team name lowercased, accents removed, spaces replaced with hyphens (e.g. "Patacón" → `patacon`).

## Checklist

- [ ] Team name preserves exact Spanish accents and special characters
- [ ] All 3 participant names are correct
- [ ] Team logo subject makes sense for the team name
- [ ] All 3 formats generated (4:5, 16:9, 1:1)
- [ ] **Dimensions verified with `sips -g pixelWidth -g pixelHeight`** (1080×1350, 1920×1080, 1080×1080)
- [ ] If resize fallback was needed, it was applied and verified
- [ ] Files saved to `public/images/teams/` with correct naming
- [ ] Starry deep-space background is present and consistent
- [ ] Purple glow ring visible around team logo
- [ ] Tinku branding present in all formats
- [ ] All rendered text on the image is in Spanish

## Example

**Input:**
- Team name: Patacón
- Participants: Cristian Zapata, Borja Luis Pérez, Felipe Yusti

**Team logo subject:** A golden fried patacón (smashed fried plantain)

**Output files:**
```
public/images/teams/patacon-4x5.png
public/images/teams/patacon-16x9.png
public/images/teams/patacon-1x1.png
```
