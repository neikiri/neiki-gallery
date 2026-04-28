# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
