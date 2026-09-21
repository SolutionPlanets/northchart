/* ============================================================
   Northchart — site configuration and tracking
   ------------------------------------------------------------
   THIS IS THE ONLY FILE YOU NEED TO EDIT TO GO LIVE.
   Change the three values below. Nothing else in the site
   needs touching.
   ============================================================ */

/* 1. Google Analytics 4 Measurement ID.
      Find it: analytics.google.com -> Admin -> Data streams ->
      your web stream -> "Measurement ID" (looks like G-ABC123XYZ).
      Until you paste a real ID here, analytics simply stays off. */
var GA_MEASUREMENT_ID = 'G-PZP921XNSC';

/* 2. Your Cal.com booking link for the free referral audit.
      Example: 'https://cal.com/foram-doshi/referral-audit'
      Until you paste a real link here, every "book" button
      falls back to the contact form further down the page. */
var CAL_BOOKING_URL = 'https://cal.com/foram-doshi/audit-call?overlayCalendar=true';

/* 3. Your practice-facing phone number, digits only for the
      dial link, and how you want it displayed.
      Leave both empty to hide the phone number entirely. */
var PHONE_DIAL = '+13468295870';
var PHONE_DISPLAY = '(346) 829-5870';

/* ============================================================
   Nothing below here needs editing.
   ============================================================ */
(function () {
  'use strict';

  var configured = GA_MEASUREMENT_ID && GA_MEASUREMENT_ID.indexOf('XXXX') === -1;

  /* ---- Google Analytics 4 ---- */
  if (configured) {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID);
  }

  function track(name, params) {
    if (window.gtag) { window.gtag('event', name, params || {}); }
  }

  function ready(fn) {
    if (document.readyState !== 'loading') { fn(); }
    else { document.addEventListener('DOMContentLoaded', fn); }
  }

  ready(function () {

    /* ---- Point every booking button at Cal.com ---- */
    /* If CAL_BOOKING_URL is empty the button keeps its fallback
       href (the contact form), so nothing is ever broken. */
    if (CAL_BOOKING_URL) {
      var bookers = document.querySelectorAll('[data-book]');
      for (var i = 0; i < bookers.length; i++) {
        bookers[i].setAttribute('href', CAL_BOOKING_URL);
        bookers[i].setAttribute('target', '_blank');
        bookers[i].setAttribute('rel', 'noopener');
      }
    }

    /* ---- Show the phone number only once it is real ---- */
    var phones = document.querySelectorAll('[data-phone]');
    for (var p = 0; p < phones.length; p++) {
      if (PHONE_DIAL && PHONE_DISPLAY) {
        phones[p].innerHTML = 'Prefer to talk first? <a href="tel:' + PHONE_DIAL +
          '" data-ga="phone_click">' + PHONE_DISPLAY + '</a>';
        phones[p].hidden = false;
      } else {
        phones[p].hidden = true;
      }
    }

    /* ---- Track the clicks that matter ---- */
    document.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('a[data-ga]') : null;
      if (!a) { return; }
      track(a.getAttribute('data-ga'), {
        link_url: a.getAttribute('href') || '',
        link_text: (a.textContent || '').trim().slice(0, 100),
        page: document.title
      });
    });

    /* ---- Track form submissions as leads ---- */
    var forms = document.querySelectorAll('form[data-lead-form]');
    for (var f = 0; f < forms.length; f++) {
      forms[f].addEventListener('submit', function () {
        track('generate_lead', {
          form_name: this.getAttribute('name') || 'audit-request',
          page: document.title
        });
      });
    }

    /* ---- Stamp which page the enquiry came from ---- */
    var srcFields = document.querySelectorAll('input[name="source-page"]');
    for (var q = 0; q < srcFields.length; q++) {
      if (!srcFields[q].value) { srcFields[q].value = document.title; }
    }
  });
})();
