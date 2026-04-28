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
  <img src="https://img.shields.io/badge/Version-1.0.0-2563EB?style=for-the-badge&logo=semantic-release&logoColor=white&labelColor=000F15&logoWidth=20" alt="Version">
</p>

<p align="center">
  <b>Vanilla JavaScript Image Gallery & Lightbox</b><br>
  <i>Beautiful, responsive, zero dependencies.</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Layouts-Masonry%20%26%20Grid-3b82f6?style=flat&labelColor=383C43" />
  <img src="https://img.shields.io/badge/Themes-Light%20%26%20Dark-8b5cf6?style=flat&labelColor=383C43" />
  <img src="https://img.shields.io/badge/Setup-Zero%20Config-22c55e?style=flat&labelColor=383C43" />
  <img src="https://img.shields.io/badge/Size-Lightweight-f97316?style=flat&labelColor=383C43" />
</p>

---

## 📖 About

**Neiki Gallery** is a production-ready image gallery and lightbox library built with vanilla JavaScript and CSS. No frameworks, no dependencies — just drop two files into your project and you're ready to go.

## ✨ Features

- **Masonry & Grid layouts** — switchable via option or `data-` attribute
- **Lightbox** — smooth open/close animations with fade or slide transitions
- **Keyboard navigation** — arrow keys, Escape, Home/End, F for fullscreen
- **Touch / swipe support** — mobile-friendly left/right swipe to navigate
- **Lazy loading** — IntersectionObserver-powered with shimmer placeholders
- **Image captions** — via `data-caption` attribute
- **Thumbnail strip** — optional scrollable thumbnails in lightbox
- **Zoom** — click to toggle zoom in/out
- **Fullscreen mode** — native Fullscreen API
- **Image counter** — e.g. "3 / 12"
- **Loading spinner** — pure CSS spinner while images load
- **Deep linking** — URL hash support (`#neiki-1=3` opens image 3)
- **Multiple instances** — independent galleries on one page
- **Dark & light themes** — via CSS custom properties and `data-theme`
- **Accessibility** — ARIA attributes, focus management, `prefers-reduced-motion`
- **Preloading** — adjacent images preloaded for instant navigation
- **Infinite loop** — optional wrap-around navigation
- **Event system** — `open`, `close`, `change` events
- **Clean destroy** — full cleanup of DOM nodes and event listeners
- **Cross-browser** — Chrome, Firefox, Safari, Edge

## 🚀 Quick Start

### CDN (Recommended)

Add these two lines to your HTML — that's all you need:

```html
<link rel="stylesheet" href="http://cdn.neiki.eu/neiki-gallery/neiki-gallery.min.css">
<script src="http://cdn.neiki.eu/neiki-gallery/neiki-gallery.min.js"></script>
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

> **Unminified files** are also available if you need them for debugging:
> ```
> http://cdn.neiki.eu/neiki-gallery/neiki-gallery.js
> http://cdn.neiki.eu/neiki-gallery/neiki-gallery.css
> ```

> **Pin a specific version** to avoid unexpected changes:
> ```
> http://cdn.neiki.eu/neiki-gallery/1.0.0/neiki-gallery.min.js
> http://cdn.neiki.eu/neiki-gallery/1.0.0/neiki-gallery.min.css
> ```

### Self-Hosting (Local)

Download or clone the repository from GitHub:

```bash
git clone https://github.com/neikiri/neiki-gallery.git
```

Copy the files from the `dist/` folder into your project and link them directly:

```html
<link rel="stylesheet" href="path/to/neiki-gallery.min.css">
<script src="path/to/neiki-gallery.min.js"></script>
```

The `dist/` folder contains both minified and unminified versions:

| File | Description |
|------|-------------|
| `neiki-gallery.min.js` | Minified JS (production) |
| `neiki-gallery.min.css` | Minified CSS (production) |
| `neiki-gallery.js` | Full JS (development / debugging) |
| `neiki-gallery.css` | Full CSS (development / debugging) |

### Manual Initialization

```js
const gallery = new NeikiGallery('#my-gallery', {
  layout: 'masonry',   // 'masonry' | 'grid'
  loop: true,
  thumbnails: true,
  zoom: true,
  fullscreen: true,
  transition: 'fade',  // 'fade' | 'slide'
  theme: 'dark',       // 'dark' | 'light'
  hashNavigation: true,
});
```

## 🔧 API

### Methods

```js
gallery.open(index);   // Open lightbox at image index
gallery.close();       // Close lightbox
gallery.next();        // Go to next image
gallery.prev();        // Go to previous image
gallery.destroy();     // Remove gallery, clean up all listeners & DOM
```

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
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `layout` | `string` | `'masonry'` | Grid layout: `'masonry'` or `'grid'` |
| `loop` | `boolean` | `false` | Enable infinite loop navigation |
| `thumbnails` | `boolean` | `true` | Show thumbnail strip in lightbox |
| `zoom` | `boolean` | `true` | Enable zoom on image click |
| `fullscreen` | `boolean` | `true` | Show fullscreen button |
| `transition` | `string` | `'fade'` | Transition effect: `'fade'` or `'slide'` |
| `theme` | `string` | `'dark'` | Theme: `'dark'` or `'light'` |
| `hashNavigation` | `boolean` | `true` | Enable URL hash deep linking |
| `counter` | `boolean` | `true` | Show image counter |
| `captions` | `boolean` | `true` | Show image captions |
| `preload` | `number` | `1` | Number of adjacent images to preload |
| `lazyLoad` | `boolean` | `true` | Lazy load grid thumbnails |

### Data Attributes

All options can also be set via `data-` attributes on the container:

```html
<div data-neiki-gallery
     data-layout="grid"
     data-theme="light"
     data-transition="slide"
     data-loop="true"
     data-thumbnails="true"
     data-zoom="true"
     data-fullscreen="true"
     data-hash-navigation="true">
```

## 🎨 Theming

Neiki Gallery uses CSS custom properties for full theming control:

```css
:root {
  --neiki-columns: 4;
  --neiki-gap: 12px;
  --neiki-border-radius: 6px;
  --neiki-overlay-bg: rgba(0, 0, 0, 0.92);
  --neiki-btn-bg: rgba(255, 255, 255, 0.12);
  --neiki-btn-color: #fff;
  --neiki-caption-color: #fff;
  --neiki-spinner-color: #fff;
  --neiki-thumb-size: 56px;
  --neiki-zoom-scale: 2;
  --neiki-transition-duration: 0.3s;
  /* ... and more */
}
```

Switch themes at runtime by setting `data-theme="light"` or `data-theme="dark"` on the gallery container.

## 🌐 Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 60+ |
| Firefox | 55+ |
| Safari | 12+ |
| Edge | 79+ |

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## 📬 Contact

- **Email:** [dev@neiki.eu](mailto:dev@neiki.eu)
