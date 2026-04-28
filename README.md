<h1 align="center">Neiki Gallery</h1>

<p align="center">
  <img src="logo.png" alt="neiki-gallery" width="400">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E" alt="JavaScript">
  <img src="https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/css-%23663399.svg?style=for-the-badge&logo=css&logoColor=white" alt="CSS">
  <br>
  <img src="https://img.shields.io/badge/License-MIT-2563EB?style=for-the-badge&logo=open-source-initiative&logoColor=white&labelColor=000F15&logoWidth=20" alt="License">
  <img src="https://img.shields.io/badge/Version-3.0.0-2563EB?style=for-the-badge&logo=semantic-release&logoColor=white&labelColor=000F15&logoWidth=20" alt="Version">
</p>

<p align="center">
  <b>Vanilla JavaScript Image Gallery & Lightbox</b><br>
  <i>Beautiful, responsive, zero dependencies.</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Layouts-Masonry%20·%20Grid%20·%20Mosaic%20·%20Filmstrip-3b82f6?style=flat&labelColor=383C43" />
  <img src="https://img.shields.io/badge/Themes-Light%20%26%20Dark-8b5cf6?style=flat&labelColor=383C43" />
  <img src="https://img.shields.io/badge/Setup-Zero%20Config-22c55e?style=flat&labelColor=383C43" />
  <img src="https://img.shields.io/badge/Size-Lightweight-f97316?style=flat&labelColor=383C43" />
</p>

---

## 📖 About

**Neiki Gallery** is a production-ready image gallery and lightbox library built with vanilla JavaScript and CSS. No frameworks, no dependencies — just drop two files into your project and you're ready to go.

## ✨ Features

- **4 Layouts** — Masonry, Grid, Mosaic (`data-size`), and Filmstrip (horizontal scroll)
- **Glassmorphism lightbox** — backdrop-blur overlay with floating toolbar
- **Slideshow / Autoplay** — animated progress bar, play/pause, configurable interval
- **Comparison slider** — `NeikiGallery.compare()` for before/after image comparison
- **Share popup** — copy link to clipboard or download image from lightbox
- **Contextual zoom** — zoom to clicked point with pan support
- **Batch select** — Shift+click multi-select with checkmark overlays
- **Tag filtering** — auto-generated pill filter bar from `data-tags`
- **Staggered entrance** — sequential fade-in animation on load
- **Keyboard navigation** — arrows, Escape, Home/End, F (fullscreen), Space (slideshow)
- **Touch / swipe** — mobile-friendly left/right swipe navigation
- **Lazy loading** — IntersectionObserver with shimmer placeholders
- **Image captions** — bottom-sheet style on mobile
- **Thumbnail strip** — scrollable thumbnails with scale hover effect
- **Zoom** — click to toggle zoom, or contextual zoom to cursor point
- **Fullscreen** — native Fullscreen API
- **Pill counter** — glassmorphism pill-shaped counter badge
- **Toast notifications** — for share/copy actions
- **Deep linking** — URL hash navigation
- **Multiple instances** — independent galleries on one page
- **Dark & light themes** — CSS custom properties + accent color system (`--neiki-accent`)
- **Accessibility** — ARIA attributes, focus management, `prefers-reduced-motion`
- **Event system** — `open`, `close`, `change`, `filter`, `select`, `slideshowStart`, `slideshowStop`, `favorite`, `unfavorite`, `infoOpen`, `infoClose`, `print`, `editorOpen`, `editorExport`, `annotateOpen`, `annotateExport`, `append`, `remove`
- **Blurhash placeholders** — `data-blurhash` attribute decoded into blurred preview (replaces shimmer)
- **Story mode** — Instagram-like vertical fullscreen viewer with progress bars and tap navigation
- **Picture-in-Picture** — minimize lightbox to a resizable corner window
- **Image focus point** — `data-focus="0.3 0.7"` controls `object-position` for smart cropping
- **EXIF overlay** — camera model, focal length, aperture, shutter speed, ISO from JPEG binary
- **Color palette extraction** — k-means quantized 5-color palette strip in lightbox
- **Backdrop tint** — overlay adapts to dominant color of current image
- **FLIP morph transition** — smooth thumbnail-to-lightbox animation
- **Virtual scrolling** — `content-visibility` virtualization for large galleries (50+ items)
- **Drag & drop reorder** — HTML5 drag to reorder grid items
- **Aspect-ratio skeleton** — `data-width`/`data-height` for placeholder sizing
- **Web Share API** — native mobile sharing with clipboard fallback
- **Video & embeds** — auto-detect MP4/WebM/Ogg/MOV/M4V, YouTube and Vimeo URLs in lightbox
- **Plugin system** — `NeikiGallery.registerPlugin()` with `init`/`open`/`change`/`close`/`destroy` lifecycle hooks
- **Album groups** — `data-group="album"` links galleries; navigation traverses across all
- **Favorites** — heart button + localStorage persistence + `B` key shortcut
- **Info panel** — slide-out sidebar with metadata, EXIF, source URL (`I` key)
- **Image editor** — rotate / flip / export to PNG via `<canvas>`
- **Annotation layer** — freehand drawing with color picker, brush size, undo, clear, export
- **Print** — print current image with caption (`P` key)
- **Right-click context menu** — open original, copy link, download, share, print, favorite
- **Infinite scroll** — `loadMore` callback + `append()` / `remove()` API
- **Keyboard shortcuts overlay** — press `?` to view all shortcuts
- **System theme detection** — `theme: 'system'` follows OS `prefers-color-scheme`
- **Kenburns slideshow** — slow zoom-and-pan animation per slide
- **Configurable counter** — `counterFormat` with `{current}`/`{total}`/`{percent}` tokens
- **Cross-browser** — Chrome 80+, Firefox 75+, Safari 14+, Edge 80+

