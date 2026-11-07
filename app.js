(function () {
  'use strict';
  /* menu mobilne */
  var burger = document.querySelector('.burger');
  var menu = document.getElementById('menu-mob');
  function zamknij() { menu.hidden = true; burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Otwórz menu'); }
  burger.addEventListener('click', function () {
    var otw = menu.hidden;
    menu.hidden = !otw;
    burger.setAttribute('aria-expanded', String(otw));
    burger.setAttribute('aria-label', otw ? 'Zamknij menu' : 'Otwórz menu');
  });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) zamknij(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) { zamknij(); burger.focus(); } });
  window.addEventListener('resize', function () { if (window.innerWidth > 1180 && !menu.hidden) zamknij(); });

  /* aktywna pozycja menu */
  var linki = document.querySelectorAll('.nav a');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (wpisy) {
      wpisy.forEach(function (w) {
        if (!w.isIntersecting) return;
        linki.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + w.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { io.observe(s); });
    var hero = document.querySelector('.hero');
    var heroIo = new IntersectionObserver(function (w) { if (w[0].isIntersecting) linki.forEach(function (a) { a.classList.remove('on'); }); }, { rootMargin: '-45% 0px -50% 0px' });
    heroIo.observe(hero);

    /* dolny pasek po przewinięciu za przycisk w hero */
    var mob = document.querySelector('.mob');
    var btn = document.querySelector('.btn-hero');
    var kontakt = document.getElementById('kontakt');
    var zaHero = false, wKontakcie = false;
    function pasek() { var on = zaHero && !wKontakcie; mob.classList.toggle('widac', on); mob.setAttribute('aria-hidden', String(!on)); mob.querySelectorAll('a').forEach(function (a) { a.tabIndex = on ? 0 : -1; }); }
    new IntersectionObserver(function (w) { zaHero = !w[0].isIntersecting && w[0].boundingClientRect.top < 0; pasek(); }).observe(btn);
    new IntersectionObserver(function (w) { wKontakcie = w[0].isIntersecting; pasek(); }, { rootMargin: '0px 0px -30% 0px' }).observe(kontakt);
  }

  /* tor realizacji: palec, mysz, strzałki */
  document.querySelectorAll('[data-tor]').forEach(function (wrap) {
    var tor = wrap.querySelector('.tor');
    var strz = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
    var nav = document.createElement('div'); nav.className = 'tor-nav';
    var l = document.createElement('button'); l.type = 'button'; l.className = 'tor-btn'; l.innerHTML = strz; l.setAttribute('aria-label', 'Poprzednie realizacje');
    var p = document.createElement('button'); p.type = 'button'; p.className = 'tor-btn'; p.innerHTML = strz.replace('M15 5l-7 7 7 7', 'M9 5l7 7-7 7'); p.setAttribute('aria-label', 'Następne realizacje');
    nav.appendChild(l); nav.appendChild(p); wrap.appendChild(nav);
    function krok() { var k = tor.querySelector('.karta'); return k ? k.getBoundingClientRect().width + 22 : 300; }
    function stan() { l.disabled = tor.scrollLeft < 8; p.disabled = tor.scrollLeft + tor.clientWidth > tor.scrollWidth - 8; }
    l.addEventListener('click', function () { tor.scrollBy({ left: -krok(), behavior: 'smooth' }); });
    p.addEventListener('click', function () { tor.scrollBy({ left: krok(), behavior: 'smooth' }); });
    tor.addEventListener('scroll', stan, { passive: true });
    window.addEventListener('resize', stan);
    stan();
    /* przeciąganie myszą */
    var x0 = null, s0 = 0, ruch = false;
    tor.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') return; x0 = e.clientX; s0 = tor.scrollLeft; ruch = false; });
    window.addEventListener('pointermove', function (e) {
      if (x0 === null) return;
      var dx = e.clientX - x0;
      if (!ruch && Math.abs(dx) > 5) { ruch = true; tor.classList.add('ciag'); }
      if (ruch) { tor.scrollLeft = s0 - dx; e.preventDefault(); }
    });
    window.addEventListener('pointerup', function () {
      if (x0 === null) return;
      x0 = null;
      if (ruch) {
        tor.classList.remove('ciag');
        var k = krok(); tor.scrollTo({ left: Math.round(tor.scrollLeft / k) * k, behavior: 'smooth' });
      }
    });
    tor.addEventListener('click', function (e) { if (ruch) { e.preventDefault(); e.stopPropagation(); ruch = false; } }, true);
    tor.addEventListener('dragstart', function (e) { e.preventDefault(); });
    tor.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { tor.scrollBy({ left: krok(), behavior: 'smooth' }); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { tor.scrollBy({ left: -krok(), behavior: 'smooth' }); e.preventDefault(); }
    });
  });

  /* formularz pokazowy */
  var form = document.getElementById('form');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var info = form.querySelector('.form-info');
    if (!form.n.value.trim() || !form.k.value.trim()) { info.textContent = 'Proszę podać imię lub firmę oraz telefon albo e-mail.'; return; }
    info.textContent = 'To podgląd strony - w gotowej wersji zapytanie trafi na biuro@inntech.com.pl.';
  });
})();
