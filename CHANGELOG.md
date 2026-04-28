# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] — 2026-04-28

> **Major release.** This version introduces breaking changes — see Migration Guide
> in `README.md` for the upgrade path from v2.x.

### Added

- **Plugin system** — `NeikiGallery.registerPlugin(name, factory)` with lifecycle hooks (`init`, `open`, `change`, `close`, `destroy`); plugins receive the gallery instance and can extend behavior, add toolbar overlays, etc. (`plugins` option)
- **Video & embed support** — auto-detect MP4 / WebM / Ogg / MOV / M4V video files and YouTube / Vimeo URLs in gallery items; rendered as `<video>` with controls or as iframe in lightbox; videos auto-pause when changing slides (`video` option, `data-poster`, `data-type`)
- **Album groups** — link multiple galleries with `data-group="album"`; navigation traverses across all gallery items in the same group; counter reflects group totals (`group` option)
- **Favorites / bookmarks** — heart button in lightbox toolbar with localStorage persistence; thumbnails get a heart badge when favorited; `B` keyboard shortcut; `getFavorites()`, `clearFavorites()`, `isFavorite()`, `toggleFavorite()` API; `favorite` / `unfavorite` events (`favorites` option)
- **Image info panel** — slide-out sidebar showing filename, dimensions, tags, EXIF, source URL; `I` keyboard shortcut; `toggleInfoPanel()` API (`infoPanel` option)
- **Print support** — print current image with caption via toolbar entry, `P` keyboard shortcut, or `gallery.print()` API method; emits `print` event
- **Right-click context menu** — custom menu on gallery items: open original, copy link, download, share, print, favorite (`contextMenu` option)
- **Keyboard shortcuts overlay** — press `?` to view all shortcuts in a modal; toggle via toolbar button; lists all 10+ shortcuts (`shortcutsHelp` option, on by default)
- **Infinite scroll / dynamic items** — `loadMore` callback fires when nearing scroll bottom and appends returned items; `gallery.append(items)` and `gallery.remove(index)` methods; `infiniteScroll` option
- **Image editor** — toolbar with rotate (CW/CCW), flip (horizontal/vertical), reset, and PNG export via Canvas; cross-origin safe; `openEditor()`, `closeEditor()`, `getEditedBlob()` API; emits `editorOpen`, `editorClose`, `editorExport` events (`editor` option)
- **Annotation / drawing layer** — freehand drawing on images with color picker, brush size slider, undo, clear, and PNG export; `openAnnotate()`, `closeAnnotate()`, `getAnnotatedBlob()` API; emits `annotateOpen`, `annotateClose`, `annotateExport` events (`annotate` option)
- **Kenburns slideshow effect** — slow zoom-and-pan animation per slide, sync'd to slideshow interval; configurable via `slideshow.kenburns: true`
- **Slideshow pause-on-hover** — auto-pauses slideshow when cursor enters the lightbox; configurable via `slideshow.pauseOnHover: true`
- **Slideshow direction** — reverse playback via `slideshow.direction: 'reverse'`
- **Configurable counter format** — `counterFormat` option supports `{current}`, `{total}`, `{percent}` tokens (e.g. `'Image {current} of {total} ({percent}%)'`)
- **System theme detection** — `theme: 'system'` (new default) auto-detects `prefers-color-scheme` and follows OS theme changes live
- **`gallery.once(event, callback)`** — auto-removes listener after first fire
- **`gallery.off(event)`** — without callback now removes all listeners for that event
- New keyboard shortcuts: `Z` toggle zoom, `I` info panel, `B` favorite, `P` print, `?` shortcuts help; `Escape` now closes overlays first before lightbox
- New static utilities: `NeikiGallery.detectMediaType()`, `NeikiGallery.registerPlugin()`, `NeikiGallery.unregisterPlugin()`, `NeikiGallery.getRegisteredPlugins()`, `NeikiGallery.version`
- New events: `favorite`, `unfavorite`, `infoOpen`, `infoClose`, `print`, `editorOpen`, `editorClose`, `editorExport`, `annotateOpen`, `annotateClose`, `annotateExport`, `append`, `remove`, `pluginRegister`
- New data attributes: `data-video`, `data-poster`, `data-type`, `data-group`, `data-favorites`, `data-info-panel`, `data-context-menu`, `data-shortcuts-help`, `data-infinite-scroll`, `data-editor`, `data-annotate`, `data-counter-format`, `data-slideshow-pause-on-hover`, `data-slideshow-kenburns`
- Demo page expanded with 5 new sections (Video/Embed, Favorites+Info+Print, Editor+Annotation, Album Groups, Plugin System)

### Changed

