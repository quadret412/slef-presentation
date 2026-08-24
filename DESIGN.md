# Design

<!-- impeccable:design-schema 1 -->

## Surface

Public resume site. Dark cinematic Apple register, pinned by the owner.

## Palette

Two registers, same materials. Default follows the system; the header control cycles System → Light → Dark.

Dark (dusk):

- Ground: `#0b0a08`
- Raised: `#14120f`
- Sand: `#f3ede4` (primary type)
- Sand dim: `#c8bdb0` (secondary type, tinted from sand — not gray)
- Steel: `#8eafc4` (from the vest)
- Line: `rgba(243, 237, 228, 0.1)`

Light (warm paper):

- Ground: `#f3eee6`
- Raised: `#fffaf3`
- Ink: `#1c1915` (same `--sand` token)
- Ink dim: `#5c534b`
- Steel: `#3f5f73` (deepened for contrast on paper)
- Line: `rgba(28, 25, 21, 0.12)`

## Type

Host Grotesk. Display uses tight leading (~0.96–1.05) and tracking about `-0.03em`. Body ~17px / 1.6. Weight carries hierarchy.

## Chrome

Sticky nav. Transparent over the hero; frosted (`backdrop-filter`) after scroll. Hairline, not a hard divider. Resume is the solid chip. Theme control sits beside it and cycles System / Light / Dark.

## Layout

First viewport: portrait left (subject looks right), name and offer right. Later sections are two-column lists, not icon cards. Experience is a timeline: dates left, story right.

## Interaction

Craft section after About: brand-token switcher (Atlas / Ember / Vale), realtime wallet desk, and a selectable Vue/React/TS stack dock. Pointer tilt on the brand stage is hover-only.

## Motion

One hero settle (photo scale, type rise) with `cubic-bezier(0.23, 1, 0.32, 1)`. Scroll reveals are short and already-visible. Buttons scale to `0.97` on press. Honor `prefers-reduced-motion` and `prefers-reduced-transparency`.

## Assets

- `/dmitry.jpg` — supplied portrait
- `/Dmitry-Antonov-Resume.pdf` — LinkedIn export
