# Shieldra — Landing UI Kit

Marketing site recreation. Hero with mesh-gradient background, navbar with scroll-activated glass, feature cards, and floating stat cards built from the real `apps/landing` source.

## Components

- `Navbar.jsx` — fixed nav with scroll state, glass effect, CTA buttons
- `Hero.jsx` — the signature hero: badge pill, gradient headline, dual CTAs, floating stat cards
- `FeatureCard.jsx` — glass card with colored icon tile, eyebrow, title, description
- `FloatingStatCard.jsx` — glass card with score/KPI, used in hero
- `MeshBackground.jsx` — mesh orbs + dot pattern + animated beams

## Notes

- Icons via Lucide CDN.
- Fonts loaded via `colors_and_type.css`.
- All numeric counters use a `useCounter` ramp.
- Signature gradient (`brand → violet → brand, 200%`) on primary CTA + gradient-text word.
