// Version widget + shared lightbox.
// The version choice persists across pages (localStorage) and is shareable via ?v=.
(function () {
  var VERSIONS = ['a', 'b', 'c', 'd', 'x'];
  var param = new URLSearchParams(location.search).get('v');
  var current = VERSIONS.includes(param) ? param : (localStorage.getItem('aq-version') || 'x');

  function apply(v) {
    current = v;
    document.body.dataset.v = v;
    localStorage.setItem('aq-version', v);
    document.querySelectorAll('.vwidget button').forEach(function (b) {
      b.classList.toggle('active', b.dataset.v === v);
    });
    var url = new URL(location.href);
    url.searchParams.set('v', v);
    history.replaceState(null, '', url);
    document.dispatchEvent(new CustomEvent('aq:version', { detail: v }));
    document.querySelectorAll('a[href$=".html"], a[href*=".html?"]').forEach(function (a) {
      var href = new URL(a.getAttribute('href'), location.href);
      href.searchParams.set('v', v);
      a.href = href.pathname.split('/').pop() + href.search;
    });
  }

  var widget = document.createElement('div');
  widget.className = 'vwidget';
  widget.innerHTML =
    '<span class="label">Version</span>' +
    VERSIONS.map(function (v) {
      return '<button data-v="' + v + '">' + v.toUpperCase() + '</button>';
    }).join('');
  widget.addEventListener('click', function (e) {
    if (e.target.dataset.v) apply(e.target.dataset.v);
  });

  // ————— Lightbox —————
  // Shows one photograph at the largest size that fits the viewport WITHOUT
  // changing its aspect ratio. When it receives the whole project
  // (openLightbox({photos: […], index})) it becomes navigable, like
  // emmanuelsmonsalve.com: click on either half (arrow cursor), scroll,
  // ← / →, and a thumbnail sheet behind the «Thumbnails» button.
  var lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.hidden = true;
  lb.innerHTML =
    '<span class="lb-btn lb-grid-btn" hidden>Thumbnails</span>' +
    '<span class="lb-btn lb-close">Close ✕</span>' +
    '<div class="lb-nav lb-prev" hidden></div>' +
    '<div class="lb-nav lb-next" hidden></div>' +
    '<figure>' +
    '  <div class="lb-box ph" hidden></div>' +
    '  <img class="lb-box" hidden alt="">' +
    '  <figcaption></figcaption>' +
    '</figure>' +
    '<div class="lb-thumbs"></div>';

  var lbPhotos = null, lbIndex = 0, lbZoomed = false;

  function fit(ratio) {
    var v = document.body.dataset.v;
    var maxW = innerWidth * (v === 'b' ? 0.70 : v === 'd' ? 0.92 : 0.88);
    var maxH = innerHeight * (v === 'b' ? 0.72 : v === 'd' ? 0.86 : 0.80);
    var w = maxW, h = w / ratio;
    if (h > maxH) { h = maxH; w = h * ratio; }
    return { w: Math.round(w), h: Math.round(h) };
  }

  function renderPhoto() {
    var ph = lbPhotos[lbIndex];
    var box = lb.querySelector('div.lb-box');
    var img = lb.querySelector('img.lb-box');
    var size = fit(ph.ratio || 3 / 2);
    if (ph.src) {
      img.src = ph.src;
      img.style.maxWidth = size.w + 'px';
      img.style.maxHeight = size.h + 'px';
      img.hidden = false;
      box.hidden = true;
    } else {
      box.style.width = size.w + 'px';
      box.style.height = size.h + 'px';
      box.hidden = false;
      img.hidden = true;
    }
    lb.querySelector('figcaption').textContent = ph.caption || '';
    // the neighbours load quietly while this one is on screen
    if (lbPhotos.length > 1) {
      [1, -1].forEach(function (d) {
        var n = lbPhotos[(lbIndex + d + lbPhotos.length) % lbPhotos.length];
        if (n.src) { (new Image()).src = n.src; }
      });
    }
  }

  // click the print: the file at full size, panned by scrolling
  function setZoom(on) {
    lbZoomed = on;
    lb.classList.toggle('lb-zoomed', on);
    var img = lb.querySelector('img.lb-box');
    if (on) {
      img.style.maxWidth = 'none';
      img.style.maxHeight = 'none';
      requestAnimationFrame(function () {
        lb.scrollLeft = (lb.scrollWidth - lb.clientWidth) / 2;
        lb.scrollTop = (lb.scrollHeight - lb.clientHeight) / 2;
      });
    } else {
      lb.scrollLeft = lb.scrollTop = 0;
      if (lbPhotos) renderPhoto();
    }
  }

  function setGrid(on) {
    lb.classList.toggle('lb-grid-mode', on);
    lb.querySelector('.lb-grid-btn').textContent = on ? 'Close thumbnails' : 'Thumbnails';
  }

  function buildThumbs() {
    var sheet = lb.querySelector('.lb-thumbs');
    sheet.innerHTML = '';
    if (lbPhotos.length < 2) return;
    lbPhotos.forEach(function (ph, i) {
      var img = document.createElement('img');
      img.src = ph.thumb || ph.src;
      img.alt = '';
      img.loading = 'lazy';
      img.decoding = 'async';
      if (ph.ratio) img.style.aspectRatio = String(ph.ratio);
      img.addEventListener('click', function (e) {
        e.stopPropagation();
        lbIndex = i;
        setGrid(false);
        renderPhoto();
      });
      sheet.appendChild(img);
    });
  }

  function openLightbox(opts) {
    lbPhotos = opts.photos || [{ ratio: opts.ratio, caption: opts.caption, src: opts.src }];
    lbIndex = Math.min(opts.index || 0, lbPhotos.length - 1);
    var multi = lbPhotos.length > 1;
    lb.querySelector('.lb-prev').hidden = !multi;
    lb.querySelector('.lb-next').hidden = !multi;
    lb.querySelector('.lb-grid-btn').hidden = !multi;
    setGrid(false);
    lbZoomed = false;
    lb.classList.remove('lb-zoomed');
    buildThumbs();
    renderPhoto();
    lb.hidden = false;
    document.body.classList.add('lb-open');
  }

  function closeLightbox() {
    lb.hidden = true;
    lbPhotos = null;
    setGrid(false);
    lbZoomed = false;
    lb.classList.remove('lb-zoomed');
    document.body.classList.remove('lb-open');
  }

  function go(d) {
    if (!lbPhotos || lbPhotos.length < 2) return;
    lbIndex = (lbIndex + d + lbPhotos.length) % lbPhotos.length;
    renderPhoto();
  }

  lb.addEventListener('click', function (e) {
    if (e.target.closest('img.lb-box')) { setZoom(!lbZoomed); return; }
    if (e.target.closest('.lb-nav')) { go(e.target.closest('.lb-next') ? 1 : -1); return; }
    if (e.target.closest('.lb-grid-btn')) { setGrid(!lb.classList.contains('lb-grid-mode')); return; }
    if (e.target.closest('.lb-thumbs')) return;   // clicks on the sheet's white space
    closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowRight') go(1);
    else if (e.key === 'ArrowLeft') go(-1);
  });

  // scrolling inside the lightbox walks the project (the sheet scrolls itself)
  var wheelAt = 0;
  lb.addEventListener('wheel', function (e) {
    if (lb.classList.contains('lb-grid-mode') || lbZoomed) return;
    e.preventDefault();
    var now = Date.now();
    if (now - wheelAt < 350 || Math.abs(e.deltaY) < 8) return;
    wheelAt = now;
    go(e.deltaY > 0 ? 1 : -1);
  }, { passive: false });

  window.addEventListener('resize', function () {
    if (!lb.hidden && lbPhotos && !lbZoomed) renderPhoto();
  });
  window.AQ = { openLightbox: openLightbox, version: function () { return current; } };

  document.addEventListener('DOMContentLoaded', function () {
    document.body.appendChild(widget);
    document.body.appendChild(lb);
    apply(current);

    // Anything marked data-lb opens the lightbox
    document.querySelectorAll('[data-lb]').forEach(function (el) {
      el.addEventListener('click', function () {
        // X has no lightbox at all; in A the landing photo is background
        if (current === 'x') return;
        if (current === 'a' && el.classList.contains('hero')) return;
        var ratio;
        if (el.tagName === 'IMG' && el.naturalWidth) {
          ratio = el.naturalWidth / el.naturalHeight;
        } else {
          var r = (getComputedStyle(el).aspectRatio || '').split('/');
          ratio = r.length === 2 ? parseFloat(r[0]) / parseFloat(r[1])
                                 : el.offsetWidth / el.offsetHeight;
        }
        openLightbox({
          ratio: ratio,
          caption: el.dataset.lb,
          src: el.tagName === 'IMG' ? el.src : null
        });
      });
    });
  });
})();