## 🚀 Quick Start

### CDN (Recommended)

Add this single line to your HTML — that's all you need (CSS is included automatically):

```html
<script src="https://cdn.neiki.eu/neiki-gallery/neiki-gallery.min.js"></script>
```

Then create your gallery markup:

```html
<div data-neiki-gallery data-layout="masonry" data-theme="dark">
  <a href="images/photo1-full.jpg" data-caption="Beautiful sunset">
    <img src="images/photo1-thumb.jpg" alt="Sunset">
  </a>
  <a href="images/photo2-full.jpg" data-caption="Mountain view">
    <img src="images/photo2-thumb.jpg" alt="Mountains">
  </a>
</div>
```

That's it — galleries with `data-neiki-gallery` auto-initialize on page load.

> **Unminified files** are also available if you need them for debugging (require separate CSS):
> ```
> https://cdn.neiki.eu/neiki-gallery/neiki-gallery.js
> https://cdn.neiki.eu/neiki-gallery/neiki-gallery.css
> ```

> **Pin a specific version** to avoid unexpected changes:
> ```
> https://cdn.neiki.eu/neiki-gallery/3.0.0/neiki-gallery.min.js
> ```

### Self-Hosting (Local)

Download or clone the repository from GitHub:

```bash
git clone https://github.com/neikiri/neiki-gallery.git
```

For production, you only need one file — CSS is already included:

```html
<script src="path/to/neiki-gallery.min.js"></script>
```

For development / debugging, use the unminified versions (requires separate CSS):

```html
<link rel="stylesheet" href="path/to/neiki-gallery.css">
<script src="path/to/neiki-gallery.js"></script>
```

The `dist/` folder contains:

| File | Description |
|------|-------------|
| `neiki-gallery.min.js` | Minified JS + CSS included (production) |
| `neiki-gallery.min.css` | Minified CSS standalone (optional) |
| `neiki-gallery.js` | Full JS without CSS (development / debugging) |
| `neiki-gallery.css` | Full CSS (development / debugging) |

