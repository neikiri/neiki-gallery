/*!
 * Neiki Gallery v2.1.0
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
    download: '<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>'
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
    theme: 'dark',           // 'dark' | 'light'
    hashNavigation: true,
    counter: true,
    captions: true,
    preload: 1,
    lazyLoad: true,
    stagger: true,           // staggered entrance animation
    slideshow: false,        // auto-advance (can be started via API)
    slideshowInterval: 4000, // ms between slides
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
    aspectSkeleton: true     // use data-width/data-height for skeleton aspect-ratio
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
    this._items = this._parseItems();

    if (this._items.length === 0) {
      console.warn('NeikiGallery: No items found in container.');
      return;
    }

    this._setupGrid();
    this._setupAspectSkeleton();
    this._setupFocusPoint();
    this._setupBlurhash();
    this._setupLazyLoad();
    this._setupStagger();
    this._setupFilter();
    this._setupVirtualScroll();
    this._setupDragReorder();
    this._buildLightbox();
    this._bindEvents();
    this._checkHash();
  }

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
    if (boolAttr('data-slideshow') !== undefined) opts.slideshow = boolAttr('data-slideshow');
    if (numAttr('data-slideshow-interval') !== undefined) opts.slideshowInterval = numAttr('data-slideshow-interval');
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
      items.push({
        src: a.getAttribute('href') || (img ? img.getAttribute('src') : ''),
        thumb: img ? (img.getAttribute('data-src') || img.getAttribute('src')) : '',
        caption: a.getAttribute('data-caption') || (img ? img.getAttribute('alt') : '') || '',
        tags: (a.getAttribute('data-tags') || '').split(',').map(function (t) { return t.trim(); }).filter(Boolean),
        size: a.getAttribute('data-size') || '',
        focus: a.getAttribute('data-focus') || (img ? img.getAttribute('data-focus') : '') || '',
        blurhash: a.getAttribute('data-blurhash') || (img ? img.getAttribute('data-blurhash') : '') || '',
        width: parseInt(a.getAttribute('data-width') || (img ? img.getAttribute('data-width') || img.getAttribute('width') : ''), 10) || 0,
        height: parseInt(a.getAttribute('data-height') || (img ? img.getAttribute('data-height') || img.getAttribute('height') : ''), 10) || 0,
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
        e.preventDefault();
        this._toggleFullscreen();
        break;
      case ' ':
        e.preventDefault();
        this.toggleSlideshow();
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

    // Reset zoom
    this._resetZoom();

    // Close share popup
    if (this._shareVisible) this._toggleSharePopup();

    // Update nav
    this._updateNavButtons();

    // Spinner
    this._spinner.classList.remove('neiki-hidden');

    var self = this;
    var img = this._image;

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

    // Counter
    if (this._counter) {
      this._counter.textContent = (index + 1) + ' / ' + len;
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
    this._applyBackdropTint(item.src);

    // EXIF
    this._loadExif(item.src);

    // Color palette
    this._loadPalette(item.src);

    // Restart slideshow timer if running
    if (this._slideshowRunning) this._startSlideshowTimer();

    this._emit('change', index);
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

  NeikiGallery.prototype._startSlideshowTimer = function () {
    var self = this;
    this._clearSlideshowTimer();

    var interval = this._options.slideshowInterval;

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
      var nextIndex = self._currentIndex + 1;
      if (nextIndex >= self._items.length) {
        if (self._options.loop) {
          nextIndex = 0;
        } else {
          self.stopSlideshow();
          return;
        }
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

  NeikiGallery.prototype._setHash = function (index) {
    if (typeof index === 'number' && this._isOpen) {
      history.replaceState(null, '', '#neiki-' + this._id + '=' + (index + 1));
    }
  };

  NeikiGallery.prototype._clearHash = function () {
    if (window.location.hash.indexOf('#neiki-' + this._id + '=') === 0) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  NeikiGallery.prototype._checkHash = function () {
    if (!this._options.hashNavigation) return;
    var hash = window.location.hash;
    var prefix = '#neiki-' + this._id + '=';
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

    this._emit('open', index);
  };

  NeikiGallery.prototype.close = function () {
    if (!this._isOpen) return;
    this._isOpen = false;

    // Stop slideshow
    this.stopSlideshow();

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

    this._emit('close');
  };

  NeikiGallery.prototype.next = function () {
    this._goTo(this._currentIndex + 1);
  };

  NeikiGallery.prototype.prev = function () {
    this._goTo(this._currentIndex - 1);
  };

  NeikiGallery.prototype.on = function (event, callback) {
    if (!this._events[event]) this._events[event] = [];
    this._events[event].push(callback);
    return this;
  };

  NeikiGallery.prototype.off = function (event, callback) {
    var listeners = this._events[event];
    if (listeners) {
      this._events[event] = listeners.filter(function (fn) { return fn !== callback; });
    }
    return this;
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

    if (this._lightbox && this._lightbox.parentNode) {
      this._lightbox.parentNode.removeChild(this._lightbox);
    }

    if (this._filterBar && this._filterBar.parentNode) {
      this._filterBar.parentNode.removeChild(this._filterBar);
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

  return NeikiGallery;
});
