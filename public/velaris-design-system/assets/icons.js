/* Velaris icon hydrator — inlines Ant Outlined SVGs so they recolor via
   `currentColor`. Usage: <span class="vi" data-icon="search"></span>
   Set window.ICON_BASE (default "assets/icons") before this script loads. */
(function () {
  var cache = {};
  function get(u) { return cache[u] || (cache[u] = fetch(u).then(function (r) { return r.text(); })); }
  async function hydrate(root) {
    root = root || document;
    var base = window.ICON_BASE || 'assets/icons';
    var els = root.querySelectorAll('[data-icon]:not([data-icon-done])');
    await Promise.all([].slice.call(els).map(async function (el) {
      var n = el.getAttribute('data-icon');
      try {
        var txt = await get(base + '/' + n + '.svg');
        el.innerHTML = txt;
        var s = el.querySelector('svg');
        if (s) {
          s.removeAttribute('width'); s.removeAttribute('height');
          s.setAttribute('fill', 'currentColor');
          s.style.width = '100%'; s.style.height = '100%'; s.style.display = 'block';
        }
        el.setAttribute('data-icon-done', '');
      } catch (e) { /* ignore */ }
    }));
  }
  window.hydrateIcons = hydrate;
  if (document.readyState !== 'loading') hydrate();
  else document.addEventListener('DOMContentLoaded', function () { hydrate(); });
})();