### Manual Initialization

```js
const gallery = new NeikiGallery('#my-gallery', {
  layout: 'masonry',       // 'masonry' | 'grid' | 'mosaic' | 'filmstrip'
  loop: true,
  thumbnails: true,
  zoom: true,
  contextualZoom: false,   // zoom to click point
  fullscreen: true,
  transition: 'fade',      // 'fade' | 'slide'
  theme: 'system',         // 'dark' | 'light' | 'system' (auto-detect)  ← v3 default
  hashNavigation: true,
  counter: true,
  counterFormat: '{current} / {total}',  // v3 — tokens: {current}, {total}, {percent}
  stagger: true,
  slideshow: {             // v3 — nested config (boolean still works)
    interval: 4000,
    pauseOnHover: true,
    kenburns: false,
    direction: 'forward'   // or 'reverse'
  },
  share: true,
  filter: false,
  batchSelect: false,
  // v2.1.0
  focusPoint: true,
  blurhash: true,
  exif: false,
  storyMode: false,
  pip: false,
  virtualScroll: false,
  dragReorder: false,
  backdropTint: false,
  morphTransition: false,
  colorPalette: false,
  aspectSkeleton: true,
  // v3.0.0
  video: true,             // detect MP4 / YouTube / Vimeo
  plugins: ['watermark', { name: 'analytics', trackingId: 'X' }],
  group: '',               // album group name (or use data-group)
  favorites: false,        // ❤️ button + localStorage
  favoritesKey: '',        // custom localStorage key suffix
  infoPanel: false,        // sidebar with metadata (I key)
  contextMenu: false,      // right-click menu on items
  shortcutsHelp: true,     // overlay on '?' key
  infiniteScroll: false,   // auto-load more
  loadMore: null,          // function(currentLength) → array | Promise<array>
  editor: false,           // crop/rotate/flip toolbar
  annotate: false          // freehand drawing layer
});
```

## 🔧 API

### Methods

```js
gallery.open(index);          // Open lightbox at image index
gallery.close();              // Close lightbox
gallery.next();               // Go to next image (group-aware)
gallery.prev();               // Go to previous image (group-aware)
gallery.startSlideshow();     // Start autoplay
gallery.stopSlideshow();      // Stop autoplay
gallery.pauseSlideshow();     // v3 — pause without emitting stop
gallery.toggleSlideshow();    // Toggle autoplay
gallery.filter('landscape');  // Filter by tag (null = show all)
gallery.getSelected();        // Get batch-selected items
gallery.clearSelection();     // Clear batch selection
gallery.getOrder();           // Get current item order (after drag reorder)

// v3.0.0 — Favorites
gallery.toggleFavorite();     // Toggle favorite for current image
gallery.isFavorite(index);    // Check if image is favorited
gallery.getFavorites();       // Get array of favorited image src URLs
gallery.clearFavorites();     // Remove all favorites

// v3.0.0 — Info panel / overlays
gallery.toggleInfoPanel(force);     // Toggle info sidebar (force = bool)
gallery.toggleShortcutsHelp(force); // Toggle keyboard shortcuts overlay

// v3.0.0 — Editor & annotation
gallery.openEditor();         // Open crop/rotate/flip editor
gallery.closeEditor();
gallery.getEditedBlob();      // Last exported edited image as Blob

gallery.openAnnotate();       // Open drawing layer
gallery.closeAnnotate();
gallery.getAnnotatedBlob();

// v3.0.0 — Print & dynamic content
gallery.print(index);         // Print current or specified image
gallery.append([{src,...}]);  // Append new items at runtime
gallery.remove(index);        // Remove item by index

// v3.0.0 — Plugin access
gallery.plugin('watermark');  // Get plugin instance by name

// v3.0.0 — Event helpers
gallery.on('change', fn);
gallery.off('change', fn);    // Remove specific listener
gallery.off('change');        // Remove all listeners for event
gallery.once('open', fn);     // Auto-removed after first fire

gallery.destroy();            // Remove gallery, clean up all listeners & DOM
```

