/* Northchart — home hero: cycles through the six solutions, typing each title.
   With reduced motion the title appears at once and nothing auto-advances. */
(function () {
  'use strict';
  var caps = ['Get patients in the door', 'Keep the schedule full', 'Grow online reputation',
    'Free up doctor\u2019s time', 'Get paid faster', 'Run the practice safely'];
  var stage = document.querySelector('.stage');
  if (!stage) { return; }
  var sc = stage.querySelectorAll('.sc'), ct = document.getElementById('ct'), cg = document.getElementById('cg'),
      dots = document.getElementById('dots'), i = 0, t = null, tt = null;
  var rm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  caps.forEach(function (c, k) {
    var b = document.createElement('button');
    b.type = 'button'; b.setAttribute('aria-label', c);
    b.addEventListener('click', function () { go(k); start(); });
    dots.appendChild(b);
  });

  function typeIt(x) {
    cg.textContent = x;
    if (tt) { clearInterval(tt); tt = null; }
    if (rm) { ct.textContent = x; return; }
    ct.textContent = '';
    var k = 0;
    tt = setInterval(function () {
      k++; ct.textContent = x.slice(0, k);
      if (k >= x.length) { clearInterval(tt); tt = null; }
    }, 55);
  }
  function go(n) {
    i = n;
    for (var k = 0; k < sc.length; k++) {
      sc[k].classList.toggle('on', k === n);
      dots.children[k].setAttribute('aria-current', k === n ? 'true' : 'false');
    }
    typeIt(caps[n]);
  }
  function stop() { if (t) { clearInterval(t); t = null; } }
  function start() {
    stop(); if (rm) { return; }
    t = setInterval(function () { go((i + 1) % caps.length); }, 3600);
  }
  stage.addEventListener('mouseenter', stop);
  stage.addEventListener('mouseleave', start);
  go(0); start();
})();
