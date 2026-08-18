// Temporary debugging aid: open any page with ?debug in the URL and a green
// readout appears with the measurements that matter for the Safari toolbar
// problem. The main layout box is outlined in red so its bottom edge is
// visible against the bar. Remove this file when the prototype settles.
(function () {
  if (!/debug/.test(location.search)) return;
  var el = document.createElement('div');
  el.style.cssText = 'position:fixed;left:8px;top:8px;z-index:9999;background:rgba(0,0,0,.78);color:#4f4;font:10px/1.6 monospace;padding:8px 10px;white-space:pre;pointer-events:none;border-radius:4px';
  function update() {
    var vv = window.visualViewport;
    var target = document.querySelector('.landing') || document.querySelector('main.work') || document.body;
    target.style.outline = '2px solid red';
    target.style.outlineOffset = '-2px';
    var r = target.getBoundingClientRect();
    var os = (navigator.userAgent.match(/OS ([\d_]+)/) || [])[1] || '?';
    el.textContent =
      'innerH      ' + innerHeight +
      '\nvisualVP    ' + (vv ? Math.round(vv.height) + '  top ' + Math.round(vv.offsetTop) : 'n/a') +
      '\nhtml client ' + document.documentElement.clientHeight +
      '\nred box     h ' + Math.round(r.height) + '  bottom ' + Math.round(r.bottom) +
      '\ndvh/lvh     ' + CSS.supports('height', '100dvh') + ' / ' + CSS.supports('height', '100lvh') +
      '\nscreen      ' + screen.width + 'x' + screen.height +
      '\niOS         ' + os.replace(/_/g, '.');
  }
  document.addEventListener('DOMContentLoaded', function () {
    document.body.appendChild(el);
    update();
    setInterval(update, 500);
  });
})();
