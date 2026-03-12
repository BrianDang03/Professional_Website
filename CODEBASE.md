# briandangdev-website — Codebase Overview

> **Update this file after every session that changes architecture, adds/removes files, or changes key patterns.**
> Last updated: 2026-03-12

---

## 1. Project Identity

- **Site:** Personal portfolio for Brian Dang — Software Engineer / Gameplay Engineer
- **URL:** https://briandangdev.com/
- **Deploy:** GitHub Pages via `npm run deploy` (`gh-pages -d dist`)
- **Root:** `frontend/` (all source lives here)

---

## 2. Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 19 + Vite 8 (beta) |
| Routing | React Router DOM v7 |
| Animation | Framer Motion v12 |
| Icons | lucide-react |
| Fonts | Manrope (body), Cinzel (headings) |
| Build target | ES2015 |
| Linting | ESLint 9 + react-hooks plugin |

**Manual chunk split (`vite.config.js`):**
- `vendor-react` — react, react-dom, react-router-dom
- `vendor-motion` — framer-motion
- `vendor-ui` — lucide-react
- Pages lazy-loaded (Home, Portfolio, About)

---

## 3. Directory Structure

```
frontend/src/
├── App.css                      # Global styles ONLY (vars, resets, layout utilities)
├── App.jsx                      # Shell — uses useAppBoot, composes all background layers
├── main.jsx                     # Entry point — wraps App in BrowserRouter
├── hooks/
│   └── useAppBoot.js            # ALL boot sequencing state + effects
├── utils/
│   ├── boot.js                  # Boot constants (delays, image list, route preloaders)
│   └── motionProfile.js         # shouldUseSimpleMotion() — cached device capability check
├── components/
│   ├── AppLoader/               # Full-screen loading overlay (shown until boot complete)
│   │   ├── AppLoader.jsx
│   │   └── AppLoader.css        # Loader spinner, text, light-mode overrides, keyframe
│   ├── DecorativeShapes/        # Orbs, beams, floating-plus background shapes
│   │   ├── DecorativeShapes.jsx
│   │   └── DecorativeShapes.css # ALL shape CSS — containers, keyframes, positions, light-mode
│   ├── WaveLines/               # Animated SVG sine-wave lines (background layer)
│   │   ├── WaveLines.jsx        # Pure math — builds cubic bezier paths in JS
│   │   └── WaveLines.css
│   ├── Navbar/                  # Site header with mobile hamburger menu
│   │   ├── Navbar.jsx
│   │   └── Navbar.css           # Includes [data-theme="light"] nav overrides
│   ├── Footer/
│   │   ├── Footer.jsx
│   │   └── Footer.css           # Includes [data-theme="light"] footer overrides
│   ├── HeroBlock/               # Hero section with name/job title
│   │   ├── HeroBlock.jsx
│   │   └── HeroBlock.css        # Includes [data-theme="light"] h1/h2 color overrides
│   ├── HomeCards/               # Two TiltFlipCards on the home page
│   │   ├── HomeCards.jsx
│   │   └── HomeCards.css
│   ├── TiltFlipCard/            # 3D tilt + flip card component
│   │   ├── TiltFlipCard.jsx     # RAF tilt, click-to-flip, expand modal, GPU-optimized
│   │   └── TiltFlipCard.css
│   ├── ProjectsGrid/            # Grid of ProjectCards for the Portfolio page
│   ├── ProjectCard/             # Individual project card
│   ├── SkillsGrid/              # Skills display on About page
│   ├── ContactForm/             # Contact form on About page
│   ├── FlipIcon/                # Small icon hinting at card flip
│   ├── ThemeToggle/             # Dark/light theme toggle button
│   ├── SkipToContent/           # Accessibility skip-nav link
│   ├── PageTransition.jsx       # Framer Motion fade+slide wrapper for each page
│   ├── ErrorBoundary.jsx        # React error boundary wrapping the whole app
│   ├── SEO.jsx                  # Manages <title>, <meta>, canonical link imperatively
│   └── ActionButton.css         # Shared button styles (imported by HomeCards, etc.)
└── pages/
    ├── Home/Home.jsx            # Landing — HeroBlock + HomeCards + bottom line
    ├── Portfolio/Portfolio.jsx  # ProjectsGrid inside page-shell
    └── About/About.jsx          # SkillsGrid + ContactForm, scroll-to-section on nav
```

---

## 4. CSS Architecture Rule

**Every component owns its own CSS file, including light-mode overrides.**
`App.css` contains ONLY truly global rules:

- `:root` and `[data-theme="light"]` CSS custom properties
- Global `[data-theme="light"]` body/html/focus overrides
- `html` scrollbar styles
- `body` background + typography
- `#root`, `img`, `.site-root`, `.site-root-preboot`, `.site-root-enter`
- `@keyframes app-root-reveal`
- `.wave-bg` container (owned by App.jsx)
- `.main-content`, `.route-loading`, `.page-shell`, `.hero-kicker` layout utilities
- Responsive media queries for the above

**Do NOT add component-specific CSS to App.css.**

---

## 5. Z-Index Stacking Order

| Layer | z-index | Element |
|-------|---------|---------|
| Stars (body::before) | -3 | fixed background dots |
| Wave SVG | -4 | `.wave-bg` |
| Shapes | -3 | `.theme-bg`, `.theme-bg-footer` |
| Content | auto | normal flow |
| Navbar | 15 | `.site-header` |
| App loader | 60 | `.app-loader` |

