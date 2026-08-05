// Version widget + shared lightbox.
// The version choice persists across pages (localStorage) and is shareable via ?v=.
(function () {
  var VERSIONS = ['a', 'b', 'c', 'd'];
  var param = new URLSearchParams(location.search).get('v');
  var current = VERSIONS.includes(param) ? param : (localStorage.getItem('aq-version') || 'a');

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
    '<span class="label">Versión</span>' +
    VERSIONS.map(function (v) {
      return '<button data-v="' + v + '">' + v.toUpperCase() + '</button>';
    }).join('');
  widget.addEventListener('click', function (e) {
    if (e.target.dataset.v) apply(e.target.dataset.v);
  });

  // ————— Lightbox —————
  // Opens a placeholder (or a real image) at the largest size that fits the
  // viewport WITHOUT changing its aspect ratio. Sizes are computed in JS so
  // the ratio always wins over the container.
  var lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.hidden = true;
  lb.innerHTML =
    '<span class="lb-close">Cerrar ✕</span>' +
    '<figure>' +
    '  <div class="lb-box ph" hidden></div>' +
    '  <img class="lb-box" hidden alt="">' +
    '  <figcaption></figcaption>' +
    '</figure>';
  var lbState = null;

  function fit(ratio) {
    var v = document.body.dataset.v;
    var maxW = innerWidth * (v === 'b' ? 0.70 : v === 'd' ? 0.92 : 0.88);
    var maxH = innerHeight * (v === 'b' ? 0.72 : v === 'd' ? 0.86 : 0.80);
    var w = maxW, h = w / ratio;
    if (h > maxH) { h = maxH; w = h * ratio; }
    return { w: Math.round(w), h: Math.round(h) };
  }

  function openLightbox(opts) {
    lbState = opts;
    var box = lb.querySelector('div.lb-box');
    var img = lb.querySelector('img.lb-box');
    var cap = lb.querySelector('figcaption');
    var size = fit(opts.ratio || 3 / 2);
    if (opts.src) {
      img.src = opts.src;
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
    cap.textContent = opts.caption || '';
    lb.hidden = false;
  }
  function closeLightbox() { lb.hidden = true; lbState = null; }

  lb.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });
  window.addEventListener('resize', function () {
    if (lbState) openLightbox(lbState);
  });
  window.AQ = { openLightbox: openLightbox, version: function () { return current; } };

  document.addEventListener('DOMContentLoaded', function () {
    document.body.appendChild(widget);
    document.body.appendChild(lb);
    apply(current);

    // Anything marked data-lb opens the lightbox
    document.querySelectorAll('[data-lb]').forEach(function (el) {
      el.addEventListener('click', function () {
        // in version A the landing photo is full-bleed background — no lightbox
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
