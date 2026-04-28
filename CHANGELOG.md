# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] — 2026-04-28

### Added

- **Mosaic layout** — CSS Grid based dense layout with `data-size="large|wide|tall"` support
- **Filmstrip layout** — horizontal scrollable strip with scroll snap
- **Staggered entrance animation** — items animate in sequentially on load (configurable via `--neiki-stagger-delay`)
- **Slideshow / Autoplay** — auto-advance with animated progress bar, play/pause toggle (Space key), configurable interval
- **Comparison slider** — static utility `NeikiGallery.compare()` for before/after image comparison with drag handle
- **Share popup** — copy image link to clipboard or download image directly from lightbox
- **Contextual zoom** — zoom to the clicked point instead of center (`contextualZoom` option)
- **Batch select** — Shift+click multi-select on grid items with checkmark overlay, `getSelected()` / `clearSelection()` API
- **Tag filtering** — auto-generated pill filter bar from `data-tags` attributes, `filter()` API method
- **Floating toolbar** — glassmorphism grouped toolbar (play, share, fullscreen, close) replaces individual buttons
- **Pill counter** — glassmorphism pill-shaped image counter badge
- **Toast notifications** — non-intrusive toast messages for copy/share actions
- **Accent color system** — `--neiki-accent` custom property used across active states, spinner, selections, and filters
- New events: `slideshowStart`, `slideshowStop`, `filter`, `select`
- New keyboard shortcut: Space to toggle slideshow
- New data attributes: `data-stagger`, `data-slideshow`, `data-slideshow-interval`, `data-share`, `data-filter`, `data-batch-select`, `data-contextual-zoom`, `data-tags`, `data-size`

### Changed

- **Glassmorphism design** — overlay, buttons, counter, toolbar, share popup, and caption now use `backdrop-filter` blur effects
- **Modernized border radius** — default increased from `6px` to `14px` for softer card appearance
- **Hover micro-interactions** — items lift (`translateY`) with shadow on hover instead of just scaling
- **Rounded buttons** — `border-radius` changed from circle (`50%`) to `12px` rounded square
- **Improved thumbnails** — scale animation on hover/active, accent-colored active border
- **Hidden scrollbars** — thumbnail strip and filmstrip scrollbars hidden for cleaner look
- **Bottom sheet caption** — on mobile, caption becomes a blurred bottom sheet panel
- **Font stack** — added `'Segoe UI'` to system font stack
- **Smoother transitions** — refined timing for entrance, hover, and lightbox animations
- **Better shimmer** — updated shimmer gradient colors for both light and dark themes

### Removed

- Individual close/fullscreen buttons outside toolbar (now grouped in floating toolbar)

## [1.0.0] — 2026-04-28

### Added

- Initial release of Neiki Gallery
- Responsive masonry layout (CSS columns)
- Uniform grid layout (CSS Grid)
- Lightbox with fade and slide transitions
- Keyboard navigation (arrow keys, Escape, Home, End, F for fullscreen)
- Touch / swipe support for mobile devices
- Lazy loading via IntersectionObserver with shimmer placeholders
- Image captions via `data-caption` attribute
- Optional thumbnail strip in lightbox
- Zoom toggle on image click
- Fullscreen mode via Fullscreen API
- Image counter display (e.g. "3 / 12")
- Pure CSS loading spinner
- URL hash deep linking (`#neiki-{id}={index}`)
- Multiple independent gallery instances per page
- Dark and light theme support via `data-theme` attribute
- CSS custom properties (`--neiki-*`) for full theming control
- Auto-initialization via `data-neiki-gallery` attribute
- Manual JS API: `open()`, `close()`, `next()`, `prev()`, `destroy()`
- Event system: `open`, `close`, `change`
- Preloading of adjacent images
- Optional infinite loop navigation
- ARIA attributes and keyboard accessibility
- `prefers-reduced-motion` support
- Responsive breakpoints for grid and lightbox
- Cross-browser support (Chrome 60+, Firefox 55+, Safari 12+, Edge 79+)
- Demo page with three gallery examples