### Static Utilities

```js
// Comparison slider
const slider = NeikiGallery.compare('#compare-container', {
  before: 'before.jpg',
  after: 'after.jpg',
  labelBefore: 'Before',
  labelAfter: 'After',
  startPosition: 50
});

slider.setPosition(30);  // Move handle to 30%
slider.destroy();        // Clean up

// Color palette extraction (v2.1.0)
NeikiGallery.extractPalette('photo.jpg', 5, (colors) => {
  console.log(colors); // [{r, g, b, hex}, ...]
});

// Dominant color (v2.1.0)
NeikiGallery.extractDominantColor('photo.jpg', (color) => {
  console.log(color); // {r, g, b, hex}
});

// EXIF parsing (v2.1.0)
NeikiGallery.parseExif('photo.jpg', (tags) => {
  console.log(tags); // {make, model, iso, fNumber, exposure, focalLength}
});

// Blurhash decoding (v2.1.0)
const pixels = NeikiGallery.decodeBlurhash('LEHV6nWB2y...', 32, 32);

// Media type detection (v3.0.0)
NeikiGallery.detectMediaType('https://youtube.com/watch?v=abc'); // 'youtube'
NeikiGallery.detectMediaType('clip.mp4');                        // 'video'
NeikiGallery.detectMediaType('photo.jpg');                       // 'image'

// Plugin registration (v3.0.0)
NeikiGallery.registerPlugin('watermark', (gallery, options) => ({
  init()   { /* set up DOM, listeners */ },
  open()   { /* on lightbox open */ },
  change(d){ /* on slide change, d = {index, item, prevIndex} */ },
  close()  { /* on lightbox close */ },
  destroy(){ /* cleanup */ }
}));

NeikiGallery.unregisterPlugin('watermark');
NeikiGallery.getRegisteredPlugins();   // ['watermark', ...]

// Version
console.log(NeikiGallery.version);     // '3.0.0'
```

### Plugin System

A plugin is a factory function that receives the gallery instance and an options
object, and returns an object with optional lifecycle methods:

```js
NeikiGallery.registerPlugin('analytics', (gallery, opts) => ({
  init() {
    console.log('[analytics] gallery initialized');
  },
  open(data) {
    track('lightbox_open', { index: data.index });
  },
  change(data) {
    track('slide_view', { src: data.item.src, index: data.index });
  },
  close() {
    track('lightbox_close');
  },
  destroy() {
    console.log('[analytics] cleanup');
  }
}));

new NeikiGallery('#g', { plugins: [{ name: 'analytics', sampleRate: 0.5 }] });
```

You can access plugin instances on a gallery via `gallery.plugin('analytics')`.

### Events

