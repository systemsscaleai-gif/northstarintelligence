/* ════════════════════════════════════════════════════════════
   NORTH STAR INTELLIGENCE · main.js
   No frameworks. No external dependencies. Deferred load.
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var reduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Scroll reveal ─────────────────────────────────────── */
  var revealEls = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ── Mobile nav with focus management ──────────────────── */
  var ham = document.getElementById('nav-ham');
  var navLinks = document.getElementById('nav-links');
  if (ham && navLinks) {
    ham.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      ham.setAttribute('aria-expanded', String(open));
      if (open) {
        var first = navLinks.querySelector('a');
        if (first) first.focus();
      }
    });
    navLinks.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        navLinks.classList.remove('open');
        ham.setAttribute('aria-expanded', 'false');
        ham.focus();
      }
    });
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navLinks.classList.remove('open');
        ham.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── The Gap Calculator ────────────────────────────────────
     ILLUSTRATIVE MODEL. Assumptions, stated plainly:
     The model assumes an operator-led business leaves 8 percent
     of annual revenue unrealized through slow decisions, missed
     follow-through, and unmeasured outcomes. 8 percent is a
     deliberately conservative illustrative constant, not a
     measurement. The Potential Score exists to replace this
     assumption with the company's real number.
     annualGap  = revenueBandMidpoint * 0.08
     monthlyGap = annualGap / 12
     dailyGap   = annualGap / 365
  ─────────────────────────────────────────────────────────── */
  var GAP_RATE = 0.08;
  var calcSelect = document.getElementById('calc-band');
  var gaugeDaily = document.getElementById('g-daily');
  var gaugeMonthly = document.getElementById('g-monthly');
  var gaugeAnnual = document.getElementById('g-annual');

  function fmt(n) {
    return '$' + Math.round(n).toLocaleString('en-US');
  }

  /* Eased counter. Cockpit instrument, not slot machine:
     one smooth 600ms ease-out sweep, no flicker, no bounce. */
  function sweep(el, from, to) {
    if (reduced) { el.textContent = fmt(to); return; }
    var start = null, DUR = 600;
    function frame(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / DUR, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(from + (to - from) * eased);
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  var prev = { d: 0, m: 0, a: 0 };
  function updateCalc() {
    if (!calcSelect) return;
    var mid = parseFloat(calcSelect.value);
    if (!mid || isNaN(mid)) return;
    var annual = mid * GAP_RATE;
    var monthly = annual / 12;
    var daily = annual / 365;
    sweep(gaugeDaily, prev.d, daily);
    sweep(gaugeMonthly, prev.m, monthly);
    sweep(gaugeAnnual, prev.a, annual);
    prev = { d: daily, m: monthly, a: annual };
  }
  if (calcSelect) {
    calcSelect.addEventListener('change', updateCalc);
    updateCalc(); /* render initial band on load */
  }

  /* ── Founding cohort form ──────────────────────────────── */
  var form = document.getElementById('cohort-form');
  if (form) {
    var successBox = document.getElementById('form-ok');
    var errorBox = document.getElementById('form-err');
    var submitBtn = document.getElementById('form-submit');

    function setInvalid(field, invalid) {
      var wrap = field.closest('.f-field');
      if (!wrap) return;
      wrap.classList.toggle('invalid', invalid);
      field.setAttribute('aria-invalid', invalid ? 'true' : 'false');
    }

    function validate() {
      var ok = true;
      form.querySelectorAll('[required]').forEach(function (field) {
        var bad = !field.value.trim();
        if (field.type === 'email' && !bad) {
          bad = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
        }
        setInvalid(field, bad);
        if (bad) ok = false;
      });
      return ok;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      errorBox.hidden = true;

      /* Honeypot: bots fill hidden fields, humans cannot */
      var hp = form.querySelector('input[name="company_website"]');
      if (hp && hp.value) return;

      if (!validate()) {
        var firstBad = form.querySelector('.invalid input, .invalid textarea, .invalid select');
        if (firstBad) firstBad.focus();
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting…';

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      }).then(function (r) {
        if (!r.ok) throw new Error('submit failed');
        form.hidden = true;
        successBox.hidden = false;
        successBox.focus();
      }).catch(function () {
        errorBox.hidden = false;
        submitBtn.disabled = false;
        submitBtn.textContent = 'Apply for the Founding Cohort';
      });
    });
  }
})();