---

## 6. Boot Sequence (`useAppBoot.js`)

```
Mount
  → DEV perf mark
  → Lock scroll restoration to top
  → Core boot:
      await Promise.allSettled([
        min delay (420ms),
        two RAF frames (next paint),
        BOOT_IMAGES preload with 1800ms timeout
      ])
      → setIsBootReady(true)
  → isWavePaintReady: set by wave-bg transition-end or fallback RAF
  → canRevealApp = isBootReady && isWavePaintReady
      → loader exits (isLoaderExiting → then showLoader=false)
  → After canRevealApp:
      → idle-time prefetch non-critical images + route chunks
      → mount decorations (showDecorations=true)
      → shapes locked after entrance window (areShapesLocked=true, ~2800ms)
```

**Key constants (`utils/boot.js`):**
- `BOOT_MIN_DELAY_MS = 420`
- `BOOT_ASSET_TIMEOUT_MS = 1800`
- `BOOT_IMAGES = ["modem.jpg", "headshot.jpg", "contact.png", "flipIcon.png"]`
- `ROUTE_PRELOADERS = [About, Portfolio]` (lazy import functions)

---

## 7. Motion / Performance

- `shouldUseSimpleMotion()` — cached at module level. Returns `true` when:
  - `prefers-reduced-motion: reduce`
  - `saveData` network hint
  - ≤2 CPU cores
  - ≤2 GB RAM
- When `true`: PageTransition skips Framer Motion variants, WaveLines reduces to fewer lines
- `TiltFlipCard`: uses RAF for tilt, `will-change: transform` on animated elements, `box-shadow` instead of `filter:drop-shadow` for orbs

---

## 8. Theme System

- Toggle: `data-theme="light"` attribute on `<html>`
- Dark mode is default (`:root` vars)
- Light mode overrides live **co-located** in each component's CSS file
- Body background: multi-stop radial + linear gradient, `background-attachment: fixed`
- Mobile (≤900px): strips radials, switches to `background-attachment: scroll` to prevent repaint jank

---

## 9. Routing

- React Router v7, SPA mode (BrowserRouter)
- Pages are lazy-loaded with `React.lazy()` + `<Suspense>`
- `RouteLoadingFallback` shown during lazy load (uses `.app-loader-mark` spinner)
- `PageTransition` wraps every page — scrolls to top on mount, fades in/out with Framer Motion
- About page accepts `{ state: { scrollTo: "get-in-touch" } }` via router state for anchor scrolling
- Navbar "Contact" button navigates to About + triggers scroll, or scrolls directly if already on About

---

## 10. Image Handling

- All image paths use `import.meta.env.BASE_URL` prefix (NOT relative `./`)
  - e.g. `` `${import.meta.env.BASE_URL}headshot.jpg` ``
- Responsive images: `makeSrcSet(name, ext)` in HomeCards generates 480w/768w/1200w srcset
- WebP with JPEG fallback via `<picture>` in TiltFlipCard
- `public/` folder images: modem.jpg, headshot.jpg, contact.png, flipIcon.png (also -480, -768, -1200 variants)

---

## 11. Accessibility

- `<SkipToContent>` — first focusable element, links to `#main-content`
- `<ErrorBoundary>` — catches render errors globally
- Navbar: Escape key closes mobile menu; focus trapped via keydown listener
- `AppLoader`: `role="status"`, `aria-live="polite"`, `aria-busy`
- All decorative elements: `aria-hidden="true"`
- `:focus-visible` global ring in App.css; component overrides where needed

---

## 12. Deployment

```bash
npm run deploy   # runs: vite build → gh-pages -d dist
```

- `public/CNAME` — sets custom domain `briandangdev.com`
- `public/404.html` — GitHub Pages SPA fallback
- `public/robots.txt` + `public/sitemap.xml`

---

## 13. Known Patterns & Gotchas

- **Folder naming:** `TiltFlipCard/` (PascalCase) — was previously `tilt_flip_card/`
- **WaveLines CSS filter:** Filter is on individual `<path>` elements, NOT the `<svg>` container (container filter breaks GPU compositing)
- **Orb box-shadow:** Uses `box-shadow` not `filter:drop-shadow` for performance (no Gaussian blur per frame)
- **Scroll lock for mobile nav:** Uses `position:fixed` + negative `top` technique, not `overflow:hidden` (prevents content jump)
- **`[data-theme="light"] body::before`:** Sets opacity to 0 (hides dark-mode noise overlay in light mode)

---

## 14. Change Log

| Date | Change |
|------|--------|
| 2026-03-12 | **Architecture pass:** Extracted `useAppBoot.js` hook from App.jsx (9 effects → hook). Created `AppLoader.css` and `DecorativeShapes.css`. Moved all light-mode component overrides from App.css to co-located component CSS files (Navbar, Footer, HeroBlock). Removed all dead hex/wave CSS. App.css reduced 880 → 364 lines. |
| earlier | TiltFlipCard performance pass (RAF, will-change, passive listeners, debounced resize) |
| earlier | Image path fix: relative `./` → `BASE_URL` prefix to fix broken images on route change |
| earlier | WaveLines visual redesign: pure math SVG, cubic bezier hermite paths, 5 sine streams |
| earlier | AppLoader, DecorativeShapes, WaveLines extracted as separate components from App.jsx |
| earlier | Hexagons removed from DecorativeShapes |
