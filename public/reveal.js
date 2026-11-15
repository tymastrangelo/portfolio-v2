// Entrances (styles in app/site.css under "Entrances"). Loaded by a plain
// <script> at the end of <body> in app/layout.tsx, so it runs as soon as the
// page's HTML has arrived, without waiting for React to hydrate: content is
// never held hidden behind the JS bundle. Blocks on screen when a page lands
// materialize in top to bottom, 70ms apart; blocks further down do the same
// once as they come into view. One MutationObserver picks up everything
// client navigation and the projects filter add later.
;(function () {
  var root = document.documentElement
  if (!root.classList.contains('reveal-on')) return

  // Keep in step with the selector list in app/site.css
  var SELECTOR = [
    '.project-head > :not(.project-title):not(.drill-title)',
    '.section-head',
    '.intro > *',
    '.work-card',
    '.role',
    '.photo-row-item',
    '.say-hi-block',
    '.albums > li',
    '.album-frame',
    '.project-section',
    '.gallery > *',
    '.reel',
    '.next-project',
  ].join(', ')

  var watched = new WeakSet()
  var io = new IntersectionObserver(
    function (entries) {
      var arriving = entries
        .filter(function (e) {
          return e.isIntersecting
        })
        .map(function (e) {
          return e.target
        })
        .sort(function (a, b) {
          var ra = a.getBoundingClientRect()
          var rb = b.getBoundingClientRect()
          return ra.top - rb.top || ra.left - rb.left
        })
      arriving.forEach(function (el, i) {
        el.style.setProperty('--reveal-delay', Math.min(i, 6) * 70 + 'ms')
        el.classList.add('is-in')
        io.unobserve(el)
      })
    },
    { rootMargin: '0px 0px -6% 0px', threshold: 0.08 }
  )

  function scan() {
    document.querySelectorAll(SELECTOR).forEach(function (el) {
      if (watched.has(el) || el.classList.contains('is-in')) return
      watched.add(el)
      io.observe(el)
    })
  }

  var queued = false
  function queueScan() {
    if (queued) return
    queued = true
    requestAnimationFrame(function () {
      queued = false
      scan()
    })
  }

  window.__revealReady = true
  scan()
  new MutationObserver(queueScan).observe(document.body, { childList: true, subtree: true })
})()
