# What Fits My Budget v2 — dynamic slider calculator

Standalone mobile-first React app. Alternative flow to the v1 room-builder
calculator (`../budget-calculator`), built as a separate deployment so both
can be tested and compared before deciding which one goes live.

Visitor picks flooring material(s) first, then drags one budget slider —
the affordable room tier updates live underneath as the slider moves, with
no separate "calculate" step and no static result screen.

## Run locally

```bash
npm install
npm run dev
```

## How it differs from v1

- No room builder — instead there's a fixed price-independent tier table
  (`TIERS` in [src/calc.js](src/calc.js)) mapping budget to a room
  combination (1 small, 2 medium, 3 large, etc).
- Materials are picked first (multi-select), then the budget slider drives
  a live result: one card per selected material, each showing the tier
  that budget currently affords for that material.
- With 2+ materials selected, a "Mix these instead" toggle swaps to a
  single combined card using an even split of the current tier's total m²
  across the selected materials.
- No room illustration — result cards are text-led (brand hero-glow +
  layered-shadow cards, same visual language as v1).

## Before launch — confirm and update

1. **Pricing and tier table** — [src/calc.js](src/calc.js). Per-m² prices
   (`FLOORING_PRICES_PER_M2`) and the tier table (`TIERS`) are confirmed
   real figures as of this build; update here if pricing changes.
2. **Booking URL** — `BOOKING_URL` in [src/App.jsx](src/App.jsx). The
   "Book a free measure-up" button currently redirects to the MDF homepage
   as a temporary placeholder, matching v1 — swap for the real booking page
   once it's built.

## Deploy

```bash
npm run build
```

Deploy `dist/` as its own project/URL (e.g. a separate Vercel project),
kept independent from the v1 calculator so both can be A/B reviewed.
