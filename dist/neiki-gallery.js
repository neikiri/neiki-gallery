/*!
 * Neiki's Gallery v3.0.0
 * A vanilla JavaScript image gallery / lightbox library.
 * No dependencies. No frameworks.
 *
 * Usage:
 *   Auto-init: <div data-neiki-gallery>...</div>
 *   Manual:    new NeikiGallery('#my-gallery', { ... });
 *
 * License: MIT
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.NeikiGallery = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // ============================================
  // CSS INJECT MARKER
  // ============================================

  /* ========================================================================
     Helpers
     ======================================================================== */

  var uid = 0;

  function nextId() {
    return ++uid;
  }

  function mergeOptions(defaults, opts) {
    var result = {};
    for (var key in defaults) {
      if (defaults.hasOwnProperty(key)) result[key] = defaults[key];
    }
    if (opts) {
      for (var key in opts) {
        if (opts.hasOwnProperty(key)) result[key] = opts[key];
      }
    }
    return result;
  }

  function $(selector, ctx) {
    return (ctx || document).querySelector(selector);
  }

  function $$(selector, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(selector));
  }

  function createElement(tag, className, attrs, html) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (attrs) {
      for (var k in attrs) {
        if (attrs.hasOwnProperty(k)) el.setAttribute(k, attrs[k]);
      }
    }
    if (html) el.innerHTML = html;
    return el;
  }

  function showToast(message) {
    var existing = document.querySelector('.neiki-toast');
    if (existing) existing.remove();
    var toast = createElement('div', 'neiki-toast', {}, message);
    document.body.appendChild(toast);
    requestAnimationFrame(function () {
      toast.classList.add('neiki-toast--visible');
    });
    setTimeout(function () {
      toast.classList.remove('neiki-toast--visible');
      setTimeout(function () { if (toast.parentNode) toast.remove(); }, 300);
    }, 2000);
  }

  /* ========================================================================
     SVG Icons
     ======================================================================== */

  var ICONS = {
    close: '<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    prev: '<svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>',
    next: '<svg viewBox="0 0 24 24"><polyline points="9 6 15 12 9 18"/></svg>',
    fullscreen: '<svg viewBox="0 0 24 24"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>',
    exitFullscreen: '<svg viewBox="0 0 24 24"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>',
    share: '<svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>',
    play: '<svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
    pause: '<svg viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>',
    zoom: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>',
    link: '<svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
    download: '<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
    heart: '<svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
    info: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
    print: '<svg viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>',
    edit: '<svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>',
    draw: '<svg viewBox="0 0 24 24"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>',
    help: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
  };

  /* ========================================================================
     Default Options
     ======================================================================== */

  var DEFAULTS = {
    layout: 'masonry',       // 'masonry' | 'grid' | 'mosaic' | 'filmstrip'
    loop: false,
    thumbnails: true,
    zoom: true,
    contextualZoom: false,   // zoom to click point instead of center
    fullscreen: true,
    transition: 'fade',      // 'fade' | 'slide'
    theme: 'system',         // 'dark' | 'light' | 'system' (auto-detect prefers-color-scheme)
    hashNavigation: true,
    counter: true,
    counterFormat: '{current} / {total}', // tokens: {current}, {total}, {percent}
    captions: true,
    preload: 1,
    lazyLoad: true,
    stagger: true,           // staggered entrance animation
    slideshow: false,        // boolean OR { interval, pauseOnHover, kenburns, direction }
    share: true,             // show share button in lightbox
    filter: false,           // enable tag filtering (reads data-tags)
    batchSelect: false,      // enable Shift+click multi-select
    // v2.1.0 options
    focusPoint: true,        // respect data-focus for object-position
    blurhash: true,          // decode data-blurhash placeholders
    exif: false,             // show EXIF overlay in lightbox
    storyMode: false,        // vertical fullscreen story viewer
    pip: false,              // picture-in-picture lightbox
    virtualScroll: false,    // virtualize grid for large galleries
    dragReorder: false,      // drag-and-drop reorder grid items
    backdropTint: false,     // tint overlay with image dominant color
    morphTransition: false,  // FLIP morph from grid to lightbox
    colorPalette: false,     // extract dominant colors from images
    aspectSkeleton: true,    // use data-width/data-height for skeleton aspect-ratio
    // v3.0.0 options
    video: true,             // detect and render video / YouTube / Vimeo
    plugins: null,           // array: ['pluginName', { name, ...opts }]
    group: '',               // album group name (also data-group attr)
    favorites: false,        // ❤️ button + localStorage persistence
    favoritesKey: '',        // custom localStorage key suffix
    infoPanel: false,        // sidebar with image metadata
    contextMenu: false,      // right-click custom menu
    shortcutsHelp: true,     // show keyboard shortcuts overlay on '?'
    infiniteScroll: false,   // auto-load more when scrolling near bottom
    loadMore: null,          // function(currentLength) -> array | Promise<array>
    print: false,            // print button in toolbar
    editor: false,           // crop/rotate/flip toolbar in lightbox
    annotate: false          // freehand drawing layer in lightbox
  };

  /* ========================================================================
     NeikiGallery Constructor
     ======================================================================== */

  function NeikiGallery(selectorOrElement, options) {
    if (!(this instanceof NeikiGallery)) {
      return new NeikiGallery(selectorOrElement, options);
    }

    this._id = nextId();
    this._events = {};
    this._isOpen = false;
    this._currentIndex = 0;
    this._isZoomed = false;
    this._isFullscreen = false;
    this._destroyed = false;
    this._boundHandlers = {};
    this._slideshowTimer = null;
    this._slideshowRunning = false;
    this._shareVisible = false;
    this._selectedIndices = [];
    this._pipActive = false;
    this._storyOpen = false;
    this._dragState = null;
    this._virtualItems = null;
    this._colorCache = {};

    if (typeof selectorOrElement === 'string') {
      this._container = $(selectorOrElement);
    } else {
      this._container = selectorOrElement;
    }

    if (!this._container) {
      console.warn('NeikiGallery: Container not found for selector "' + selectorOrElement + '"');
      return;
    }

    var dataOpts = this._readDataAttributes();
    this._options = mergeOptions(DEFAULTS, mergeOptions(dataOpts, options));
    this._resolveSystemTheme();
    this._items = this._parseItems();

    if (this._items.length === 0) {
      console.warn('NeikiGallery: No items found in container.');
      return;
    }

    // v3 state
    this._infoPanelOpen = false;
    this._shortcutsOpen = false;
    this._favorites = [];

    this._registerGroup();
    this._loadFavorites();

    this._setupGrid();
    this._setupAspectSkeleton();
    this._setupFocusPoint();
    this._setupBlurhash();
    this._setupLazyLoad();
    this._setupStagger();
    this._setupFilter();
    this._setupVirtualScroll();
    this._setupDragReorder();
    this._setupInfiniteScroll();
    this._buildLightbox();
    this._buildInfoPanel();
    this._buildShortcutsHelp();
    this._buildEditor();
    this._buildAnnotation();
    this._buildContextMenu();
    this._bindEvents();
    this._bindContextMenu();
    this._setupSlideshowPauseOnHover();
    this._refreshAllFavoriteUI();
    this._initPlugins();
    this._checkHash();
  }

  NeikiGallery.prototype._resolveSystemTheme = function () {
    if (this._options.theme !== 'system') return;
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    this._options.theme = prefersDark ? 'dark' : 'light';
    // Listen for changes
    if (window.matchMedia) {
      var self = this;
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      this._systemThemeListener = function (e) {
        var t = e.matches ? 'dark' : 'light';
        self._options.theme = t;
        if (self._container) self._container.setAttribute('data-theme', t);
        if (self._lightbox) self._lightbox.setAttribute('data-theme', t);
      };
      if (mq.addEventListener) mq.addEventListener('change', this._systemThemeListener);
      else if (mq.addListener) mq.addListener(this._systemThemeListener);
      this._systemThemeMQ = mq;
    }
  };

  NeikiGallery.prototype._resolveSlideshowOpts = function () {
    var s = this._options.slideshow;
    if (!s) return null;
    if (typeof s === 'object') {
      return {
        enabled: true,
        interval: s.interval || 4000,
        pauseOnHover: !!s.pauseOnHover,
        kenburns: !!s.kenburns,
        direction: s.direction || 'forward'
      };
    }
    return {
      enabled: true,
      interval: 4000,
      pauseOnHover: false,
      kenburns: false,
      direction: 'forward'
    };
  };

  /* ========================================================================
     Data Attributes
     ======================================================================== */

  NeikiGallery.prototype._readDataAttributes = function () {
    var c = this._container;
    var opts = {};
    var boolAttr = function (name) {
      return c.hasAttribute(name) ? c.getAttribute(name) !== 'false' : undefined;
    };
    var strAttr = function (name) {
      return c.hasAttribute(name) ? c.getAttribute(name) : undefined;
    };
    var numAttr = function (name) {
      if (!c.hasAttribute(name)) return undefined;
      var v = parseInt(c.getAttribute(name), 10);
      return isNaN(v) ? undefined : v;
    };

    if (strAttr('data-layout') !== undefined) opts.layout = strAttr('data-layout');
    if (strAttr('data-theme') !== undefined) opts.theme = strAttr('data-theme');
    if (strAttr('data-transition') !== undefined) opts.transition = strAttr('data-transition');
    if (boolAttr('data-loop') !== undefined) opts.loop = boolAttr('data-loop');
    if (boolAttr('data-thumbnails') !== undefined) opts.thumbnails = boolAttr('data-thumbnails');
    if (boolAttr('data-zoom') !== undefined) opts.zoom = boolAttr('data-zoom');
    if (boolAttr('data-contextual-zoom') !== undefined) opts.contextualZoom = boolAttr('data-contextual-zoom');
    if (boolAttr('data-fullscreen') !== undefined) opts.fullscreen = boolAttr('data-fullscreen');
    if (boolAttr('data-hash-navigation') !== undefined) opts.hashNavigation = boolAttr('data-hash-navigation');
    if (boolAttr('data-stagger') !== undefined) opts.stagger = boolAttr('data-stagger');
    // Slideshow: data-slideshow="true" enables; data-slideshow-interval, data-slideshow-pause-on-hover, data-slideshow-kenburns build nested config
    var slideshowEnabled = boolAttr('data-slideshow');
    var ssInterval = numAttr('data-slideshow-interval');
    var ssPause = boolAttr('data-slideshow-pause-on-hover');
    var ssKenburns = boolAttr('data-slideshow-kenburns');
    if (slideshowEnabled !== undefined || ssInterval !== undefined || ssPause !== undefined || ssKenburns !== undefined) {
      if (slideshowEnabled === false) {
        opts.slideshow = false;
      } else {
        opts.slideshow = {
          interval: ssInterval !== undefined ? ssInterval : 4000,
          pauseOnHover: !!ssPause,
          kenburns: !!ssKenburns
        };
      }
    }
    if (strAttr('data-counter-format') !== undefined) opts.counterFormat = strAttr('data-counter-format');
    if (boolAttr('data-share') !== undefined) opts.share = boolAttr('data-share');
    if (boolAttr('data-filter') !== undefined) opts.filter = boolAttr('data-filter');
    if (boolAttr('data-batch-select') !== undefined) opts.batchSelect = boolAttr('data-batch-select');
    if (boolAttr('data-focus-point') !== undefined) opts.focusPoint = boolAttr('data-focus-point');
    if (boolAttr('data-blurhash') !== undefined) opts.blurhash = boolAttr('data-blurhash');
    if (boolAttr('data-exif') !== undefined) opts.exif = boolAttr('data-exif');
    if (boolAttr('data-story-mode') !== undefined) opts.storyMode = boolAttr('data-story-mode');
    if (boolAttr('data-pip') !== undefined) opts.pip = boolAttr('data-pip');
    if (boolAttr('data-virtual-scroll') !== undefined) opts.virtualScroll = boolAttr('data-virtual-scroll');
    if (boolAttr('data-drag-reorder') !== undefined) opts.dragReorder = boolAttr('data-drag-reorder');
    if (boolAttr('data-backdrop-tint') !== undefined) opts.backdropTint = boolAttr('data-backdrop-tint');
    if (boolAttr('data-morph-transition') !== undefined) opts.morphTransition = boolAttr('data-morph-transition');
    if (boolAttr('data-color-palette') !== undefined) opts.colorPalette = boolAttr('data-color-palette');
    if (boolAttr('data-aspect-skeleton') !== undefined) opts.aspectSkeleton = boolAttr('data-aspect-skeleton');
    // v3.0.0
    if (boolAttr('data-video') !== undefined) opts.video = boolAttr('data-video');
    if (strAttr('data-group') !== undefined) opts.group = strAttr('data-group');
    if (boolAttr('data-favorites') !== undefined) opts.favorites = boolAttr('data-favorites');
    if (boolAttr('data-info-panel') !== undefined) opts.infoPanel = boolAttr('data-info-panel');
    if (boolAttr('data-context-menu') !== undefined) opts.contextMenu = boolAttr('data-context-menu');
    if (boolAttr('data-shortcuts-help') !== undefined) opts.shortcutsHelp = boolAttr('data-shortcuts-help');
    if (boolAttr('data-infinite-scroll') !== undefined) opts.infiniteScroll = boolAttr('data-infinite-scroll');
    if (boolAttr('data-print') !== undefined) opts.print = boolAttr('data-print');
    if (boolAttr('data-editor') !== undefined) opts.editor = boolAttr('data-editor');
    if (boolAttr('data-annotate') !== undefined) opts.annotate = boolAttr('data-annotate');
    return opts;
  };

  /* ========================================================================
     Parse Items
     ======================================================================== */

  NeikiGallery.prototype._parseItems = function () {
    var anchors = $$(':scope > a', this._container);
    var items = [];
    for (var i = 0; i < anchors.length; i++) {
      var a = anchors[i];
      var img = $('img', a);
      var src = a.getAttribute('href') || (img ? img.getAttribute('src') : '');
      var explicitType = a.getAttribute('data-type');
      items.push({
        src: src,
        thumb: img ? (img.getAttribute('data-src') || img.getAttribute('src')) : '',
        caption: a.getAttribute('data-caption') || (img ? img.getAttribute('alt') : '') || '',
        tags: (a.getAttribute('data-tags') || '').split(',').map(function (t) { return t.trim(); }).filter(Boolean),
        size: a.getAttribute('data-size') || '',
        focus: a.getAttribute('data-focus') || (img ? img.getAttribute('data-focus') : '') || '',
        blurhash: a.getAttribute('data-blurhash') || (img ? img.getAttribute('data-blurhash') : '') || '',
        width: parseInt(a.getAttribute('data-width') || (img ? img.getAttribute('data-width') || img.getAttribute('width') : ''), 10) || 0,
        height: parseInt(a.getAttribute('data-height') || (img ? img.getAttribute('data-height') || img.getAttribute('height') : ''), 10) || 0,
        // v3.0.0
        poster: a.getAttribute('data-poster') || '',
        group: a.getAttribute('data-group') || '',
        mediaType: explicitType || (this._options.video ? detectMediaType(src) : 'image'),
        element: a,
        img: img
      });
      a.addEventListener('click', function (e) { e.preventDefault(); });
    }
    return items;
  };

  /* ========================================================================
     Grid Setup
     ======================================================================== */

  NeikiGallery.prototype._setupGrid = function () {
    var layout = this._options.layout;
    this._container.classList.add('neiki-gallery');
    this._container.classList.remove('neiki-gallery--masonry', 'neiki-gallery--grid', 'neiki-gallery--mosaic', 'neiki-gallery--filmstrip');

    switch (layout) {
      case 'grid':
        this._container.classList.add('neiki-gallery--grid');
        break;
      case 'mosaic':
        this._container.classList.add('neiki-gallery--mosaic');
        break;
      case 'filmstrip':
        this._container.classList.add('neiki-gallery--filmstrip');
        break;
      default:
        this._container.classList.add('neiki-gallery--masonry');
    }

    if (this._options.theme) {
      this._container.setAttribute('data-theme', this._options.theme);
    }
  };

  /* ========================================================================
     Lazy Load
     ======================================================================== */

  NeikiGallery.prototype._setupLazyLoad = function () {
    var self = this;
    if (!this._options.lazyLoad || !('IntersectionObserver' in window)) {
      this._items.forEach(function (item) {
        if (item.img) item.img.classList.add('neiki-loaded');
      });
      return;
    }

    this._observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          var lazySrc = img.getAttribute('data-src');
          if (lazySrc) {
            img.src = lazySrc;
            img.removeAttribute('data-src');
          }
          img.addEventListener('load', function () { img.classList.add('neiki-loaded'); });
          if (img.complete && img.naturalWidth) img.classList.add('neiki-loaded');
          self._observer.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });

    this._items.forEach(function (item) {
      if (item.img) {
        var img = item.img;
        if (img.complete && img.naturalWidth) {
          img.classList.add('neiki-loaded');
        } else {
          self._observer.observe(img);
          img.addEventListener('load', function () { img.classList.add('neiki-loaded'); });
          img.addEventListener('error', function () { img.classList.add('neiki-loaded'); });
          // Fallback: if image loaded between checks, ensure class is added
          setTimeout(function () {
            if (img.complete && !img.classList.contains('neiki-loaded')) {
              img.classList.add('neiki-loaded');
            }
          }, 200);
          // Long fallback: force visible after 3s regardless
          setTimeout(function () {
            if (!img.classList.contains('neiki-loaded')) {
              img.classList.add('neiki-loaded');
            }
          }, 3000);
        }
      }
    });
  };

  /* ========================================================================
     Staggered Entrance
     ======================================================================== */

  NeikiGallery.prototype._setupStagger = function () {
    if (!this._options.stagger) return;
    var items = $$(':scope > a, :scope > .neiki-item', this._container);
    var delay = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--neiki-stagger-delay')) || 0.04;
    for (var i = 0; i < items.length; i++) {
      items[i].style.animationDelay = (i * delay) + 's';
    }
    // Force reflow so the browser registers the delays before animation starts
    void this._container.offsetHeight;
    this._container.classList.add('neiki-gallery--stagger');
  };

  /* ========================================================================
     Filter
     ======================================================================== */

  NeikiGallery.prototype._setupFilter = function () {
    if (!this._options.filter) return;

    var allTags = {};
    this._items.forEach(function (item) {
      item.tags.forEach(function (t) { allTags[t] = true; });
    });

    var tags = Object.keys(allTags);
    if (tags.length === 0) return;

    this._filterBar = createElement('div', 'neiki-filter-bar');
    var allBtn = createElement('button', 'neiki-filter-btn neiki-filter--active', { type: 'button' }, 'All');
    this._filterBar.appendChild(allBtn);

    var self = this;
    this._activeFilter = null;

    allBtn.addEventListener('click', function () { self._applyFilter(null); });

    tags.forEach(function (tag) {
      var btn = createElement('button', 'neiki-filter-btn', { type: 'button' }, tag);
      btn.addEventListener('click', function () { self._applyFilter(tag); });
      self._filterBar.appendChild(btn);
    });

    this._container.parentNode.insertBefore(this._filterBar, this._container);
  };

  NeikiGallery.prototype._applyFilter = function (tag) {
    this._activeFilter = tag;

    // Update button active state
    var buttons = $$('.neiki-filter-btn', this._filterBar);
    buttons.forEach(function (btn) {
      var isAll = btn.textContent === 'All';
      btn.classList.toggle('neiki-filter--active', tag === null ? isAll : btn.textContent === tag);
    });

    // Show/hide items
    var self = this;
    this._items.forEach(function (item) {
      if (tag === null || item.tags.indexOf(tag) !== -1) {
        item.element.classList.remove('neiki-filter-hidden');
      } else {
        item.element.classList.add('neiki-filter-hidden');
      }
    });

    this._emit('filter', tag);
  };

  /* ========================================================================
     Aspect-Ratio Skeleton
     ======================================================================== */

  NeikiGallery.prototype._setupAspectSkeleton = function () {
    if (!this._options.aspectSkeleton) return;
    this._items.forEach(function (item) {
      if (item.width && item.height && item.element) {
        item.element.style.aspectRatio = item.width + ' / ' + item.height;
      }
    });
  };

  /* ========================================================================
     Focus Point
     ======================================================================== */

  NeikiGallery.prototype._setupFocusPoint = function () {
    if (!this._options.focusPoint) return;
    this._items.forEach(function (item) {
      if (item.focus && item.img) {
        var parts = item.focus.trim().split(/\s+/);
        if (parts.length === 2) {
          var x = (parseFloat(parts[0]) * 100).toFixed(1);
          var y = (parseFloat(parts[1]) * 100).toFixed(1);
          item.img.style.objectPosition = x + '% ' + y + '%';
        }
      }
    });
  };

  /* ========================================================================
     Blurhash Decoder
     ======================================================================== */

  var _bhDigits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#$%*+,-.:;=?@[]^_{|}~';

  function _bhDecode83(str) {
    var value = 0;
    for (var i = 0; i < str.length; i++) {
      var idx = _bhDigits.indexOf(str[i]);
      value = value * 83 + idx;
    }
    return value;
  }

  function _bhSRGBToLinear(value) {
    var v = value / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  }

  function _bhLinearToSRGB(value) {
    var v = Math.max(0, Math.min(1, value));
    return v <= 0.0031308 ? Math.round(v * 12.92 * 255 + 0.5) : Math.round((1.055 * Math.pow(v, 1 / 2.4) - 0.055) * 255 + 0.5);
  }

  function _bhSignPow(val, exp) {
    return (val < 0 ? -1 : 1) * Math.pow(Math.abs(val), exp);
  }

  function _bhDecodeDC(value) {
    return [_bhSRGBToLinear(value >> 16), _bhSRGBToLinear((value >> 8) & 255), _bhSRGBToLinear(value & 255)];
  }

  function _bhDecodeAC(value, maxVal) {
    var qR = Math.floor(value / (19 * 19));
    var qG = Math.floor(value / 19) % 19;
    var qB = value % 19;
    return [_bhSignPow((qR - 9) / 9, 2) * maxVal, _bhSignPow((qG - 9) / 9, 2) * maxVal, _bhSignPow((qB - 9) / 9, 2) * maxVal];
  }

  function decodeBlurhash(hash, width, height) {
    if (!hash || hash.length < 6) return null;
    var sizeFlag = _bhDecode83(hash[0]);
    var numY = Math.floor(sizeFlag / 9) + 1;
    var numX = (sizeFlag % 9) + 1;
    var qMaxVal = _bhDecode83(hash[1]);
    var maxVal = (qMaxVal + 1) / 166;
    var colors = new Array(numX * numY);
    colors[0] = _bhDecodeDC(_bhDecode83(hash.substring(2, 6)));
    for (var i = 1; i < numX * numY; i++) {
      colors[i] = _bhDecodeAC(_bhDecode83(hash.substring(4 + i * 2, 6 + i * 2)), maxVal);
    }
    var pixels = new Uint8ClampedArray(width * height * 4);
    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        var r = 0, g = 0, b = 0;
        for (var j = 0; j < numY; j++) {
          for (var k = 0; k < numX; k++) {
            var basis = Math.cos((Math.PI * x * k) / width) * Math.cos((Math.PI * y * j) / height);
            var color = colors[k + j * numX];
            r += color[0] * basis;
            g += color[1] * basis;
            b += color[2] * basis;
          }
        }
        var idx = 4 * (x + y * width);
        pixels[idx] = _bhLinearToSRGB(r);
        pixels[idx + 1] = _bhLinearToSRGB(g);
        pixels[idx + 2] = _bhLinearToSRGB(b);
        pixels[idx + 3] = 255;
      }
    }
    return pixels;
  }

  NeikiGallery.prototype._setupBlurhash = function () {
    if (!this._options.blurhash) return;
    this._items.forEach(function (item) {
      if (!item.blurhash || !item.element) return;
      var w = 32, h = 32;
      var pixels = decodeBlurhash(item.blurhash, w, h);
      if (!pixels) return;
      try {
        var canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        var ctx = canvas.getContext('2d');
        var imgData = ctx.createImageData(w, h);
        imgData.data.set(pixels);
        ctx.putImageData(imgData, 0, 0);
        item.element.style.backgroundImage = 'url(' + canvas.toDataURL() + ')';
        item.element.style.backgroundSize = 'cover';
        item.element.style.backgroundPosition = 'center';
      } catch (e) { /* canvas not supported */ }
    });
  };

  /* ========================================================================
     Virtual Scrolling
     ======================================================================== */

  NeikiGallery.prototype._setupVirtualScroll = function () {
    if (!this._options.virtualScroll || this._items.length < 50) return;
    var self = this;
    this._virtualObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var el = entry.target;
        if (entry.isIntersecting) {
          el.classList.remove('neiki-virtual-hidden');
          el.style.contentVisibility = 'visible';
        } else {
          el.classList.add('neiki-virtual-hidden');
          el.style.contentVisibility = 'hidden';
        }
      });
    }, { rootMargin: '400px' });

    this._items.forEach(function (item) {
      if (item.element) {
        item.element.style.containIntrinsicSize = 'auto 300px';
        self._virtualObserver.observe(item.element);
      }
    });
  };

  /* ========================================================================
     Drag & Drop Reorder
     ======================================================================== */

  NeikiGallery.prototype._setupDragReorder = function () {
    if (!this._options.dragReorder) return;
    var self = this;
    var items = this._items;
    var container = this._container;

    // Helper: find current index of an element in items array
    function indexOfEl(el) {
      for (var i = 0; i < items.length; i++) {
        if (items[i].element === el) return i;
      }
      return -1;
    }

    items.forEach(function (item) {
      var el = item.element;
      el.setAttribute('draggable', 'true');
      el.classList.add('neiki-draggable');

      el.addEventListener('dragstart', function (e) {
        var currentIdx = indexOfEl(el);
        self._dragState = { index: currentIdx, element: el };
        el.classList.add('neiki-dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', String(currentIdx));
      });

      el.addEventListener('dragover', function (e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        el.classList.add('neiki-drag-over');
      });

      el.addEventListener('dragleave', function () {
        el.classList.remove('neiki-drag-over');
      });

      el.addEventListener('drop', function (e) {
        e.preventDefault();
        e.stopPropagation();
        el.classList.remove('neiki-drag-over');
        if (!self._dragState) return;
        var fromEl = self._dragState.element;
        var fromIdx = indexOfEl(fromEl);
        var toIdx = indexOfEl(el);
        if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return;

        // Reorder DOM
        if (fromIdx < toIdx) {
          container.insertBefore(fromEl, el.nextSibling);
        } else {
          container.insertBefore(fromEl, el);
        }

        // Reorder items array
        var moved = items.splice(fromIdx, 1)[0];
        items.splice(toIdx > fromIdx ? toIdx - 1 : toIdx, 0, moved);

        self._emit('reorder', self.getOrder());
      });

      el.addEventListener('dragend', function () {
        el.classList.remove('neiki-dragging');
        self._dragState = null;
        $$('.neiki-drag-over', container).forEach(function (e) { e.classList.remove('neiki-drag-over'); });
      });

      // Prevent anchor navigation when dragging
      el.addEventListener('click', function (e) {
        if (self._dragState) e.preventDefault();
      });
    });
  };

  NeikiGallery.prototype.getOrder = function () {
    return this._items.map(function (item, i) {
      return { index: i, src: item.src, caption: item.caption };
    });
  };

  /* ========================================================================
     Color Palette Extraction
     ======================================================================== */

  function extractDominantColor(imgSrc, callback) {
    var img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function () {
      try {
        var canvas = document.createElement('canvas');
        var size = 10;
        canvas.width = size;
        canvas.height = size;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, size, size);
        var data = ctx.getImageData(0, 0, size, size).data;
        var r = 0, g = 0, b = 0, count = 0;
        for (var i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }
        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);
        callback({ r: r, g: g, b: b, hex: '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1) });
      } catch (e) {
        callback(null);
      }
    };
    img.onerror = function () { callback(null); };
    img.src = imgSrc;
  }

  function extractPalette(imgSrc, count, callback) {
    var img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function () {
      try {
        var canvas = document.createElement('canvas');
        var w = 50, h = 50;
        canvas.width = w;
        canvas.height = h;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        var data = ctx.getImageData(0, 0, w, h).data;
        var pixels = [];
        for (var i = 0; i < data.length; i += 4) {
          pixels.push([data[i], data[i + 1], data[i + 2]]);
        }
        // Simple k-means quantization
        var palette = _kMeansQuantize(pixels, count || 5);
        callback(palette);
      } catch (e) {
        callback([]);
      }
    };
    img.onerror = function () { callback([]); };
    img.src = imgSrc;
  }

  function _kMeansQuantize(pixels, k) {
    // Initialize centroids from evenly spaced pixels
    var centroids = [];
    var step = Math.floor(pixels.length / k);
    for (var i = 0; i < k; i++) {
      centroids.push(pixels[Math.min(i * step, pixels.length - 1)].slice());
    }

    for (var iter = 0; iter < 10; iter++) {
      var clusters = [];
      for (var c = 0; c < k; c++) clusters.push([]);

      for (var p = 0; p < pixels.length; p++) {
        var minDist = Infinity, closest = 0;
        for (var c = 0; c < k; c++) {
          var dr = pixels[p][0] - centroids[c][0];
          var dg = pixels[p][1] - centroids[c][1];
          var db = pixels[p][2] - centroids[c][2];
          var dist = dr * dr + dg * dg + db * db;
          if (dist < minDist) { minDist = dist; closest = c; }
        }
        clusters[closest].push(pixels[p]);
      }

      for (var c = 0; c < k; c++) {
        if (clusters[c].length === 0) continue;
        var sr = 0, sg = 0, sb = 0;
        for (var j = 0; j < clusters[c].length; j++) {
          sr += clusters[c][j][0];
          sg += clusters[c][j][1];
          sb += clusters[c][j][2];
        }
        centroids[c] = [Math.round(sr / clusters[c].length), Math.round(sg / clusters[c].length), Math.round(sb / clusters[c].length)];
      }
    }

    return centroids.map(function (c) {
      return {
        r: c[0], g: c[1], b: c[2],
        hex: '#' + ((1 << 24) + (c[0] << 16) + (c[1] << 8) + c[2]).toString(16).slice(1)
      };
    });
  }

  /* ========================================================================
     EXIF Parser (lightweight, JPEG only)
     ======================================================================== */

  function parseExif(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function () {
      if (xhr.status !== 200) { callback(null); return; }
      try {
        var data = new DataView(xhr.response);
        if (data.getUint16(0) !== 0xFFD8) { callback(null); return; } // Not JPEG
        var offset = 2;
        while (offset < data.byteLength) {
          if (data.getUint8(offset) !== 0xFF) { callback(null); return; }
          var marker = data.getUint8(offset + 1);
          if (marker === 0xE1) { // APP1
            var exif = _parseExifBlock(data, offset + 4);
            callback(exif);
            return;
          }
          var segLen = data.getUint16(offset + 2);
          offset += 2 + segLen;
        }
        callback(null);
      } catch (e) {
        callback(null);
      }
    };
    xhr.onerror = function () { callback(null); };
    xhr.send();
  }

  function _parseExifBlock(data, start) {
    // Check Exif header
    if (data.getUint32(start) !== 0x45786966 || data.getUint16(start + 4) !== 0x0000) return null;
    var tiffStart = start + 6;
    var bigEndian = data.getUint16(tiffStart) === 0x4D4D;
    var read16 = function (off) { return bigEndian ? data.getUint16(tiffStart + off) : data.getUint16(tiffStart + off, true); };
    var read32 = function (off) { return bigEndian ? data.getUint32(tiffStart + off) : data.getUint32(tiffStart + off, true); };

    var ifdOffset = read32(4);
    var numEntries = read16(ifdOffset);
    var tags = {};
    var TAG_MAP = { 0x010F: 'make', 0x0110: 'model', 0x8827: 'iso', 0x829A: 'exposure', 0x829D: 'fNumber', 0x920A: 'focalLength' };

    for (var i = 0; i < numEntries; i++) {
      var entryOff = ifdOffset + 2 + i * 12;
      var tag = read16(entryOff);
      var type = read16(entryOff + 2);
      var name = TAG_MAP[tag];
      if (!name) continue;

      if (type === 3) { // SHORT
        tags[name] = read16(entryOff + 8);
      } else if (type === 4) { // LONG
        tags[name] = read32(entryOff + 8);
      } else if (type === 5) { // RATIONAL
        var ratOff = read32(entryOff + 8);
        tags[name] = read32(ratOff) / read32(ratOff + 4);
      } else if (type === 2) { // ASCII
        var strLen = read32(entryOff + 4);
        var strOff = strLen > 4 ? read32(entryOff + 8) : entryOff + 8;
        var str = '';
        for (var s = 0; s < strLen - 1; s++) {
          str += String.fromCharCode(data.getUint8(tiffStart + strOff + s));
        }
        tags[name] = str.trim();
      }
    }

    // Look for SubIFD (Exif IFD pointer tag 0x8769)
    for (var i = 0; i < numEntries; i++) {
      var entryOff = ifdOffset + 2 + i * 12;
      if (read16(entryOff) === 0x8769) {
        var subIfdOff = read32(entryOff + 8);
        var subEntries = read16(subIfdOff);
        for (var j = 0; j < subEntries; j++) {
          var sEntryOff = subIfdOff + 2 + j * 12;
          var sTag = read16(sEntryOff);
          var sType = read16(sEntryOff + 2);
          var sName = TAG_MAP[sTag];
          if (!sName) continue;
          if (sType === 3) tags[sName] = read16(sEntryOff + 8);
          else if (sType === 4) tags[sName] = read32(sEntryOff + 8);
          else if (sType === 5) {
            var sRatOff = read32(sEntryOff + 8);
            tags[sName] = read32(sRatOff) / read32(sRatOff + 4);
          }
        }
        break;
      }
    }

    if (Object.keys(tags).length === 0) return null;
    return tags;
  }

  /* ========================================================================
     Lightbox — Build DOM
     ======================================================================== */

  NeikiGallery.prototype._buildLightbox = function () {
    var opts = this._options;

    // Overlay
    this._lightbox = createElement('div', 'neiki-lightbox neiki-lightbox--' + opts.transition, {
      role: 'dialog',
      'aria-modal': 'true',
      'aria-label': 'Image lightbox',
      tabindex: '-1'
    });

    if (opts.theme) {
      this._lightbox.setAttribute('data-theme', opts.theme);
    }

    // Top bar (counter)
    if (opts.counter) {
      this._topbar = createElement('div', 'neiki-lightbox__topbar');
      this._counter = createElement('span', 'neiki-lightbox__counter', { 'aria-live': 'polite' });
      this._topbar.appendChild(this._counter);
      this._lightbox.appendChild(this._topbar);
    }

    // Floating toolbar (replaces individual close/fullscreen buttons)
    this._toolbar = createElement('div', 'neiki-lightbox__toolbar');

    // PiP button
    if (opts.pip) {
      this._pipBtn = createElement('button', 'neiki-lightbox__btn neiki-lightbox__pip', {
        'aria-label': 'Picture in Picture',
        type: 'button'
      }, '<svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><rect x="13" y="12" width="7" height="6" rx="1" ry="1"/></svg>');
      this._toolbar.appendChild(this._pipBtn);
    }

    // Story mode button
    if (opts.storyMode) {
      this._storyBtn = createElement('button', 'neiki-lightbox__btn neiki-lightbox__story', {
        'aria-label': 'Story mode',
        type: 'button'
      }, '<svg viewBox="0 0 24 24"><rect x="6" y="3" width="12" height="18" rx="2"/><path d="M3 7v10a2 2 0 0 0 2 2"/><path d="M19 7v10a2 2 0 0 1-2 2"/></svg>');
      this._toolbar.appendChild(this._storyBtn);
    }

    // Slideshow button
    this._playBtn = createElement('button', 'neiki-lightbox__btn neiki-lightbox__play', {
      'aria-label': 'Toggle slideshow',
      type: 'button'
    }, ICONS.play);
    this._toolbar.appendChild(this._playBtn);

    // Favorite button (v3)
    if (opts.favorites) {
      this._favBtn = createElement('button', 'neiki-lightbox__btn neiki-lightbox__fav', {
        'aria-label': 'Toggle favorite',
        type: 'button'
      }, ICONS.heart);
      this._toolbar.appendChild(this._favBtn);
    }

    // Info panel button (v3)
    if (opts.infoPanel) {
      this._infoBtn = createElement('button', 'neiki-lightbox__btn neiki-lightbox__info-btn', {
        'aria-label': 'Image info',
        type: 'button'
      }, ICONS.info);
      this._toolbar.appendChild(this._infoBtn);
    }

    // Editor button (v3)
    if (opts.editor) {
      this._editBtn = createElement('button', 'neiki-lightbox__btn neiki-lightbox__edit', {
        'aria-label': 'Edit image',
        type: 'button'
      }, ICONS.edit);
      this._toolbar.appendChild(this._editBtn);
    }

    // Annotate button (v3)
    if (opts.annotate) {
      this._annotateBtn = createElement('button', 'neiki-lightbox__btn neiki-lightbox__annotate-btn', {
        'aria-label': 'Annotate image',
        type: 'button'
      }, ICONS.draw);
      this._toolbar.appendChild(this._annotateBtn);
    }

    // Shortcuts help button (v3)
    if (opts.shortcutsHelp) {
      this._helpBtn = createElement('button', 'neiki-lightbox__btn neiki-lightbox__help', {
        'aria-label': 'Keyboard shortcuts',
        type: 'button'
      }, ICONS.help);
      this._toolbar.appendChild(this._helpBtn);
    }

    // Print button (v3)
    if (opts.print) {
      this._printBtn = createElement('button', 'neiki-lightbox__btn neiki-lightbox__print', {
        'aria-label': 'Print image',
        type: 'button'
      }, ICONS.print);
      this._toolbar.appendChild(this._printBtn);
    }

    // Share button
    if (opts.share) {
      this._shareBtn = createElement('button', 'neiki-lightbox__btn neiki-lightbox__share', {
        'aria-label': 'Share image',
        type: 'button'
      }, ICONS.share);
      this._toolbar.appendChild(this._shareBtn);
    }

    // Fullscreen button
    if (opts.fullscreen) {
      this._fsBtn = createElement('button', 'neiki-lightbox__btn neiki-lightbox__fullscreen', {
        'aria-label': 'Toggle fullscreen',
        type: 'button'
      }, ICONS.fullscreen);
      this._toolbar.appendChild(this._fsBtn);
    }

    // Close button
    this._closeBtn = createElement('button', 'neiki-lightbox__btn neiki-lightbox__close', {
      'aria-label': 'Close lightbox',
      type: 'button'
    }, ICONS.close);
    this._toolbar.appendChild(this._closeBtn);

    this._lightbox.appendChild(this._toolbar);

    // Prev / Next
    this._prevBtn = createElement('button', 'neiki-lightbox__btn neiki-lightbox__prev', {
      'aria-label': 'Previous image',
      type: 'button'
    }, ICONS.prev);
    this._nextBtn = createElement('button', 'neiki-lightbox__btn neiki-lightbox__next', {
      'aria-label': 'Next image',
      type: 'button'
    }, ICONS.next);

    // Stage
    this._stage = createElement('div', 'neiki-lightbox__stage');
    this._slideWrapper = createElement('div', 'neiki-lightbox__slide-wrapper');
    this._spinner = createElement('div', 'neiki-lightbox__spinner neiki-hidden');
    this._image = createElement('img', 'neiki-lightbox__image', { alt: '', draggable: 'false' });

    this._slideWrapper.appendChild(this._spinner);
    this._slideWrapper.appendChild(this._image);
    this._stage.appendChild(this._prevBtn);
    this._stage.appendChild(this._slideWrapper);
    this._stage.appendChild(this._nextBtn);
    this._lightbox.appendChild(this._stage);

    // Slideshow progress bar
    this._progressBar = createElement('div', 'neiki-lightbox__progress');
    this._stage.appendChild(this._progressBar);

    // Caption
    if (opts.captions) {
      this._caption = createElement('div', 'neiki-lightbox__caption', { 'aria-live': 'polite' });
      this._lightbox.appendChild(this._caption);
    }

    // Thumbnail strip
    if (opts.thumbnails) {
      this._thumbsContainer = createElement('div', 'neiki-lightbox__thumbs', {
        role: 'listbox',
        'aria-label': 'Image thumbnails'
      });
      this._thumbButtons = [];
      for (var i = 0; i < this._items.length; i++) {
        var btn = createElement('button', 'neiki-lightbox__thumb', {
          type: 'button',
          role: 'option',
          'aria-label': 'View image ' + (i + 1)
        });
        var thumbImg = createElement('img', '', {
          src: this._items[i].thumb,
          alt: this._items[i].caption || 'Thumbnail ' + (i + 1),
          draggable: 'false'
        });
        btn.appendChild(thumbImg);
        this._thumbButtons.push(btn);
        this._thumbsContainer.appendChild(btn);
      }
      this._lightbox.appendChild(this._thumbsContainer);
    }

    // Share popup
    if (opts.share) {
      this._sharePopup = createElement('div', 'neiki-share');
      var shareCopyBtn = createElement('button', 'neiki-share__btn', { type: 'button' }, ICONS.link + ' Copy link');
      var shareDownloadBtn = createElement('button', 'neiki-share__btn', { type: 'button' }, ICONS.download + ' Download');
      this._sharePopup.appendChild(shareCopyBtn);
      this._sharePopup.appendChild(shareDownloadBtn);
      this._lightbox.appendChild(this._sharePopup);
      this._shareCopyBtn = shareCopyBtn;
      this._shareDownloadBtn = shareDownloadBtn;
    }

    // EXIF overlay
    if (opts.exif) {
      this._exifOverlay = createElement('div', 'neiki-exif');
      this._lightbox.appendChild(this._exifOverlay);
    }

    // Color palette strip
    if (opts.colorPalette) {
      this._paletteStrip = createElement('div', 'neiki-palette');
      this._lightbox.appendChild(this._paletteStrip);
    }

    document.body.appendChild(this._lightbox);
  };

  /* ========================================================================
     Bind Events
     ======================================================================== */

  NeikiGallery.prototype._bindEvents = function () {
    var self = this;

    // Grid item clicks
    this._items.forEach(function (item, index) {
      item.element.addEventListener('click', function (e) {
        e.preventDefault();
        if (self._options.batchSelect && e.shiftKey) {
          self._toggleSelect(index);
          return;
        }
        self.open(index);
      });
    });

    // Toolbar buttons
    this._closeBtn.addEventListener('click', function () { self.close(); });
    this._prevBtn.addEventListener('click', function (e) { e.stopPropagation(); self.prev(); });
    this._nextBtn.addEventListener('click', function (e) { e.stopPropagation(); self.next(); });

    // Slideshow
    this._playBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      self.toggleSlideshow();
    });

    // Fullscreen
    if (this._fsBtn) {
      this._fsBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        self._toggleFullscreen();
      });
    }

    // PiP
    if (this._pipBtn) {
      this._pipBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        self._togglePip();
      });
    }

    // Story mode
    if (this._storyBtn) {
      this._storyBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        self._toggleStoryMode();
      });
    }

    // Favorite (v3)
    if (this._favBtn) {
      this._favBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        self.toggleFavorite();
      });
    }

    // Info panel (v3)
    if (this._infoBtn) {
      this._infoBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        self.toggleInfoPanel();
      });
    }

    // Editor (v3)
    if (this._editBtn) {
      this._editBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        self.openEditor();
      });
    }

    // Annotate (v3)
    if (this._annotateBtn) {
      this._annotateBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        self.openAnnotate();
      });
    }

    // Shortcuts help (v3)
    if (this._helpBtn) {
      this._helpBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        self.toggleShortcutsHelp();
      });
    }

    // Print (v3)
    if (this._printBtn) {
      this._printBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        self.print();
      });
    }

    // Share
    if (this._shareBtn) {
      this._shareBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        self._toggleSharePopup();
      });
    }

    if (this._shareCopyBtn) {
      this._shareCopyBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        self._shareCopyLink();
      });
    }

    if (this._shareDownloadBtn) {
      this._shareDownloadBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        self._shareDownload();
      });
    }

    // Zoom on image click
    if (this._options.zoom) {
      this._image.addEventListener('click', function (e) {
        e.stopPropagation();
        if (self._options.contextualZoom) {
          self._toggleContextualZoom(e);
        } else {
          self._toggleZoom();
        }
      });
    }

    // Thumbnail clicks
    if (this._thumbButtons) {
      this._thumbButtons.forEach(function (btn, idx) {
        btn.addEventListener('click', function () { self._goTo(idx); });
      });
    }

    // Click on stage background to close
    this._stage.addEventListener('click', function (e) {
      if (e.target === self._stage || e.target === self._slideWrapper) {
        self.close();
      }
    });

    // Keyboard
    this._boundHandlers.keydown = function (e) { self._onKeyDown(e); };
    document.addEventListener('keydown', this._boundHandlers.keydown);

    // Touch / Swipe
    this._setupTouch();

    // Hash change
    if (this._options.hashNavigation) {
      this._boundHandlers.hashchange = function () { self._onHashChange(); };
      window.addEventListener('hashchange', this._boundHandlers.hashchange);
    }

    // Fullscreen change
    this._boundHandlers.fullscreenchange = function () { self._onFullscreenChange(); };
    document.addEventListener('fullscreenchange', this._boundHandlers.fullscreenchange);
    document.addEventListener('webkitfullscreenchange', this._boundHandlers.fullscreenchange);
  };

  NeikiGallery.prototype._onKeyDown = function (e) {
    if (!this._isOpen) return;

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        if (this._shortcutsOpen) { this.toggleShortcutsHelp(false); return; }
        if (this._editorOverlay && this._editorOverlay.classList.contains('neiki-editor--visible')) { this.closeEditor(); return; }
        if (this._annotateOverlay && this._annotateOverlay.classList.contains('neiki-annotate--visible')) { this.closeAnnotate(); return; }
        if (this._infoPanelOpen) { this.toggleInfoPanel(false); return; }
        if (this._shareVisible) { this._toggleSharePopup(); return; }
        this.close();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        this.prev();
        break;
      case 'ArrowRight':
        e.preventDefault();
        this.next();
        break;
      case 'Home':
        e.preventDefault();
        this._goTo(0);
        break;
      case 'End':
        e.preventDefault();
        this._goTo(this._items.length - 1);
        break;
      case 'f':
      case 'F':
        e.preventDefault();
        this._toggleFullscreen();
        break;
      case ' ':
        e.preventDefault();
        this.toggleSlideshow();
        break;
      case 'z':
      case 'Z':
        e.preventDefault();
        this._toggleZoom();
        break;
      case 'i':
      case 'I':
        if (this._options.infoPanel) { e.preventDefault(); this.toggleInfoPanel(); }
        break;
      case 'b':
      case 'B':
        if (this._options.favorites) { e.preventDefault(); this.toggleFavorite(); }
        break;
      case 'p':
      case 'P':
        e.preventDefault();
        this.print();
        break;
      case '?':
        if (this._options.shortcutsHelp) { e.preventDefault(); this.toggleShortcutsHelp(); }
        break;
    }
  };

  NeikiGallery.prototype._setupTouch = function () {
    var self = this;
    var startX = 0, startY = 0, distX = 0, tracking = false, threshold = 50;

    function onStart(e) {
      if (!self._isOpen || self._isZoomed) return;
      var point = e.touches ? e.touches[0] : e;
      startX = point.clientX;
      startY = point.clientY;
      distX = 0;
      tracking = true;
    }

    function onMove(e) {
      if (!tracking) return;
      var point = e.touches ? e.touches[0] : e;
      distX = point.clientX - startX;
      var distY = point.clientY - startY;
      if (Math.abs(distX) > Math.abs(distY) && Math.abs(distX) > 10) {
        e.preventDefault();
      }
    }

    function onEnd() {
      if (!tracking) return;
      tracking = false;
      if (distX > threshold) self.prev();
      else if (distX < -threshold) self.next();
    }

    this._stage.addEventListener('touchstart', onStart, { passive: true });
    this._stage.addEventListener('touchmove', onMove, { passive: false });
    this._stage.addEventListener('touchend', onEnd, { passive: true });

    this._boundHandlers.touchstart = onStart;
    this._boundHandlers.touchmove = onMove;
    this._boundHandlers.touchend = onEnd;
  };

  /* ========================================================================
     Navigation
     ======================================================================== */

  NeikiGallery.prototype._goTo = function (index, skipHash) {
    if (this._destroyed) return;

    var len = this._items.length;

    if (this._options.loop) {
      index = ((index % len) + len) % len;
    } else {
      if (index < 0) index = 0;
      if (index >= len) index = len - 1;
    }

    if (index === this._currentIndex && this._isOpen && this._image.src) return;

    var prevIndex = this._currentIndex;
    this._currentIndex = index;
    var item = this._items[index];

    // Stop any playing media from the previous slide (v3)
    this._stopAllMedia && this._stopAllMedia();

    // Remove kenburns class from previous (v3)
    this._removeKenburns && this._removeKenburns();

    // Reset zoom
    this._resetZoom();

    // Close share popup
    if (this._shareVisible) this._toggleSharePopup();

    // Update nav
    this._updateNavButtons();

    // Clear any previous embed/video element
    this._clearMediaSlide();

    // Render non-image media (v3) — short-circuits image flow
    if (item.mediaType && item.mediaType !== 'image') {
      this._spinner.classList.add('neiki-hidden');
      this._image.style.display = 'none';
      this._renderMediaSlide(item, this._slideWrapper);
      this._postGoToCommon(item, index, prevIndex);
      return;
    }
    this._image.style.display = '';

    // Spinner
    this._spinner.classList.remove('neiki-hidden');

    var self = this;
    var img = this._image;
    this._currentImg = img;

    // Slide transition
    if (this._options.transition === 'slide') {
      var direction = index > prevIndex ? 1 : -1;
      if (this._options.loop) {
        if (prevIndex === len - 1 && index === 0) direction = 1;
        if (prevIndex === 0 && index === len - 1) direction = -1;
      }
      this._slideWrapper.style.transform = 'translateX(' + (-direction * 40) + 'px)';
      img.style.opacity = '0';
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          self._slideWrapper.style.transform = 'translateX(0)';
          img.style.opacity = '1';
        });
      });
    } else {
      img.classList.add('neiki-entering');
      img.classList.remove('neiki-active');
    }

    img.setAttribute('alt', item.caption || '');

    var tempImg = new Image();
    var onLoad = function () {
      img.src = item.src;
      self._spinner.classList.add('neiki-hidden');
      if (self._options.transition === 'fade') {
        requestAnimationFrame(function () {
          img.classList.remove('neiki-entering');
          img.classList.add('neiki-active');
        });
      }
    };
    tempImg.onload = onLoad;
    tempImg.onerror = function () {
      img.src = item.src;
      self._spinner.classList.add('neiki-hidden');
      if (self._options.transition === 'fade') {
        requestAnimationFrame(function () {
          img.classList.remove('neiki-entering');
          img.classList.add('neiki-active');
        });
      }
    };
    tempImg.src = item.src;
    if (tempImg.complete) onLoad();

    this._postGoToCommon(item, index, prevIndex, skipHash);
  };

  NeikiGallery.prototype._postGoToCommon = function (item, index, prevIndex, skipHash) {
    var len = this._items.length;

    // Counter (with v3 counterFormat tokens)
    if (this._counter) {
      this._counter.textContent = this._formatCounter(index, len);
    }

    // Caption
    if (this._caption) {
      this._caption.textContent = item.caption || '';
    }

    // Active thumbnail
    if (this._thumbButtons) {
      this._thumbButtons.forEach(function (btn, idx) {
        btn.classList.toggle('neiki-thumb--active', idx === index);
        btn.setAttribute('aria-selected', idx === index ? 'true' : 'false');
      });
      var activeThumb = this._thumbButtons[index];
      if (activeThumb && this._thumbsContainer) {
        activeThumb.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
      }
    }

    // Hash
    if (this._options.hashNavigation && !skipHash) this._setHash(index);

    // Preload adjacent
    this._preloadAdjacent(index);

    // Backdrop tint
    this._applyBackdropTint && this._applyBackdropTint(item.src);

    // EXIF
    this._loadExif && this._loadExif(item.src);

    // Color palette
    this._loadPalette && this._loadPalette(item.src);

    // v3: Update info panel + favorite UI + kenburns
    if (this._infoPanelOpen) this._populateInfoPanel(index);
    this._updateFavoriteUI && this._updateFavoriteUI(index);
    this._applyKenburns && this._applyKenburns();

    // Plugin hook
    this._callPluginHook && this._callPluginHook('change', { index: index, item: item, prevIndex: prevIndex });

    // Restart slideshow timer if running
    if (this._slideshowRunning) this._startSlideshowTimer();

    this._emit('change', index);
  };

  NeikiGallery.prototype._formatCounter = function (index, total) {
    var fmt = this._options.counterFormat || '{current} / {total}';
    var current = index + 1;
    // If part of a group, use group totals
    if (this._groupName) {
      var groupItems = this._getGroupItems();
      if (groupItems && groupItems.length) {
        total = groupItems.length;
        current = this._getGroupCurrentIndex() + 1;
      }
    }
    var percent = Math.round((current / total) * 100);
    return fmt.replace(/\{current\}/g, current).replace(/\{total\}/g, total).replace(/\{percent\}/g, percent);
  };

  NeikiGallery.prototype._clearMediaSlide = function () {
    if (!this._slideWrapper) return;
    var media = this._slideWrapper.querySelectorAll('.neiki-lightbox__video, .neiki-lightbox__embed');
    for (var i = 0; i < media.length; i++) {
      if (media[i].parentNode) media[i].parentNode.removeChild(media[i]);
    }
  };

  NeikiGallery.prototype._updateNavButtons = function () {
    if (this._options.loop) {
      this._prevBtn.style.display = '';
      this._nextBtn.style.display = '';
      return;
    }
    this._prevBtn.style.display = this._currentIndex <= 0 ? 'none' : '';
    this._nextBtn.style.display = this._currentIndex >= this._items.length - 1 ? 'none' : '';
  };

  NeikiGallery.prototype._preloadAdjacent = function (index) {
    var count = this._options.preload || 1;
    var len = this._items.length;
    for (var i = 1; i <= count; i++) {
      var nextIdx = (index + i) % len;
      var prevIdx = ((index - i) % len + len) % len;
      if (this._items[nextIdx]) new Image().src = this._items[nextIdx].src;
      if (this._items[prevIdx]) new Image().src = this._items[prevIdx].src;
    }
  };

  /* ========================================================================
     Zoom
     ======================================================================== */

  NeikiGallery.prototype._toggleZoom = function () {
    if (!this._options.zoom) return;
    this._isZoomed = !this._isZoomed;
    this._image.classList.remove('neiki-zoom-pan');
    this._image.classList.toggle('neiki-zoomed', this._isZoomed);
  };

  NeikiGallery.prototype._toggleContextualZoom = function (e) {
    if (!this._options.zoom) return;

    if (this._isZoomed) {
      this._resetZoom();
      return;
    }

    this._isZoomed = true;
    var rect = this._image.getBoundingClientRect();
    var x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
    var y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
    this._image.style.setProperty('--neiki-zoom-x', x + '%');
    this._image.style.setProperty('--neiki-zoom-y', y + '%');
    this._image.classList.add('neiki-zoom-pan');
  };

  NeikiGallery.prototype._resetZoom = function () {
    if (!this._isZoomed) return;
    this._isZoomed = false;
    this._image.classList.remove('neiki-zoomed', 'neiki-zoom-pan');
    this._image.style.removeProperty('--neiki-zoom-x');
    this._image.style.removeProperty('--neiki-zoom-y');
  };

  /* ========================================================================
     Fullscreen
     ======================================================================== */

  NeikiGallery.prototype._toggleFullscreen = function () {
    if (!this._options.fullscreen) return;
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      var el = this._lightbox;
      if (el.requestFullscreen) el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    }
  };

  NeikiGallery.prototype._onFullscreenChange = function () {
    this._isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement);
    if (this._fsBtn) {
      this._fsBtn.innerHTML = this._isFullscreen ? ICONS.exitFullscreen : ICONS.fullscreen;
    }
  };

  /* ========================================================================
     Slideshow / Autoplay
     ======================================================================== */

  NeikiGallery.prototype.toggleSlideshow = function () {
    if (this._slideshowRunning) {
      this.stopSlideshow();
    } else {
      this.startSlideshow();
    }
  };

  NeikiGallery.prototype.startSlideshow = function () {
    if (this._slideshowRunning) return;
    this._slideshowRunning = true;
    this._playBtn.innerHTML = ICONS.pause;
    this._playBtn.setAttribute('aria-label', 'Pause slideshow');
    this._startSlideshowTimer();
    this._emit('slideshowStart');
  };

  NeikiGallery.prototype.stopSlideshow = function () {
    if (!this._slideshowRunning) return;
    this._slideshowRunning = false;
    this._playBtn.innerHTML = ICONS.play;
    this._playBtn.setAttribute('aria-label', 'Start slideshow');
    this._clearSlideshowTimer();
    this._progressBar.classList.remove('neiki-progress--running');
    this._progressBar.style.width = '0%';
    this._emit('slideshowStop');
  };

  NeikiGallery.prototype.pauseSlideshow = function () {
    // Alias for stopSlideshow but doesn't emit 'slideshowStop' for hover pauses
    this._clearSlideshowTimer();
    if (this._progressBar) {
      this._progressBar.classList.remove('neiki-progress--running');
      this._progressBar.style.width = '0%';
    }
    this._slideshowRunning = false;
    if (this._playBtn) this._playBtn.innerHTML = ICONS.play;
  };

  NeikiGallery.prototype._startSlideshowTimer = function () {
    var self = this;
    this._clearSlideshowTimer();

    var ssOpts = this._resolveSlideshowOpts() || { interval: 4000, direction: 'forward' };
    var interval = ssOpts.interval;

    // Reset progress bar
    this._progressBar.classList.remove('neiki-progress--running');
    this._progressBar.style.width = '0%';

    // Force reflow then animate
    void this._progressBar.offsetWidth;
    this._progressBar.style.transitionDuration = interval + 'ms';
    this._progressBar.classList.add('neiki-progress--running');
    this._progressBar.style.width = '100%';

    this._slideshowTimer = setTimeout(function () {
      if (!self._slideshowRunning || !self._isOpen) return;
      var step = ssOpts.direction === 'reverse' ? -1 : 1;
      var nextIndex = self._currentIndex + step;
      if (nextIndex >= self._items.length) {
        if (self._options.loop) nextIndex = 0;
        else { self.stopSlideshow(); return; }
      } else if (nextIndex < 0) {
        if (self._options.loop) nextIndex = self._items.length - 1;
        else { self.stopSlideshow(); return; }
      }
      self._goTo(nextIndex);
    }, interval);
  };

  NeikiGallery.prototype._clearSlideshowTimer = function () {
    if (this._slideshowTimer) {
      clearTimeout(this._slideshowTimer);
      this._slideshowTimer = null;
    }
  };

  /* ========================================================================
     Share
     ======================================================================== */

  NeikiGallery.prototype._toggleSharePopup = function () {
    this._shareVisible = !this._shareVisible;
    if (this._sharePopup) {
      this._sharePopup.classList.toggle('neiki-share--visible', this._shareVisible);
    }
  };

  NeikiGallery.prototype._shareCopyLink = function () {
    var item = this._items[this._currentIndex];
    if (!item) return;
    var self = this;
    var url = item.src;

    // Try Web Share API first
    if (navigator.share) {
      navigator.share({
        title: item.caption || 'Image',
        url: url
      }).then(function () {
        showToast('Shared!');
      }).catch(function () {
        // User cancelled or not supported — fallback to copy
        self._copyToClipboard(url);
      });
      this._toggleSharePopup();
      return;
    }

    this._copyToClipboard(url);
    this._toggleSharePopup();
  };

  NeikiGallery.prototype._copyToClipboard = function (text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        showToast('Link copied!');
      });
    } else {
      var input = document.createElement('input');
      input.value = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      showToast('Link copied!');
    }
  };

  NeikiGallery.prototype._shareDownload = function () {
    var item = this._items[this._currentIndex];
    if (!item) return;

    var a = document.createElement('a');
    a.href = item.src;
    a.download = item.caption || 'image';
    a.target = '_blank';
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    this._toggleSharePopup();
  };

  /* ========================================================================
     Batch Select
     ======================================================================== */

  NeikiGallery.prototype._toggleSelect = function (index) {
    var pos = this._selectedIndices.indexOf(index);
    if (pos === -1) {
      this._selectedIndices.push(index);
      this._items[index].element.classList.add('neiki-selected');
    } else {
      this._selectedIndices.splice(pos, 1);
      this._items[index].element.classList.remove('neiki-selected');
    }
    this._emit('select', this._selectedIndices.slice());
  };

  NeikiGallery.prototype.getSelected = function () {
    var self = this;
    return this._selectedIndices.map(function (i) {
      return { index: i, src: self._items[i].src, caption: self._items[i].caption };
    });
  };

  NeikiGallery.prototype.clearSelection = function () {
    var self = this;
    this._selectedIndices.forEach(function (i) {
      self._items[i].element.classList.remove('neiki-selected');
    });
    this._selectedIndices = [];
    this._emit('select', []);
  };

  /* ========================================================================
     Picture-in-Picture (PiP) Lightbox
     ======================================================================== */

  NeikiGallery.prototype._togglePip = function () {
    this._pipActive = !this._pipActive;
    this._lightbox.classList.toggle('neiki-lightbox--pip', this._pipActive);
    if (this._pipActive) {
      document.body.style.overflow = '';
      this._emit('pipEnter');
    } else {
      document.body.style.overflow = 'hidden';
      this._emit('pipExit');
    }
  };

  /* ========================================================================
     Story Mode
     ======================================================================== */

  NeikiGallery.prototype._toggleStoryMode = function () {
    this._storyOpen = !this._storyOpen;
    if (this._storyOpen) {
      this._enterStoryMode();
    } else {
      this._exitStoryMode();
    }
  };

  NeikiGallery.prototype._enterStoryMode = function () {
    var self = this;

    // Build story container
    this._storyContainer = createElement('div', 'neiki-story');
    this._items.forEach(function (item, idx) {
      var slide = createElement('div', 'neiki-story__slide');
      var img = createElement('img', 'neiki-story__image', {
        src: item.src,
        alt: item.caption || '',
        draggable: 'false'
      });
      slide.appendChild(img);
      if (item.caption) {
        var cap = createElement('div', 'neiki-story__caption', {}, item.caption);
        slide.appendChild(cap);
      }
      // Progress dots
      slide.setAttribute('data-story-index', idx);
      self._storyContainer.appendChild(slide);
    });

    // Close button
    var closeBtn = createElement('button', 'neiki-story__close', { type: 'button', 'aria-label': 'Close story' }, ICONS.close);
    this._storyContainer.appendChild(closeBtn);

    // Progress bar
    var progressWrap = createElement('div', 'neiki-story__progress-wrap');
    this._storyProgressBars = [];
    for (var i = 0; i < this._items.length; i++) {
      var bar = createElement('div', 'neiki-story__progress-bar');
      var fill = createElement('div', 'neiki-story__progress-fill');
      bar.appendChild(fill);
      progressWrap.appendChild(bar);
      this._storyProgressBars.push(fill);
    }
    this._storyContainer.appendChild(progressWrap);

    document.body.appendChild(this._storyContainer);
    document.body.style.overflow = 'hidden';

    closeBtn.addEventListener('click', function () { self._exitStoryMode(); });

    // Scroll handling — snap to slides
    this._storyCurrentIndex = this._currentIndex || 0;
    this._updateStoryProgress(this._storyCurrentIndex);

    // Navigate via click/touch on left/right half
    this._storyContainer.addEventListener('click', function (e) {
      if (e.target === closeBtn || closeBtn.contains(e.target)) return;
      var rect = self._storyContainer.getBoundingClientRect();
      var x = e.clientX - rect.left;
      if (x < rect.width / 3) {
        self._storyPrev();
      } else if (x > rect.width * 2 / 3) {
        self._storyNext();
      }
    });

    // Show first slide
    var slides = $$('.neiki-story__slide', this._storyContainer);
    if (slides[this._storyCurrentIndex]) {
      slides[this._storyCurrentIndex].classList.add('neiki-story__slide--active');
    }

    this._emit('storyEnter');
  };

  NeikiGallery.prototype._storyNext = function () {
    var slides = $$('.neiki-story__slide', this._storyContainer);
    if (this._storyCurrentIndex >= slides.length - 1) {
      this._exitStoryMode();
      return;
    }
    slides[this._storyCurrentIndex].classList.remove('neiki-story__slide--active');
    this._storyCurrentIndex++;
    slides[this._storyCurrentIndex].classList.add('neiki-story__slide--active');
    this._updateStoryProgress(this._storyCurrentIndex);
  };

  NeikiGallery.prototype._storyPrev = function () {
    var slides = $$('.neiki-story__slide', this._storyContainer);
    if (this._storyCurrentIndex <= 0) return;
    slides[this._storyCurrentIndex].classList.remove('neiki-story__slide--active');
    this._storyCurrentIndex--;
    slides[this._storyCurrentIndex].classList.add('neiki-story__slide--active');
    this._updateStoryProgress(this._storyCurrentIndex);
  };

  NeikiGallery.prototype._updateStoryProgress = function (index) {
    if (!this._storyProgressBars) return;
    for (var i = 0; i < this._storyProgressBars.length; i++) {
      if (i < index) {
        this._storyProgressBars[i].style.width = '100%';
      } else if (i === index) {
        this._storyProgressBars[i].style.width = '100%';
        this._storyProgressBars[i].style.transition = 'width 5s linear';
      } else {
        this._storyProgressBars[i].style.width = '0%';
        this._storyProgressBars[i].style.transition = 'none';
      }
    }
    // Auto-advance
    var self = this;
    clearTimeout(this._storyTimer);
    this._storyTimer = setTimeout(function () {
      if (self._storyOpen) self._storyNext();
    }, 5000);
  };

  NeikiGallery.prototype._exitStoryMode = function () {
    this._storyOpen = false;
    clearTimeout(this._storyTimer);
    if (this._storyContainer && this._storyContainer.parentNode) {
      this._storyContainer.parentNode.removeChild(this._storyContainer);
    }
    this._storyContainer = null;
    this._storyProgressBars = null;
    document.body.style.overflow = this._isOpen ? 'hidden' : '';
    this._emit('storyExit');
  };

  /* ========================================================================
     Backdrop Tint
     ======================================================================== */

  NeikiGallery.prototype._applyBackdropTint = function (src) {
    if (!this._options.backdropTint) return;
    var self = this;
    if (this._colorCache[src]) {
      self._setTintColor(this._colorCache[src]);
      return;
    }
    extractDominantColor(src, function (color) {
      if (color) {
        self._colorCache[src] = color;
        self._setTintColor(color);
      }
    });
  };

  NeikiGallery.prototype._setTintColor = function (color) {
    if (!color) return;
    this._lightbox.style.setProperty('--neiki-tint-r', color.r);
    this._lightbox.style.setProperty('--neiki-tint-g', color.g);
    this._lightbox.style.setProperty('--neiki-tint-b', color.b);
    this._lightbox.classList.add('neiki-lightbox--tinted');
  };

  /* ========================================================================
     FLIP Morph Transition
     ======================================================================== */

  NeikiGallery.prototype._morphOpen = function (index) {
    if (!this._options.morphTransition) return false;
    var item = this._items[index];
    if (!item || !item.img) return false;

    var thumbRect = item.img.getBoundingClientRect();
    var img = this._image;

    // Set starting position from thumbnail
    img.style.transition = 'none';
    img.style.position = 'fixed';
    img.style.left = thumbRect.left + 'px';
    img.style.top = thumbRect.top + 'px';
    img.style.width = thumbRect.width + 'px';
    img.style.height = thumbRect.height + 'px';
    img.style.maxWidth = 'none';
    img.style.maxHeight = 'none';
    img.style.borderRadius = getComputedStyle(item.img).borderRadius;
    img.style.objectFit = 'cover';
    img.style.zIndex = '99';

    // Force reflow
    void img.offsetHeight;

    // Animate to final position
    var self = this;
    requestAnimationFrame(function () {
      img.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
      img.style.position = '';
      img.style.left = '';
      img.style.top = '';
      img.style.width = '';
      img.style.height = '';
      img.style.maxWidth = '';
      img.style.maxHeight = '';
      img.style.borderRadius = '';
      img.style.objectFit = '';
      img.style.zIndex = '';

      img.addEventListener('transitionend', function onEnd() {
        img.removeEventListener('transitionend', onEnd);
        img.style.transition = '';
      });
    });

    return true;
  };

  /* ========================================================================
     EXIF Display
     ======================================================================== */

  NeikiGallery.prototype._loadExif = function (src) {
    if (!this._options.exif || !this._exifOverlay) return;
    var overlay = this._exifOverlay;
    overlay.innerHTML = '';
    overlay.classList.remove('neiki-exif--visible');

    parseExif(src, function (tags) {
      if (!tags) return;
      var parts = [];
      if (tags.make || tags.model) parts.push((tags.make || '') + ' ' + (tags.model || ''));
      if (tags.focalLength) parts.push(Math.round(tags.focalLength) + 'mm');
      if (tags.fNumber) parts.push('f/' + tags.fNumber.toFixed(1));
      if (tags.exposure) {
        var exp = tags.exposure;
        parts.push(exp < 1 ? '1/' + Math.round(1 / exp) + 's' : exp.toFixed(1) + 's');
      }
      if (tags.iso) parts.push('ISO ' + tags.iso);
      if (parts.length === 0) return;
      overlay.textContent = parts.join('  ·  ');
      overlay.classList.add('neiki-exif--visible');
    });
  };

  /* ========================================================================
     Color Palette Display
     ======================================================================== */

  NeikiGallery.prototype._loadPalette = function (src) {
    if (!this._options.colorPalette || !this._paletteStrip) return;
    var strip = this._paletteStrip;
    strip.innerHTML = '';
    strip.classList.remove('neiki-palette--visible');

    extractPalette(src, 5, function (colors) {
      if (!colors || colors.length === 0) return;
      colors.forEach(function (c) {
        var dot = createElement('span', 'neiki-palette__dot');
        dot.style.backgroundColor = c.hex;
        dot.setAttribute('title', c.hex);
        strip.appendChild(dot);
      });
      strip.classList.add('neiki-palette--visible');
    });
  };

  /* ========================================================================
     Hash Navigation
     ======================================================================== */

  NeikiGallery.prototype._hashSlug = function () {
    // Use container id (or group name) for cleaner URLs; fall back to numeric id
    var slug = this._container.id || this._groupName || ('gallery-' + this._id);
    return slug;
  };

  NeikiGallery.prototype._setHash = function (index) {
    if (typeof index === 'number' && this._isOpen) {
      history.replaceState(null, '', '#' + this._hashSlug() + '/' + (index + 1));
    }
  };

  NeikiGallery.prototype._clearHash = function () {
    var prefix = '#' + this._hashSlug() + '/';
    if (window.location.hash.indexOf(prefix) === 0) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  NeikiGallery.prototype._checkHash = function () {
    if (!this._options.hashNavigation) return;
    var hash = window.location.hash;
    var prefix = '#' + this._hashSlug() + '/';
    if (hash.indexOf(prefix) === 0) {
      var idx = parseInt(hash.substring(prefix.length), 10);
      if (!isNaN(idx) && idx >= 1 && idx <= this._items.length) {
        this.open(idx - 1);
      }
    }
  };

  NeikiGallery.prototype._onHashChange = function () {
    this._checkHash();
  };

  /* ========================================================================
     Event Emitter
     ======================================================================== */

  NeikiGallery.prototype._emit = function (event, data) {
    var listeners = this._events[event];
    if (listeners) {
      listeners.forEach(function (fn) { fn(data); });
    }
  };

  /* ========================================================================
     Public API
     ======================================================================== */

  NeikiGallery.prototype.open = function (index) {
    if (this._destroyed) return;
    if (typeof index !== 'number') index = 0;
    if (index < 0) index = 0;
    if (index >= this._items.length) index = this._items.length - 1;

    this._isOpen = true;
    document.body.style.overflow = 'hidden';
    this._lightbox.classList.add('neiki-lightbox--visible');
    this._lightbox.focus();

    this._currentIndex = -1;
    this._goTo(index);

    // FLIP morph transition
    this._morphOpen(index);

    // Auto-start slideshow if option is set
    if (this._options.slideshow) this.startSlideshow();

    this._callPluginHook && this._callPluginHook('open', { index: index });
    this._emit('open', index);
  };

  NeikiGallery.prototype.close = function () {
    if (!this._isOpen) return;
    this._isOpen = false;

    // Stop slideshow
    this.stopSlideshow();

    // v3: Stop any playing media
    this._stopAllMedia && this._stopAllMedia();
    this._clearMediaSlide && this._clearMediaSlide();

    // v3: Close any open overlays
    if (this._infoPanelOpen) this.toggleInfoPanel(false);
    if (this._shortcutsOpen) this.toggleShortcutsHelp(false);
    if (this._editorOverlay) this.closeEditor();
    if (this._annotateOverlay) this.closeAnnotate();
    this._hideContextMenu && this._hideContextMenu();

    // Exit PiP
    if (this._pipActive) {
      this._pipActive = false;
      this._lightbox.classList.remove('neiki-lightbox--pip');
    }

    // Exit story mode
    if (this._storyOpen) this._exitStoryMode();

    // Exit fullscreen
    if (this._isFullscreen) {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    }

    // Reset zoom
    this._resetZoom();

    // Close share
    if (this._shareVisible) this._toggleSharePopup();

    // Reset backdrop tint
    this._lightbox.classList.remove('neiki-lightbox--tinted');

    document.body.style.overflow = '';
    this._lightbox.classList.remove('neiki-lightbox--visible');

    if (this._options.hashNavigation) this._clearHash();

    this._callPluginHook && this._callPluginHook('close');
    this._emit('close');
  };

  NeikiGallery.prototype.next = function () {
    if (this._navigateGroup && this._navigateGroup(1)) return;
    this._goTo(this._currentIndex + 1);
  };

  NeikiGallery.prototype.prev = function () {
    if (this._navigateGroup && this._navigateGroup(-1)) return;
    this._goTo(this._currentIndex - 1);
  };

  NeikiGallery.prototype.on = function (event, callback) {
    if (!this._events[event]) this._events[event] = [];
    this._events[event].push(callback);
    return this;
  };

  NeikiGallery.prototype.off = function (event, callback) {
    if (!callback) {
      // Remove all listeners for this event when no callback specified
      delete this._events[event];
      return this;
    }
    var listeners = this._events[event];
    if (listeners) {
      this._events[event] = listeners.filter(function (fn) { return fn !== callback; });
    }
    return this;
  };

  NeikiGallery.prototype.once = function (event, callback) {
    var self = this;
    var wrapper = function (data) {
      callback(data);
      self.off(event, wrapper);
    };
    return this.on(event, wrapper);
  };

  NeikiGallery.prototype.filter = function (tag) {
    this._applyFilter(tag || null);
  };

  NeikiGallery.prototype.destroy = function () {
    if (this._destroyed) return;
    this._destroyed = true;

    if (this._isOpen) this.close();

    if (this._boundHandlers.keydown) {
      document.removeEventListener('keydown', this._boundHandlers.keydown);
    }
    if (this._boundHandlers.hashchange) {
      window.removeEventListener('hashchange', this._boundHandlers.hashchange);
    }
    if (this._boundHandlers.fullscreenchange) {
      document.removeEventListener('fullscreenchange', this._boundHandlers.fullscreenchange);
      document.removeEventListener('webkitfullscreenchange', this._boundHandlers.fullscreenchange);
    }
    if (this._boundHandlers.touchstart) {
      this._stage.removeEventListener('touchstart', this._boundHandlers.touchstart);
      this._stage.removeEventListener('touchmove', this._boundHandlers.touchmove);
      this._stage.removeEventListener('touchend', this._boundHandlers.touchend);
    }

    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }

    if (this._virtualObserver) {
      this._virtualObserver.disconnect();
      this._virtualObserver = null;
    }

    if (this._storyOpen) this._exitStoryMode();

    // v3: destroy plugins, unregister group, remove system theme listener
    this._destroyPlugins && this._destroyPlugins();
    this._unregisterGroup && this._unregisterGroup();
    this._callPluginHook && this._callPluginHook('destroy');

    if (this._systemThemeMQ && this._systemThemeListener) {
      if (this._systemThemeMQ.removeEventListener) this._systemThemeMQ.removeEventListener('change', this._systemThemeListener);
      else if (this._systemThemeMQ.removeListener) this._systemThemeMQ.removeListener(this._systemThemeListener);
    }

    if (this._infiniteObserver) {
      this._infiniteObserver.disconnect();
      this._infiniteObserver = null;
    }
    if (this._infiniteSentinel && this._infiniteSentinel.parentNode) {
      this._infiniteSentinel.parentNode.removeChild(this._infiniteSentinel);
    }

    if (this._lightbox && this._lightbox.parentNode) {
      this._lightbox.parentNode.removeChild(this._lightbox);
    }

    if (this._filterBar && this._filterBar.parentNode) {
      this._filterBar.parentNode.removeChild(this._filterBar);
    }

    if (this._contextMenu && this._contextMenu.parentNode) {
      this._contextMenu.parentNode.removeChild(this._contextMenu);
    }

    this._container.classList.remove('neiki-gallery', 'neiki-gallery--masonry', 'neiki-gallery--grid', 'neiki-gallery--mosaic', 'neiki-gallery--filmstrip', 'neiki-gallery--stagger');

    this._events = {};
  };

  /* ========================================================================
     Comparison Slider (static utility)
     ======================================================================== */

  NeikiGallery.compare = function (container, options) {
    if (typeof container === 'string') container = $(container);
    if (!container) return;

    var opts = mergeOptions({
      before: '',
      after: '',
      labelBefore: 'Before',
      labelAfter: 'After',
      startPosition: 50
    }, options);

    container.classList.add('neiki-compare');
    container.innerHTML = '';

    var beforeImg = createElement('img', 'neiki-compare__before', { src: opts.before, alt: opts.labelBefore, draggable: 'false' });
    var afterImg = createElement('img', 'neiki-compare__after', { src: opts.after, alt: opts.labelAfter, draggable: 'false' });
    var handle = createElement('div', 'neiki-compare__handle');
    var labelBefore = createElement('span', 'neiki-compare__label neiki-compare__label--before', {}, opts.labelBefore);
    var labelAfter = createElement('span', 'neiki-compare__label neiki-compare__label--after', {}, opts.labelAfter);

    container.appendChild(beforeImg);
    container.appendChild(afterImg);
    container.appendChild(handle);
    container.appendChild(labelBefore);
    container.appendChild(labelAfter);

    var pos = opts.startPosition;
    setPosition(pos);

    function setPosition(pct) {
      pct = Math.max(0, Math.min(100, pct));
      pos = pct;
      afterImg.style.clipPath = 'inset(0 0 0 ' + pct + '%)';
      handle.style.left = pct + '%';
    }

    var dragging = false;

    function getPosition(e) {
      var rect = container.getBoundingClientRect();
      var clientX = e.touches ? e.touches[0].clientX : e.clientX;
      return ((clientX - rect.left) / rect.width) * 100;
    }

    function onStart(e) {
      dragging = true;
      setPosition(getPosition(e));
      e.preventDefault();
    }

    function onMove(e) {
      if (!dragging) return;
      setPosition(getPosition(e));
      e.preventDefault();
    }

    function onEnd() {
      dragging = false;
    }

    container.addEventListener('mousedown', onStart);
    container.addEventListener('touchstart', onStart, { passive: false });
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchend', onEnd);

    return {
      setPosition: setPosition,
      getPosition: function () { return pos; },
      destroy: function () {
        container.removeEventListener('mousedown', onStart);
        container.removeEventListener('touchstart', onStart);
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('touchmove', onMove);
        window.removeEventListener('mouseup', onEnd);
        window.removeEventListener('touchend', onEnd);
        container.innerHTML = '';
        container.classList.remove('neiki-compare');
      }
    };
  };

  /* ========================================================================
     v3.0.0 — Plugin System
     ======================================================================== */

  var PLUGIN_REGISTRY = {};

  NeikiGallery.registerPlugin = function (name, factory) {
    if (typeof name !== 'string' || typeof factory !== 'function') {
      throw new Error('NeikiGallery.registerPlugin(name, factory) requires a string name and function factory');
    }
    PLUGIN_REGISTRY[name] = factory;
  };

  NeikiGallery.unregisterPlugin = function (name) {
    delete PLUGIN_REGISTRY[name];
  };

  NeikiGallery.getRegisteredPlugins = function () {
    return Object.keys(PLUGIN_REGISTRY);
  };

  NeikiGallery.prototype._initPlugins = function () {
    this._plugins = {};
    var pluginsOpt = this._options.plugins;
    if (!pluginsOpt || !pluginsOpt.length) return;

    var self = this;
    pluginsOpt.forEach(function (entry) {
      var name, opts;
      if (typeof entry === 'string') {
        name = entry;
        opts = {};
      } else if (entry && typeof entry === 'object') {
        name = entry.name;
        opts = entry;
      } else {
        return;
      }
      var factory = PLUGIN_REGISTRY[name];
      if (!factory) {
        if (window.console && console.warn) {
          console.warn('[NeikiGallery] Plugin not found: ' + name);
        }
        return;
      }
      try {
        var instance = factory(self, opts) || {};
        self._plugins[name] = instance;
        if (typeof instance.init === 'function') instance.init();
      } catch (err) {
        if (window.console && console.error) {
          console.error('[NeikiGallery] Plugin "' + name + '" init failed:', err);
        }
      }
    });
  };

  NeikiGallery.prototype._callPluginHook = function (hook, data) {
    if (!this._plugins) return;
    for (var name in this._plugins) {
      if (this._plugins.hasOwnProperty(name)) {
        var inst = this._plugins[name];
        if (inst && typeof inst[hook] === 'function') {
          try { inst[hook](data); } catch (e) { /* swallow */ }
        }
      }
    }
  };

  NeikiGallery.prototype._destroyPlugins = function () {
    if (!this._plugins) return;
    for (var name in this._plugins) {
      if (this._plugins.hasOwnProperty(name)) {
        var inst = this._plugins[name];
        if (inst && typeof inst.destroy === 'function') {
          try { inst.destroy(); } catch (e) { /* swallow */ }
        }
      }
    }
    this._plugins = {};
  };

  NeikiGallery.prototype.plugin = function (name) {
    return this._plugins ? this._plugins[name] : null;
  };

  /* ========================================================================
     v3.0.0 — Video & Embed Support
     ======================================================================== */

  var YOUTUBE_RE = /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/i;
  var VIMEO_RE = /vimeo\.com\/(?:video\/)?(\d+)/i;
  var VIDEO_EXT_RE = /\.(mp4|webm|ogv|mov|m4v)(\?.*)?$/i;

  function detectMediaType(url) {
    if (!url) return 'image';
    if (YOUTUBE_RE.test(url)) return 'youtube';
    if (VIMEO_RE.test(url)) return 'vimeo';
    if (VIDEO_EXT_RE.test(url)) return 'video';
    return 'image';
  }

  function youtubeEmbedUrl(url) {
    var m = url.match(YOUTUBE_RE);
    if (!m) return null;
    return 'https://www.youtube.com/embed/' + m[1] + '?rel=0&autoplay=1';
  }

  function vimeoEmbedUrl(url) {
    var m = url.match(VIMEO_RE);
    if (!m) return null;
    return 'https://player.vimeo.com/video/' + m[1] + '?autoplay=1';
  }

  NeikiGallery.detectMediaType = detectMediaType;

  NeikiGallery.prototype._renderMediaSlide = function (item, slideEl) {
    var type = item.mediaType || detectMediaType(item.src);
    item.mediaType = type;
    if (type === 'image') return null;

    if (type === 'video') {
      var video = createElement('video', 'neiki-lightbox__video', {
        src: item.src,
        controls: 'true',
        playsinline: 'true',
        preload: 'metadata'
      });
      if (item.poster) video.setAttribute('poster', item.poster);
      slideEl.appendChild(video);
      try { video.play().catch(function () {}); } catch (e) { /* ignore */ }
      return video;
    }

    if (type === 'youtube' || type === 'vimeo') {
      var src = type === 'youtube' ? youtubeEmbedUrl(item.src) : vimeoEmbedUrl(item.src);
      if (!src) return null;
      var iframe = createElement('iframe', 'neiki-lightbox__embed', {
        src: src,
        frameborder: '0',
        allow: 'autoplay; fullscreen; picture-in-picture',
        allowfullscreen: 'true',
        loading: 'lazy'
      });
      slideEl.appendChild(iframe);
      return iframe;
    }
    return null;
  };

  NeikiGallery.prototype._stopAllMedia = function () {
    if (!this._slideWrapper) return;
    var videos = this._slideWrapper.querySelectorAll('video');
    for (var i = 0; i < videos.length; i++) {
      try { videos[i].pause(); } catch (e) { /* ignore */ }
    }
    var iframes = this._slideWrapper.querySelectorAll('iframe.neiki-lightbox__embed');
    for (var j = 0; j < iframes.length; j++) {
      var src = iframes[j].src;
      iframes[j].src = '';
      iframes[j].src = src.replace('autoplay=1', 'autoplay=0');
    }
  };

  /* ========================================================================
     v3.0.0 — Grouped / Album Navigation
     ======================================================================== */

  var GROUP_REGISTRY = {};

  NeikiGallery.prototype._registerGroup = function () {
    var group = this._options.group || this._container.getAttribute('data-group');
    if (!group) return;
    this._groupName = group;
    if (!GROUP_REGISTRY[group]) GROUP_REGISTRY[group] = [];
    GROUP_REGISTRY[group].push(this);
  };

  NeikiGallery.prototype._unregisterGroup = function () {
    if (!this._groupName) return;
    var arr = GROUP_REGISTRY[this._groupName];
    if (!arr) return;
    var idx = arr.indexOf(this);
    if (idx !== -1) arr.splice(idx, 1);
    if (arr.length === 0) delete GROUP_REGISTRY[this._groupName];
  };

  NeikiGallery.prototype._getGroupItems = function () {
    if (!this._groupName) return null;
    var galleries = GROUP_REGISTRY[this._groupName] || [];
    var combined = [];
    galleries.forEach(function (g) {
      g._items.forEach(function (item) {
        combined.push({ gallery: g, item: item, originalIndex: g._items.indexOf(item) });
      });
    });
    return combined;
  };

  NeikiGallery.prototype._getGroupTotalCount = function () {
    var items = this._getGroupItems();
    return items ? items.length : this._items.length;
  };

  NeikiGallery.prototype._getGroupCurrentIndex = function () {
    if (!this._groupName) return this._currentIndex;
    var items = this._getGroupItems();
    if (!items) return this._currentIndex;
    var self = this;
    var idx = -1;
    items.forEach(function (entry, i) {
      if (entry.gallery === self && entry.originalIndex === self._currentIndex) idx = i;
    });
    return idx === -1 ? this._currentIndex : idx;
  };

  NeikiGallery.prototype._navigateGroup = function (delta) {
    if (!this._groupName) return false;
    var items = this._getGroupItems();
    if (!items || items.length <= 1) return false;
    var current = this._getGroupCurrentIndex();
    var next = current + delta;
    if (next < 0 || next >= items.length) {
      if (this._options.loop) {
        next = (next + items.length) % items.length;
      } else {
        return true;
      }
    }
    var targetEntry = items[next];
    if (targetEntry.gallery === this) {
      this._goTo(targetEntry.originalIndex);
    } else {
      this.close();
      targetEntry.gallery.open(targetEntry.originalIndex);
    }
    return true;
  };

  /* ========================================================================
     v3.0.0 — Favorites / Bookmarks
     ======================================================================== */

  var FAVORITES_KEY_PREFIX = 'neiki-gallery-favorites:';

  NeikiGallery.prototype._loadFavorites = function () {
    if (!this._options.favorites) {
      this._favorites = [];
      return;
    }
    var key = this._options.favoritesKey || (this._container.id || 'default');
    this._favoritesStorageKey = FAVORITES_KEY_PREFIX + key;
    try {
      var raw = window.localStorage.getItem(this._favoritesStorageKey);
      this._favorites = raw ? JSON.parse(raw) : [];
    } catch (e) {
      this._favorites = [];
    }
  };

  NeikiGallery.prototype._saveFavorites = function () {
    if (!this._favoritesStorageKey) return;
    try {
      window.localStorage.setItem(this._favoritesStorageKey, JSON.stringify(this._favorites));
    } catch (e) { /* quota exceeded */ }
  };

  NeikiGallery.prototype.isFavorite = function (index) {
    if (typeof index !== 'number') index = this._currentIndex;
    var item = this._items[index];
    if (!item) return false;
    return this._favorites.indexOf(item.src) !== -1;
  };

  NeikiGallery.prototype.toggleFavorite = function (index) {
    if (typeof index !== 'number') index = this._currentIndex;
    var item = this._items[index];
    if (!item) return false;
    var pos = this._favorites.indexOf(item.src);
    var added;
    if (pos === -1) {
      this._favorites.push(item.src);
      added = true;
    } else {
      this._favorites.splice(pos, 1);
      added = false;
    }
    this._saveFavorites();
    this._updateFavoriteUI(index);
    this._emit(added ? 'favorite' : 'unfavorite', { index: index, src: item.src });
    return added;
  };

  NeikiGallery.prototype.getFavorites = function () {
    return this._favorites.slice();
  };

  NeikiGallery.prototype.clearFavorites = function () {
    this._favorites = [];
    this._saveFavorites();
    this._refreshAllFavoriteUI();
  };

  NeikiGallery.prototype._updateFavoriteUI = function (index) {
    if (!this._options.favorites) return;
    if (this._favBtn) {
      this._favBtn.classList.toggle('neiki-lightbox__fav--active', this.isFavorite(index));
    }
    var item = this._items[index];
    if (item && item.element) {
      item.element.classList.toggle('neiki-favorited', this._favorites.indexOf(item.src) !== -1);
    }
  };

  NeikiGallery.prototype._refreshAllFavoriteUI = function () {
    if (!this._options.favorites) return;
    var self = this;
    this._items.forEach(function (item, i) {
      item.element.classList.toggle('neiki-favorited', self._favorites.indexOf(item.src) !== -1);
    });
    if (this._favBtn) {
      this._favBtn.classList.toggle('neiki-lightbox__fav--active', this.isFavorite(this._currentIndex));
    }
  };

  /* ========================================================================
     v3.0.0 — Info Panel Sidebar
     ======================================================================== */

  NeikiGallery.prototype._buildInfoPanel = function () {
    if (!this._options.infoPanel) return;
    this._infoPanel = createElement('aside', 'neiki-lightbox__info');
    this._infoPanel.innerHTML =
      '<div class="neiki-info__header">' +
      '<h3 class="neiki-info__title">Image info</h3>' +
      '<button class="neiki-info__close" type="button" aria-label="Close info panel">' +
      ICONS.close + '</button>' +
      '</div>' +
      '<div class="neiki-info__body"></div>';
    this._lightbox.appendChild(this._infoPanel);
    this._infoBody = this._infoPanel.querySelector('.neiki-info__body');
    var self = this;
    this._infoPanel.querySelector('.neiki-info__close').addEventListener('click', function () {
      self.toggleInfoPanel(false);
    });
  };

  NeikiGallery.prototype.toggleInfoPanel = function (force) {
    if (!this._infoPanel) return;
    var open = typeof force === 'boolean' ? force : !this._infoPanelOpen;
    this._infoPanelOpen = open;
    this._lightbox.classList.toggle('neiki-lightbox--info-open', open);
    if (open) this._populateInfoPanel(this._currentIndex);
    this._emit(open ? 'infoOpen' : 'infoClose');
  };

  NeikiGallery.prototype._populateInfoPanel = function (index) {
    if (!this._infoBody) return;
    var item = this._items[index];
    if (!item) return;
    var html = '';
    var filename = (item.src || '').split('/').pop().split('?')[0];
    html += '<dl class="neiki-info__list">';
    html += '<dt>Filename</dt><dd>' + escapeHtml(filename) + '</dd>';
    if (item.caption) html += '<dt>Caption</dt><dd>' + escapeHtml(item.caption) + '</dd>';
    if (item.width && item.height) {
      html += '<dt>Dimensions</dt><dd>' + item.width + ' × ' + item.height + ' px</dd>';
    }
    if (item.tags && item.tags.length) {
      html += '<dt>Tags</dt><dd>' + item.tags.map(escapeHtml).join(', ') + '</dd>';
    }
    if (item.mediaType && item.mediaType !== 'image') {
      html += '<dt>Type</dt><dd>' + item.mediaType + '</dd>';
    }
    html += '<dt>URL</dt><dd><a href="' + escapeAttr(item.src) + '" target="_blank" rel="noopener">Open original</a></dd>';
    html += '</dl>';

    if (item._exifData) {
      html += '<h4 class="neiki-info__subtitle">EXIF</h4><dl class="neiki-info__list">';
      var exif = item._exifData;
      if (exif.camera) html += '<dt>Camera</dt><dd>' + escapeHtml(exif.camera) + '</dd>';
      if (exif.lens) html += '<dt>Lens</dt><dd>' + escapeHtml(exif.lens) + '</dd>';
      if (exif.focalLength) html += '<dt>Focal length</dt><dd>' + escapeHtml(exif.focalLength) + '</dd>';
      if (exif.aperture) html += '<dt>Aperture</dt><dd>' + escapeHtml(exif.aperture) + '</dd>';
      if (exif.shutter) html += '<dt>Shutter</dt><dd>' + escapeHtml(exif.shutter) + '</dd>';
      if (exif.iso) html += '<dt>ISO</dt><dd>' + escapeHtml(exif.iso) + '</dd>';
      html += '</dl>';
    }
    this._infoBody.innerHTML = html;
  };

  function escapeHtml(s) {
    if (s == null) return '';
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function escapeAttr(s) { return escapeHtml(s); }

  /* ========================================================================
     v3.0.0 — Print Support
     ======================================================================== */

  NeikiGallery.prototype.print = function (index) {
    if (typeof index !== 'number') index = this._currentIndex;
    var item = this._items[index];
    if (!item) return;

    var win = window.open('about:blank', '_blank');
    if (!win) return;
    var caption = item.caption ? '<figcaption>' + escapeHtml(item.caption) + '</figcaption>' : '';
    var doc = win.document;
    doc.open();
    doc.write(
      '<!DOCTYPE html><html><head><title>Print — ' + escapeHtml(item.caption || 'Image') + '</title>' +
      '<style>' +
      '@page { margin: 16mm; }' +
      'body { margin: 0; font-family: system-ui, sans-serif; background: #fff; }' +
      'figure { margin: 0; text-align: center; }' +
      'img { max-width: 100%; max-height: 90vh; height: auto; object-fit: contain; display: block; margin: 0 auto; }' +
      'figcaption { margin-top: 12px; font-size: 14px; color: #333; }' +
      '@media print { body { background: #fff; -webkit-print-color-adjust: exact; } }' +
      '</style></head><body>' +
      '<figure><img src="' + escapeAttr(item.src) + '" alt="' + escapeAttr(item.caption || '') + '">' +
      caption + '</figure>' +
      '</body></html>'
    );
    doc.close();
    // Wait for image to load then print
    var img = win.document.querySelector('img');
    if (img) {
      if (img.complete) {
        win.focus();
        win.print();
      } else {
        img.onload = function () {
          win.focus();
          win.print();
        };
        img.onerror = function () {
          win.focus();
          win.print();
        };
      }
    } else {
      win.focus();
      win.print();
    }
    this._emit('print', { index: index, src: item.src });
  };

  /* ========================================================================
     v3.0.0 — Right-Click Context Menu
     ======================================================================== */

  NeikiGallery.prototype._buildContextMenu = function () {
    if (!this._options.contextMenu) return;
    this._contextMenu = createElement('div', 'neiki-context-menu', { role: 'menu' });
    document.body.appendChild(this._contextMenu);

    var self = this;
    this._onContextMenuClickOutside = function (e) {
      if (!self._contextMenu) return;
      if (!self._contextMenu.contains(e.target)) self._hideContextMenu();
    };
    this._onContextMenuKey = function (e) {
      if (e.key === 'Escape') self._hideContextMenu();
    };
  };

  NeikiGallery.prototype._showContextMenu = function (x, y, index) {
    if (!this._contextMenu) return;
    var item = this._items[index];
    if (!item) return;
    var self = this;

    var entries = [
      { label: 'Open original', icon: ICONS.fullscreen, action: function () { window.open(item.src, '_blank', 'noopener'); } },
      { label: 'Copy link', icon: ICONS.link, action: function () { self._copyToClipboard(item.src); self._showToast('Link copied'); } },
      { label: 'Download', icon: ICONS.download, action: function () { self._downloadImage(item.src, item.caption); } },
      { label: 'Share', icon: ICONS.share, action: function () { self._shareItem(item); } }
    ];
    if (this._options.print !== false) {
      entries.push({ label: 'Print', icon: ICONS.fullscreen, action: function () { self.print(index); } });
    }
    if (this._options.favorites) {
      entries.push({
        label: this.isFavorite(index) ? 'Remove from favorites' : 'Add to favorites',
        icon: ICONS.heart || ICONS.share,
        action: function () { self.toggleFavorite(index); }
      });
    }

    this._contextMenu.innerHTML = entries.map(function (e, i) {
      return '<button class="neiki-context-menu__item" type="button" data-idx="' + i + '" role="menuitem">' +
             '<span class="neiki-context-menu__icon">' + e.icon + '</span>' +
             '<span class="neiki-context-menu__label">' + e.label + '</span></button>';
    }).join('');

    Array.prototype.forEach.call(this._contextMenu.querySelectorAll('button'), function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var i = parseInt(btn.getAttribute('data-idx'), 10);
        if (entries[i] && entries[i].action) entries[i].action();
        self._hideContextMenu();
      });
    });

    this._contextMenu.style.left = x + 'px';
    this._contextMenu.style.top = y + 'px';
    this._contextMenu.classList.add('neiki-context-menu--visible');

    // Position adjust to viewport
    var rect = this._contextMenu.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
      this._contextMenu.style.left = (window.innerWidth - rect.width - 8) + 'px';
    }
    if (rect.bottom > window.innerHeight) {
      this._contextMenu.style.top = (window.innerHeight - rect.height - 8) + 'px';
    }

    document.addEventListener('click', this._onContextMenuClickOutside);
    document.addEventListener('keydown', this._onContextMenuKey);
  };

  NeikiGallery.prototype._hideContextMenu = function () {
    if (!this._contextMenu) return;
    this._contextMenu.classList.remove('neiki-context-menu--visible');
    document.removeEventListener('click', this._onContextMenuClickOutside);
    document.removeEventListener('keydown', this._onContextMenuKey);
  };

  NeikiGallery.prototype._bindContextMenu = function () {
    if (!this._options.contextMenu) return;
    var self = this;
    this._items.forEach(function (item, idx) {
      item.element.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        self._showContextMenu(e.clientX, e.clientY, idx);
      });
    });
  };

  NeikiGallery.prototype._downloadImage = function (src, caption) {
    var a = document.createElement('a');
    a.href = src;
    a.download = (caption || 'image').replace(/[^a-z0-9_\-]+/gi, '_') + '.jpg';
    a.target = '_blank';
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { a.parentNode && a.parentNode.removeChild(a); }, 100);
  };

  NeikiGallery.prototype._shareItem = function (item) {
    if (navigator.share) {
      navigator.share({
        title: item.caption || 'Image',
        url: item.src
      }).catch(function () {});
    } else {
      this._copyToClipboard(item.src);
      this._showToast('Link copied');
    }
  };

  /* ========================================================================
     v3.0.0 — Keyboard Shortcuts Help Overlay
     ======================================================================== */

  var DEFAULT_SHORTCUTS = [
    { keys: ['←', '→'], desc: 'Previous / Next image' },
    { keys: ['Home', 'End'], desc: 'First / Last image' },
    { keys: ['Esc'], desc: 'Close lightbox' },
    { keys: ['F'], desc: 'Toggle fullscreen' },
    { keys: ['Space'], desc: 'Play / Pause slideshow' },
    { keys: ['Z'], desc: 'Toggle zoom' },
    { keys: ['I'], desc: 'Toggle info panel' },
    { keys: ['B'], desc: 'Toggle favorite (bookmark)' },
    { keys: ['P'], desc: 'Print current image' },
    { keys: ['?'], desc: 'Show this help' }
  ];

  NeikiGallery.prototype._buildShortcutsHelp = function () {
    if (!this._options.shortcutsHelp) return;
    this._shortcutsOverlay = createElement('div', 'neiki-shortcuts');
    var list = DEFAULT_SHORTCUTS.map(function (s) {
      var keys = s.keys.map(function (k) { return '<kbd>' + k + '</kbd>'; }).join(' ');
      return '<li><span class="neiki-shortcuts__keys">' + keys + '</span>' +
             '<span class="neiki-shortcuts__desc">' + s.desc + '</span></li>';
    }).join('');
    this._shortcutsOverlay.innerHTML =
      '<div class="neiki-shortcuts__panel" role="dialog" aria-label="Keyboard shortcuts">' +
      '<div class="neiki-shortcuts__header">' +
      '<h3>Keyboard shortcuts</h3>' +
      '<button class="neiki-shortcuts__close" type="button" aria-label="Close">' + ICONS.close + '</button>' +
      '</div>' +
      '<ul class="neiki-shortcuts__list">' + list + '</ul>' +
      '</div>';
    this._lightbox.appendChild(this._shortcutsOverlay);
    var self = this;
    this._shortcutsOverlay.querySelector('.neiki-shortcuts__close').addEventListener('click', function () {
      self.toggleShortcutsHelp(false);
    });
    this._shortcutsOverlay.addEventListener('click', function (e) {
      if (e.target === self._shortcutsOverlay) self.toggleShortcutsHelp(false);
    });
  };

  NeikiGallery.prototype.toggleShortcutsHelp = function (force) {
    if (!this._shortcutsOverlay) return;
    var show = typeof force === 'boolean' ? force : !this._shortcutsOpen;
    this._shortcutsOpen = show;
    this._shortcutsOverlay.classList.toggle('neiki-shortcuts--visible', show);
  };

  /* ========================================================================
     v3.0.0 — Infinite Scroll, append(), remove()
     ======================================================================== */

  NeikiGallery.prototype._setupInfiniteScroll = function () {
    if (!this._options.infiniteScroll || typeof this._options.loadMore !== 'function') return;
    var self = this;
    this._infiniteSentinel = createElement('div', 'neiki-infinite-sentinel');
    this._container.parentNode.insertBefore(this._infiniteSentinel, this._container.nextSibling);

    if (!('IntersectionObserver' in window)) return;

    this._infiniteLoading = false;
    this._infiniteObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !self._infiniteLoading && !self._infiniteDone) {
          self._loadMoreItems();
        }
      });
    }, { rootMargin: '300px' });
    this._infiniteObserver.observe(this._infiniteSentinel);
  };

  NeikiGallery.prototype._loadMoreItems = function () {
    var self = this;
    if (this._infiniteLoading) return;
    this._infiniteLoading = true;
    this._infiniteSentinel.classList.add('neiki-infinite-sentinel--loading');

    var result = this._options.loadMore.call(this, this._items.length);
    Promise.resolve(result).then(function (newItems) {
      self._infiniteLoading = false;
      self._infiniteSentinel.classList.remove('neiki-infinite-sentinel--loading');
      if (!newItems || !newItems.length) {
        self._infiniteDone = true;
        if (self._infiniteObserver) self._infiniteObserver.disconnect();
        self._infiniteSentinel.classList.add('neiki-infinite-sentinel--done');
        return;
      }
      self.append(newItems);
    }).catch(function () {
      self._infiniteLoading = false;
      self._infiniteSentinel.classList.remove('neiki-infinite-sentinel--loading');
    });
  };

  NeikiGallery.prototype.append = function (newItems) {
    if (!newItems || !newItems.length) return;
    var self = this;
    newItems.forEach(function (data) {
      var a = createElement('a', '', { href: data.src || data.href || '#' });
      if (data.caption) a.setAttribute('data-caption', data.caption);
      if (data.tags) a.setAttribute('data-tags', Array.isArray(data.tags) ? data.tags.join(',') : data.tags);
      if (data.size) a.setAttribute('data-size', data.size);
      if (data.width) a.setAttribute('data-width', data.width);
      if (data.height) a.setAttribute('data-height', data.height);
      if (data.group) a.setAttribute('data-group', data.group);
      var img = createElement('img', '', {
        src: data.thumb || data.src,
        alt: data.caption || ''
      });
      if (data.focus) img.setAttribute('data-focus', data.focus);
      if (data.blurhash) img.setAttribute('data-blurhash', data.blurhash);
      a.appendChild(img);
      self._container.appendChild(a);
    });
    // Reparse items + re-init layout-dependent features
    this._reparseItems();
    this._emit('append', newItems);
  };

  NeikiGallery.prototype.remove = function (index) {
    if (index < 0 || index >= this._items.length) return;
    var item = this._items[index];
    if (item.element && item.element.parentNode) {
      item.element.parentNode.removeChild(item.element);
    }
    this._items.splice(index, 1);
    if (this._currentIndex >= this._items.length) this._currentIndex = this._items.length - 1;
    this._emit('remove', { index: index });
  };

  NeikiGallery.prototype._reparseItems = function () {
    var oldLen = this._items.length;
    this._parseItems();
    // Re-apply features to newly added items
    if (this._options.lazyLoad) this._observeLazyLoad();
    if (this._options.focusPoint) this._applyFocusPoints();
    if (this._options.blurhash) this._applyBlurhashes();
    if (this._options.aspectSkeleton) this._applyAspectSkeleton();
    if (this._options.dragReorder) this._setupDragReorder();
    if (this._options.contextMenu) this._bindContextMenu();
    this._refreshAllFavoriteUI && this._refreshAllFavoriteUI();
  };

  /* ========================================================================
     v3.0.0 — Image Editor (Crop, Rotate, Flip)
     ======================================================================== */

  NeikiGallery.prototype._buildEditor = function () {
    if (!this._options.editor) return;
    this._editorOverlay = createElement('div', 'neiki-editor');
    this._editorOverlay.innerHTML =
      '<div class="neiki-editor__toolbar">' +
      '<button class="neiki-editor__btn" data-action="rotate-ccw" type="button" title="Rotate left">' +
      '<svg viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg></button>' +
      '<button class="neiki-editor__btn" data-action="rotate-cw" type="button" title="Rotate right">' +
      '<svg viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg></button>' +
      '<button class="neiki-editor__btn" data-action="flip-h" type="button" title="Flip horizontal">' +
      '<svg viewBox="0 0 24 24"><path d="M12 3v18"/><path d="M16 7l4 5-4 5"/><path d="M8 7l-4 5 4 5"/></svg></button>' +
      '<button class="neiki-editor__btn" data-action="flip-v" type="button" title="Flip vertical">' +
      '<svg viewBox="0 0 24 24"><path d="M3 12h18"/><path d="M7 8l5-4 5 4"/><path d="M7 16l5 4 5-4"/></svg></button>' +
      '<span class="neiki-editor__sep"></span>' +
      '<button class="neiki-editor__btn" data-action="reset" type="button" title="Reset">Reset</button>' +
      '<button class="neiki-editor__btn neiki-editor__btn--primary" data-action="export" type="button" title="Export">Export</button>' +
      '<button class="neiki-editor__btn" data-action="cancel" type="button" title="Close editor">Close</button>' +
      '</div>';
    this._lightbox.appendChild(this._editorOverlay);
    var self = this;
    Array.prototype.forEach.call(this._editorOverlay.querySelectorAll('button[data-action]'), function (btn) {
      btn.addEventListener('click', function () {
        self._editorAction(btn.getAttribute('data-action'));
      });
    });
  };

  NeikiGallery.prototype.openEditor = function () {
    if (!this._editorOverlay) return;
    this._editorState = { rotation: 0, flipH: false, flipV: false };
    this._editorOverlay.classList.add('neiki-editor--visible');
    this._lightbox.classList.add('neiki-lightbox--editor');
    this._applyEditorTransform();
    this._emit('editorOpen');
  };

  NeikiGallery.prototype.closeEditor = function () {
    if (!this._editorOverlay) return;
    this._editorOverlay.classList.remove('neiki-editor--visible');
    this._lightbox.classList.remove('neiki-lightbox--editor');
    this._editorState = null;
    if (this._currentImg) this._currentImg.style.transform = '';
    this._emit('editorClose');
  };

  NeikiGallery.prototype._editorAction = function (action) {
    if (!this._editorState) return;
    var s = this._editorState;
    switch (action) {
      case 'rotate-cw': s.rotation = (s.rotation + 90) % 360; break;
      case 'rotate-ccw': s.rotation = (s.rotation - 90 + 360) % 360; break;
      case 'flip-h': s.flipH = !s.flipH; break;
      case 'flip-v': s.flipV = !s.flipV; break;
      case 'reset': s.rotation = 0; s.flipH = false; s.flipV = false; break;
      case 'cancel': this.closeEditor(); return;
      case 'export': this._exportEditedImage(); return;
    }
    this._applyEditorTransform();
  };

  NeikiGallery.prototype._applyEditorTransform = function () {
    if (!this._currentImg || !this._editorState) return;
    var s = this._editorState;
    var sx = s.flipH ? -1 : 1;
    var sy = s.flipV ? -1 : 1;
    this._currentImg.style.transform = 'rotate(' + s.rotation + 'deg) scale(' + sx + ',' + sy + ')';
    this._currentImg.style.transition = 'transform 0.3s ease';
  };

  NeikiGallery.prototype._exportEditedImage = function () {
    if (!this._currentImg || !this._editorState) return;
    var img = this._currentImg;
    var s = this._editorState;
    var canvas = document.createElement('canvas');
    var rotated = (s.rotation === 90 || s.rotation === 270);
    canvas.width = rotated ? img.naturalHeight : img.naturalWidth;
    canvas.height = rotated ? img.naturalWidth : img.naturalHeight;
    var ctx = canvas.getContext('2d');
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(s.rotation * Math.PI / 180);
    ctx.scale(s.flipH ? -1 : 1, s.flipV ? -1 : 1);
    try {
      ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
      var self = this;
      canvas.toBlob(function (blob) {
        if (!blob) return;
        self._lastEditedBlob = blob;
        self._emit('editorExport', { blob: blob, url: URL.createObjectURL(blob) });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'edited-' + Date.now() + '.png';
        a.click();
      }, 'image/png');
    } catch (e) {
      this._showToast('Cannot export — image is cross-origin');
    }
  };

  NeikiGallery.prototype.getEditedBlob = function () {
    return this._lastEditedBlob || null;
  };

  /* ========================================================================
     v3.0.0 — Annotation / Drawing Layer
     ======================================================================== */

  NeikiGallery.prototype._buildAnnotation = function () {
    if (!this._options.annotate) return;
    this._annotateOverlay = createElement('div', 'neiki-annotate');
    this._annotateOverlay.innerHTML =
      '<canvas class="neiki-annotate__canvas"></canvas>' +
      '<div class="neiki-annotate__toolbar">' +
      '<input class="neiki-annotate__color" type="color" value="#ff3b30" aria-label="Stroke color">' +
      '<input class="neiki-annotate__size" type="range" min="1" max="20" value="4" aria-label="Brush size">' +
      '<button class="neiki-annotate__btn" data-action="undo" type="button" title="Undo">↶</button>' +
      '<button class="neiki-annotate__btn" data-action="clear" type="button" title="Clear">Clear</button>' +
      '<button class="neiki-annotate__btn neiki-annotate__btn--primary" data-action="export" type="button" title="Export">Export</button>' +
      '<button class="neiki-annotate__btn" data-action="cancel" type="button" title="Close">Close</button>' +
      '</div>';
    this._lightbox.appendChild(this._annotateOverlay);
    this._annotateCanvas = this._annotateOverlay.querySelector('.neiki-annotate__canvas');
    this._annotateCtx = this._annotateCanvas.getContext('2d');
    this._annotateStrokes = [];

    var self = this;
    Array.prototype.forEach.call(this._annotateOverlay.querySelectorAll('button[data-action]'), function (btn) {
      btn.addEventListener('click', function () {
        self._annotateAction(btn.getAttribute('data-action'));
      });
    });
    this._annotateOverlay.querySelector('.neiki-annotate__color').addEventListener('input', function (e) {
      self._annotateColor = e.target.value;
    });
    this._annotateOverlay.querySelector('.neiki-annotate__size').addEventListener('input', function (e) {
      self._annotateSize = parseInt(e.target.value, 10);
    });
    this._annotateColor = '#ff3b30';
    this._annotateSize = 4;

    this._bindAnnotateDrawing();
  };

  NeikiGallery.prototype._bindAnnotateDrawing = function () {
    var self = this;
    var canvas = this._annotateCanvas;
    var drawing = false;
    var current = null;

    function pos(e) {
      var rect = canvas.getBoundingClientRect();
      var p = e.touches ? e.touches[0] : e;
      return { x: (p.clientX - rect.left) * (canvas.width / rect.width),
               y: (p.clientY - rect.top) * (canvas.height / rect.height) };
    }
    function start(e) {
      e.preventDefault();
      drawing = true;
      var p = pos(e);
      current = { color: self._annotateColor, size: self._annotateSize, points: [p] };
    }
    function move(e) {
      if (!drawing) return;
      e.preventDefault();
      var p = pos(e);
      current.points.push(p);
      self._redrawAnnotations(current);
    }
    function end() {
      if (!drawing) return;
      drawing = false;
      if (current && current.points.length > 1) self._annotateStrokes.push(current);
      current = null;
    }
    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);
    canvas.addEventListener('touchstart', start, { passive: false });
    canvas.addEventListener('touchmove', move, { passive: false });
    canvas.addEventListener('touchend', end);
  };

  NeikiGallery.prototype._redrawAnnotations = function (currentStroke) {
    var ctx = this._annotateCtx;
    var canvas = this._annotateCanvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var all = this._annotateStrokes.slice();
    if (currentStroke) all.push(currentStroke);
    all.forEach(function (stroke) {
      if (!stroke.points.length) return;
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (var i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
    });
  };

  NeikiGallery.prototype.openAnnotate = function () {
    if (!this._annotateOverlay || !this._currentImg) return;
    this._annotateCanvas.width = this._currentImg.naturalWidth || 1024;
    this._annotateCanvas.height = this._currentImg.naturalHeight || 768;
    this._annotateStrokes = [];
    this._redrawAnnotations();
    this._annotateOverlay.classList.add('neiki-annotate--visible');
    this._lightbox.classList.add('neiki-lightbox--annotate');
    this._emit('annotateOpen');
  };

  NeikiGallery.prototype.closeAnnotate = function () {
    if (!this._annotateOverlay) return;
    this._annotateOverlay.classList.remove('neiki-annotate--visible');
    this._lightbox.classList.remove('neiki-lightbox--annotate');
    this._emit('annotateClose');
  };

  NeikiGallery.prototype._annotateAction = function (action) {
    switch (action) {
      case 'undo':
        this._annotateStrokes.pop();
        this._redrawAnnotations();
        break;
      case 'clear':
        this._annotateStrokes = [];
        this._redrawAnnotations();
        break;
      case 'cancel':
        this.closeAnnotate();
        break;
      case 'export':
        this._exportAnnotation();
        break;
    }
  };

  NeikiGallery.prototype._exportAnnotation = function () {
    if (!this._currentImg) return;
    var canvas = document.createElement('canvas');
    canvas.width = this._currentImg.naturalWidth;
    canvas.height = this._currentImg.naturalHeight;
    var ctx = canvas.getContext('2d');
    try {
      ctx.drawImage(this._currentImg, 0, 0);
      ctx.drawImage(this._annotateCanvas, 0, 0);
      var self = this;
      canvas.toBlob(function (blob) {
        if (!blob) return;
        self._lastAnnotatedBlob = blob;
        self._emit('annotateExport', { blob: blob, url: URL.createObjectURL(blob) });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'annotated-' + Date.now() + '.png';
        a.click();
      }, 'image/png');
    } catch (e) {
      this._showToast('Cannot export — image is cross-origin');
    }
  };

  NeikiGallery.prototype.getAnnotatedBlob = function () {
    return this._lastAnnotatedBlob || null;
  };

  /* ========================================================================
     v3.0.0 — Kenburns Slideshow Effect
     ======================================================================== */

  NeikiGallery.prototype._applyKenburns = function () {
    if (!this._slideshowRunning) return;
    var slideshowOpts = this._options.slideshow;
    if (typeof slideshowOpts !== 'object' || !slideshowOpts.kenburns) return;
    if (!this._currentImg) return;
    this._currentImg.classList.add('neiki-kenburns');
    var dur = (this._options.slideshow.interval || 4000) + 'ms';
    this._currentImg.style.setProperty('--neiki-kenburns-duration', dur);
  };

  NeikiGallery.prototype._removeKenburns = function () {
    if (this._currentImg) {
      this._currentImg.classList.remove('neiki-kenburns');
      this._currentImg.style.removeProperty('--neiki-kenburns-duration');
    }
  };

  NeikiGallery.prototype._setupSlideshowPauseOnHover = function () {
    var slideshowOpts = this._options.slideshow;
    if (typeof slideshowOpts !== 'object' || !slideshowOpts.pauseOnHover) return;
    var self = this;
    if (!this._lightbox) return;
    this._lightbox.addEventListener('mouseenter', function () {
      if (self._slideshowRunning) {
        self._slideshowPausedByHover = true;
        self.pauseSlideshow();
      }
    });
    this._lightbox.addEventListener('mouseleave', function () {
      if (self._slideshowPausedByHover) {
        self._slideshowPausedByHover = false;
        self.startSlideshow();
      }
    });
  };

  /* ========================================================================
     Auto-Init
     ======================================================================== */

  function autoInit() {
    var galleries = $$('[data-neiki-gallery]');
    galleries.forEach(function (el) {
      if (el._neikiGallery) return;
      el._neikiGallery = new NeikiGallery(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }

  NeikiGallery.autoInit = autoInit;

  // Static utilities (v2.1.0)
  NeikiGallery.extractPalette = extractPalette;
  NeikiGallery.extractDominantColor = extractDominantColor;
  NeikiGallery.parseExif = parseExif;
  NeikiGallery.decodeBlurhash = decodeBlurhash;

  // Static utilities (v3.0.0)
  // NeikiGallery.detectMediaType, registerPlugin, unregisterPlugin, getRegisteredPlugins
  // are exposed inside the v3 module sections above.
  NeikiGallery.version = '3.0.0';

  return NeikiGallery;
});
