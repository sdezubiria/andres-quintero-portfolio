// Version widget — lets the client flip between design options A / B / C.
// The choice persists across pages (localStorage) and is shareable via ?v= in the URL.
(function () {
  var VERSIONS = ['a', 'b', 'c'];
  var param = new URLSearchParams(location.search).get('v');
  var current = VERSIONS.includes(param) ? param : (localStorage.getItem('aq-version') || 'a');

  function apply(v) {
    current = v;
    document.body.dataset.v = v;
    localStorage.setItem('aq-version', v);
    document.querySelectorAll('.vwidget button').forEach(function (b) {
      b.classList.toggle('active', b.dataset.v === v);
    });
    // keep ?v= in the address bar so the link can be shared
    var url = new URL(location.href);
    url.searchParams.set('v', v);
    history.replaceState(null, '', url);
    // carry the version across internal links
    document.querySelectorAll('a[href$=".html"], a[href^="index"], a[href^="work"], a[href^="about"]').forEach(function (a) {
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

  document.addEventListener('DOMContentLoaded', function () {
    document.body.appendChild(widget);
    apply(current);
  });
})();