```js
gallery.on('open', (index) => {
  console.log('Opened image', index);
});

gallery.on('close', () => {
  console.log('Lightbox closed');
});

gallery.on('change', (index) => {
  console.log('Now showing image', index);
});

gallery.on('filter', (tag) => {
  console.log('Filtered by:', tag);
});

gallery.on('select', (indices) => {
  console.log('Selected:', indices);
});

gallery.on('slideshowStart', () => {
  console.log('Slideshow started');
});

gallery.on('reorder', (order) => {
  console.log('New order:', order);
});

gallery.on('pipEnter', () => console.log('PiP on'));
gallery.on('storyEnter', () => console.log('Story opened'));

// v3.0.0 events
gallery.on('favorite', ({ index, src }) => console.log('★ favorited', src));
gallery.on('unfavorite', ({ index, src }) => console.log('☆ removed'));
gallery.on('infoOpen', () => console.log('info panel opened'));
gallery.on('print', ({ index, src }) => console.log('printed', src));
gallery.on('editorExport', ({ blob, url }) => console.log('edited blob', url));
gallery.on('annotateExport', ({ blob, url }) => console.log('annotated', url));
gallery.on('append', (items) => console.log('appended', items.length));
gallery.on('remove', ({ index }) => console.log('removed item', index));
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `layout` | `string` | `'masonry'` | `'masonry'` · `'grid'` · `'mosaic'` · `'filmstrip'` |
| `loop` | `boolean` | `false` | Enable infinite loop navigation |
| `thumbnails` | `boolean` | `true` | Show thumbnail strip in lightbox |
| `zoom` | `boolean` | `true` | Enable zoom on image click |
| `contextualZoom` | `boolean` | `false` | Zoom to cursor point instead of center |
| `fullscreen` | `boolean` | `true` | Show fullscreen button |
| `transition` | `string` | `'fade'` | `'fade'` or `'slide'` |
| `theme` | `string` | `'system'` | `'dark'` · `'light'` · `'system'` (auto-detect) |
| `hashNavigation` | `boolean` | `true` | URL hash deep linking |
| `counter` | `boolean` | `true` | Show image counter |
| `counterFormat` | `string` | `'{current} / {total}'` | Counter format with `{current}`, `{total}`, `{percent}` tokens |
| `captions` | `boolean` | `true` | Show image captions |
| `preload` | `number` | `1` | Adjacent images to preload |
| `lazyLoad` | `boolean` | `true` | Lazy load grid thumbnails |
| `stagger` | `boolean` | `true` | Staggered entrance animation |
| `slideshow` | `boolean \| object` | `false` | `true` or `{ interval, pauseOnHover, kenburns, direction }` |
| `share` | `boolean` | `true` | Show share button in lightbox |
| `filter` | `boolean` | `false` | Enable tag filtering bar |
| `batchSelect` | `boolean` | `false` | Enable Shift+click multi-select |
| `focusPoint` | `boolean` | `true` | Respect `data-focus` for `object-position` |
| `blurhash` | `boolean` | `true` | Decode `data-blurhash` placeholders |
| `exif` | `boolean` | `false` | Show EXIF data overlay in lightbox |
| `storyMode` | `boolean` | `false` | Enable story mode button in toolbar |
| `pip` | `boolean` | `false` | Enable PiP button in toolbar |
| `virtualScroll` | `boolean` | `false` | Virtualize grid for 50+ items |
| `dragReorder` | `boolean` | `false` | Enable drag & drop reorder |
| `backdropTint` | `boolean` | `false` | Tint overlay with dominant color |
| `morphTransition` | `boolean` | `false` | FLIP morph from grid to lightbox |
| `colorPalette` | `boolean` | `false` | Show extracted color palette |
| `aspectSkeleton` | `boolean` | `true` | Use `data-width`/`data-height` for skeleton |
| `video` | `boolean` | `true` | Auto-detect MP4 / YouTube / Vimeo URLs |
| `plugins` | `array` | `null` | Plugins to instantiate; e.g. `['name', { name, ...opts }]` |
| `group` | `string` | `''` | Album group name (also via `data-group`) |
| `favorites` | `boolean` | `false` | Heart button + localStorage |
| `favoritesKey` | `string` | `''` | Custom suffix for localStorage key |
| `infoPanel` | `boolean` | `false` | Slide-out metadata sidebar |
| `contextMenu` | `boolean` | `false` | Right-click menu on items |
| `shortcutsHelp` | `boolean` | `true` | `?` key shortcuts overlay |
| `infiniteScroll` | `boolean` | `false` | Auto-load more on scroll (with `loadMore`) |
| `loadMore` | `function` | `null` | `(currentLength) => array \| Promise<array>` |
| `editor` | `boolean` | `false` | Crop/rotate/flip toolbar |
| `annotate` | `boolean` | `false` | Freehand drawing layer |

### Data Attributes

All options can also be set via `data-` attributes on the container:

```html
<div data-neiki-gallery
     data-layout="mosaic"
     data-theme="light"
     data-transition="slide"
     data-loop="true"
     data-stagger="true"
     data-slideshow="false"
     data-slideshow-interval="5000"
     data-slideshow-pause-on-hover="true"
     data-slideshow-kenburns="true"
     data-counter-format="{current} of {total}"
     data-share="true"
     data-filter="true"
     data-batch-select="false"
     data-contextual-zoom="true"
     data-story-mode="false"
     data-pip="false"
     data-exif="false"
     data-backdrop-tint="false"
     data-morph-transition="false"
     data-color-palette="false"
     data-drag-reorder="false"
     data-virtual-scroll="false"
     data-aspect-skeleton="true"
     data-group="vacation"
     data-favorites="true"
     data-info-panel="true"
     data-context-menu="true"
     data-shortcuts-help="true"
     data-editor="true"
     data-annotate="true"
     data-video="true">
  <a href="full.jpg" data-tags="landscape,nature" data-size="large" data-width="1200" data-height="800" data-poster="poster.jpg" data-type="image">
    <img src="thumb.jpg" alt="Photo" data-focus="0.5 0.3" data-blurhash="LEHV6nWB2y...">
  </a>