- **BREAKING: Slideshow config is now nested.** `slideshowInterval: 4000` no longer exists. Use `slideshow: { interval: 4000, pauseOnHover: true, kenburns: true, direction: 'forward' }`. The boolean form `slideshow: true` still works and uses default interval (4000 ms).
- **BREAKING: Default theme is `'system'` instead of `'dark'`.** To restore old behavior, explicitly set `theme: 'dark'`.
- **BREAKING: Hash format changed** from `#neiki-{numericId}={index}` to `#{containerIdOrGroupName}/{index}` for cleaner URLs that integrate with semantic page anchors.
- **BREAKING: Minimum supported browser raised** from Chrome 60+ / Firefox 55+ / Safari 12+ to Chrome 80+ / Firefox 75+ / Safari 14+ to take advantage of `aspect-ratio`, `backdrop-filter`, optional chaining tolerance, and modern Intersection/Resize observers.
- **BREAKING: `data-slideshow-interval` attribute is deprecated** in favor of the nested form (still parsed for backward-compat in v3.0.0, will be removed in v4.0.0).
- Counter element text is now produced by `_formatCounter(index, total)` honoring `counterFormat`.
- `_goTo()` factored: shared post-navigation logic moved to `_postGoToCommon()` so non-image media (video/embed) reuse counter, caption, hash, info-panel, fav-UI updates.

### Removed

- **BREAKING: Top-level `slideshowInterval` option** — moved into nested `slideshow.interval`.
- **BREAKING: Hardcoded counter format** `"3 / 12"` — replaced by `counterFormat` option (default produces same output, but is now overridable).

### Migration Guide (v2.x → v3.0.0)

```js
// v2.x
new NeikiGallery('#g', {
  slideshow: true,
  slideshowInterval: 5000,
  theme: 'dark'
});

// v3.0.0
new NeikiGallery('#g', {
  slideshow: { interval: 5000, pauseOnHover: true },
  theme: 'dark'  // explicit if you don't want system detection
});
```

If you depend on the old hash format, set `hashNavigation: false` and implement your own routing.

## [2.1.0] — 2026-04-28

### Added

- **Blurhash placeholders** — decode `data-blurhash` attribute into blurred preview image while loading (replaces shimmer)
- **Story mode** — Instagram-like vertical fullscreen viewer with auto-advance progress bars and tap navigation (`storyMode` option)
- **Picture-in-Picture (PiP) lightbox** — minimize lightbox to a resizable corner window while scrolling the page (`pip` option)
- **Image focus point** — `data-focus="0.3 0.7"` on images controls `object-position` for smart cropping in grid layouts (`focusPoint` option)
- **EXIF overlay** — reads camera model, focal length, aperture, shutter speed, and ISO from JPEG binary in lightbox (`exif` option)
- **Color palette extraction** — k-means quantized 5-color palette strip displayed in lightbox (`colorPalette` option)
- **Backdrop tint** — lightbox overlay adapts to dominant color of current image (`backdropTint` option)
- **FLIP morph transition** — smooth thumbnail-to-lightbox animation using FLIP pattern (`morphTransition` option)
- **Virtual scrolling** — `content-visibility` based virtualization for galleries with 50+ items (`virtualScroll` option)
- **Drag & drop reorder** — native HTML5 drag to reorder grid items, `getOrder()` API method (`dragReorder` option)
- **Aspect-ratio skeleton** — `data-width` / `data-height` attributes set skeleton placeholder aspect ratio (`aspectSkeleton` option)
- **Web Share API** — share button now uses native `navigator.share()` with clipboard copy fallback
- New events: `reorder`, `pipEnter`, `pipExit`, `storyEnter`, `storyExit`
- New API method: `getOrder()` — returns current item order after drag reorder
- New static utilities: `NeikiGallery.extractPalette()`, `NeikiGallery.extractDominantColor()`, `NeikiGallery.parseExif()`, `NeikiGallery.decodeBlurhash()`
- New data attributes: `data-focus`, `data-blurhash`, `data-width`, `data-height`, `data-focus-point`, `data-exif`, `data-story-mode`, `data-pip`, `data-virtual-scroll`, `data-drag-reorder`, `data-backdrop-tint`, `data-morph-transition`, `data-color-palette`, `data-aspect-skeleton`
- New CSS sections: PiP lightbox, Story mode, EXIF overlay, Color palette strip, Drag & drop, Virtual scroll, Backdrop tint
- Demo page expanded with 3 new sections (Story/PiP, Drag & Drop, Focus Point)

### Changed

- **Single-file distribution** — `neiki-gallery.min.js` now includes all CSS auto-injected into `<head>`, so users only need one `<script>` tag (separate CSS files still available)
- Share popup now tries `navigator.share()` first (mobile-native sharing) before falling back to clipboard copy
- Clipboard copy extracted to reusable `_copyToClipboard()` internal method
- Empty CSS ruleset for `.neiki-progress--paused` replaced with `transition: none` (fixes lint warning)

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
