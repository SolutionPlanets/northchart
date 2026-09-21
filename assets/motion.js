/* Northchart — small progressive enhancements.
   Reveal-on-scroll, sticky header shadow, mobile nav, reading
   progress, and number count-ups. Nothing here is required for
   the site to work: with JavaScript off every element is visible
   and every link still works. Tracking lives in site.js. */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  root.classList.add('js');

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Reveal on scroll */
  var targets = d.querySelectorAll('[data-reveal],[data-reveal-stagger]');
  if (reduce || !('IntersectionObserver' in window)) {
    for (var i = 0; i < targets.length; i++) { targets[i].classList.add('in'); }
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    for (var j = 0; j < targets.length; j++) { io.observe(targets[j]); }
  }

  /* Header shadow once the page scrolls */
  var header = d.querySelector('header');
  var progress = d.querySelector('.progress');
  function onScroll() {
    var y = window.scrollY || root.scrollTop;
    if (header) { header.classList.toggle('scrolled', y > 8); }
    if (progress) {
      var max = root.scrollHeight - window.innerHeight;
      progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile navigation */
  var toggle = d.querySelector('.navtoggle');
  var links = d.querySelector('.navlinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { links.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
    });
    d.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('open')) {
        links.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); toggle.focus();
      }
    });
  }

  /* Count-up numbers: <span data-count="6">6</span> */
  var counters = d.querySelectorAll('[data-count]');
  if (counters.length && !reduce && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) { return; }
        cio.unobserve(en.target);
        var el = en.target, end = parseInt(el.getAttribute('data-count'), 10) || 0;
        var start = null, dur = 900;
        function tick(ts) {
          if (!start) { start = ts; }
          var p = Math.min(1, (ts - start) / dur), eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(end * eased);
          if (p < 1) { requestAnimationFrame(tick); }
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });
    for (var k = 0; k < counters.length; k++) { cio.observe(counters[k]); }
  }
})();