</div>
```

## 🎨 Theming

Neiki Gallery uses CSS custom properties for full theming control:

```css
:root {
  --neiki-columns: 4;
  --neiki-gap: 14px;
  --neiki-border-radius: 14px;
  --neiki-accent: #3b82f6;
  --neiki-overlay-bg: rgba(8, 8, 12, 0.85);
  --neiki-overlay-backdrop: blur(24px) saturate(1.2);
  --neiki-btn-bg: rgba(255, 255, 255, 0.1);
  --neiki-btn-color: #fff;
  --neiki-caption-color: #fff;
  --neiki-spinner-color: var(--neiki-accent);
  --neiki-thumb-size: 52px;
  --neiki-zoom-scale: 2;
  --neiki-stagger-delay: 0.04s;
  --neiki-hover-lift: -4px;
  --neiki-hover-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
  --neiki-transition-duration: 0.3s;
  /* ... and more */
}
```

Switch themes at runtime by setting `data-theme="light"` or `data-theme="dark"` on the gallery container.

## 🌐 Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 80+ |
| Firefox | 75+ |
| Safari | 14+ |
| Edge | 80+ |

> **v3.0.0** raised the minimum to take advantage of `aspect-ratio`, `backdrop-filter`,
> stable `IntersectionObserver`, and modern Canvas/Blob APIs. If you need older
> browser support, pin to v2.1.0.

## 🔁 Migration from v2.x to v3.0.0

**v3.0.0 contains breaking changes.** Most galleries will continue to work, but
review the following:

### Slideshow config is nested

```js
// v2.x
new NeikiGallery('#g', { slideshow: true, slideshowInterval: 5000 });

// v3.0.0 — preferred (fine-grained control)
new NeikiGallery('#g', {
  slideshow: { interval: 5000, pauseOnHover: true, kenburns: true }
});

// v3.0.0 — still works (uses defaults)
new NeikiGallery('#g', { slideshow: true });
```

### Default theme is `'system'`

If you relied on the old default `'dark'`, set it explicitly:

```js
new NeikiGallery('#g', { theme: 'dark' });
```

### Hash format changed

Old: `#neiki-1=3` → New: `#gallery-id-or-group-name/3`

If you have external links to the old format, update them or set
`hashNavigation: false` and implement custom routing.

### Counter format

Default output (`"3 / 12"`) is unchanged, but it's now formatted via
`counterFormat: '{current} / {total}'`. Override with custom tokens.

### Browser support

Minimum Chrome 80+ / Firefox 75+ / Safari 14+ / Edge 80+. If you need older
browser support, stay on v2.1.0.

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## 📬 Contact

- **Email:** [dev@neiki.eu](mailto:dev@neiki.eu)

---

<p align="center">
  Made with ❤️ for the web community
</p>