# Silt Coffee — Concept Website

A high-fidelity portfolio concept for a specialty coffee roastery & café, built to demonstrate what a modern, editorial-quality web presence looks like for independent hospitality businesses.

**Live demo:** [koncept-caffe.vercel.app](https://koncept-caffe.vercel.app)

---

## Overview

Silt Coffee is a fictional Berlin roastery used as a showcase piece for prospective clients in the food & beverage and hospitality space. The goal was to prove that a small independent café can have a web presence that rivals premium lifestyle brands — without compromising on speed, accessibility, or maintainability.

Everything here is intentional: the type choices, the warm parchment-and-tan palette, the parallax photography, the slide-in modals. It's designed to start conversations with clients about what their own brand could look like online.

---

## What's Inside

### Sections

| Section | Description |
|---|---|
| **Hero** | Full-viewport headline with a clip-path reveal animation and staggered text entrance |
| **Parallax Strip** | Scroll-driven photography panel with an overlay caption |
| **Concept** | Two-column brand story with an image carousel |
| **Gallery** | Horizontally scrollable photo strip with hover captions and a fullscreen lightbox |
| **Menu** | Tabbed menu (Espresso / Pour Over / Pastries) with a slide-in photo modal per item |
| **Visit** | Embedded map, opening hours, and a newsletter opt-in |

### Features

- **Dark / light mode** — respects `prefers-color-scheme` on first load, persisted to `localStorage`
- **Scroll-triggered animations** — IntersectionObserver-based reveals throughout, with staggered delays
- **Responsive navigation** — desktop nav collapses to a full-screen hamburger overlay on mobile
- **Accessible markup** — skip link, ARIA roles/labels, keyboard navigation on all interactive elements, `prefers-reduced-motion` support
- **Two modal systems** — a slide-in panel for menu item photos, and a fullscreen lightbox for the gallery
- **Smooth parallax** — passive scroll listener driving a subtle background translation on the hero image strip

---

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| React | 19 | UI / component model |
| Vite | 8 | Dev server & build |
| Google Fonts | — | Barlow Condensed, Hanken Grotesk, DM Mono |

No UI libraries, no CSS frameworks. All styling is hand-authored CSS injected via a `StyleInjector` component, using CSS custom properties throughout for theming.

---

## Getting Started

**Requirements:** Node.js ≥ 20.19.0

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview
```

---

## Project Structure

```
silt-coffee/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── App.jsx          # Main component — all sections live here
│   ├── index.css        # Root layout & design token defaults
│   └── main.jsx         # React entry point
├── index.html
└── vite.config.js
```

All page sections (`Hero`, `MenuSection`, `Footer`, etc.) are co-located in `App.jsx` for simplicity. For a production project these would be split into individual files.

---

## Design Decisions

**Typography** — Barlow Condensed (900 weight) for display headings creates the compressed, editorial tension typical of specialty food brands. Hanken Grotesk handles body copy at a comfortable reading weight. DM Mono is used sparingly for labels and metadata, adding a tactile, print-like quality.

**Colour** — The palette avoids the saturated blues and purples common in web design. Warm parchment (`#E8E1D4`) and tan (`#CEC4B0`) reference physical materials — paper, linen, aged packaging. The rust accent (`#C45132`) is pulled from roasted coffee tones. Dark mode flips to deep ink tones rather than pure black, keeping the warmth.

**Motion** — Animations are load-sequenced (header, then headline clip, then supporting text) to create a sense of narrative on arrival. Scroll reveals use `IntersectionObserver` and disconnect after firing once, keeping the runtime cost negligible.

**No dependencies** — The deliberate choice to avoid component libraries keeps the bundle small and ensures every visual decision is explicit and client-customisable.

---

## Customisation

All content — menu items, copy, photography URLs, hours, address — lives in the data constants at the top of `App.jsx`. Swapping this project to a real client's brand means updating:

- `MENU` — item names, prices, descriptions, and photo URLs
- `GALLERY` — photo sources and captions
- `CAROUSEL_ITEMS` — concept section images
- CSS custom properties in the `CSS` string — primary colours, accent, dark mode values
- The Google Fonts import URL — for a different type pairing

---

## Accessibility

- Fully keyboard navigable (modals, tabs, carousel, gallery)
- Skip-to-content link visible on focus
- All interactive `div` elements use `role="button"` with `tabIndex` and `onKeyDown` handlers
- Modal dialogs use `role="dialog"` and `aria-modal="true"`, with body scroll locked while open
- `prefers-reduced-motion` media query disables all transitions and animations for users who opt out
- Colour contrast meets WCAG AA in both light and dark modes

---

## Deployment

The project is deployed on [Vercel](https://vercel.com). Any static hosting platform works:

```bash
npm run build
# Deploy the contents of /dist
```

---

## License

This is a portfolio/showcase project. The code is available for reference and inspiration. Photography is sourced from [Unsplash](https://unsplash.com) and subject to the Unsplash License.

---

*Built as a client-facing demonstration of what a modern hospitality brand can look like on the web.*
