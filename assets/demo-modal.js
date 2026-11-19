/* Demo request modal. Injected once per page; every "Request a Demo" button opens it.
   The form itself is the HubSpot embed (rendered inline into the dialog on first open,
   then restyled via CSS to match the site). Submissions go straight to HubSpot. */
(function () {
  var HS = { portalId: '7348614', formId: '457a5429-3d74-43af-8845-0731544be4e2', region: 'na1' };
  var SRC = 'https://js.hsforms.net/forms/embed/v2.js';

  var modal = document.createElement('div');
  modal.className = 'demo-modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML =
    '<div class="demo-overlay" data-close></div>' +
    '<div class="demo-dialog" role="dialog" aria-modal="true" aria-labelledby="demoTitle">' +
      '<button class="demo-close" type="button" aria-label="Close" data-close>&times;</button>' +
      '<h2 id="demoTitle" class="demo-title">Request a <span class="r">demo.</span></h2>' +
      '<div class="demo-formhost" id="hsDemoForm"><p class="demo-loading">Loading the form&hellip;</p></div>' +
    '</div>';
  document.body.appendChild(modal);

  var dialog = modal.querySelector('.demo-dialog');
  var host = modal.querySelector('#hsDemoForm');
  var lastFocus = null, formRequested = false;

  function loadScript(cb) {
    if (window.hbspt && window.hbspt.forms) return cb();
    var existing = document.querySelector('script[data-hsforms]');
    if (existing) { existing.addEventListener('load', cb); return; }
    var s = document.createElement('script');
    s.src = SRC; s.async = true; s.setAttribute('data-hsforms', '');
    s.onload = cb;
    document.head.appendChild(s);
  }

  function ensureForm() {
    if (formRequested) return;
    formRequested = true;
    loadScript(function tryCreate() {
      if (!(window.hbspt && window.hbspt.forms)) { setTimeout(tryCreate, 60); return; }
      host.innerHTML = '';
      window.hbspt.forms.create({
        portalId: HS.portalId, formId: HS.formId, region: HS.region,
        target: '#hsDemoForm', css: '',
        onFormSubmitted: function () {
          // Google Ads lead conversion — fires only on a real form submission
          if (typeof gtag === 'function') {
            gtag('event', 'conversion', {
              'send_to': 'AW-18584895014/qGKfCIrszLsdEKb8-51F',
              'value': 1.0,
              'currency': 'USD'
            });
          }
        }
      });
    });
  }

  function open(e) {
    if (e) e.preventDefault();
    lastFocus = document.activeElement;
    ensureForm();
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var first = dialog.querySelector('input, select, textarea');
    if (first) first.focus();
  }
  function close() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  modal.addEventListener('click', function (e) {
    if (e.target.hasAttribute('data-close')) close();
  });
  document.addEventListener('keydown', function (e) {
    if (!modal.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') trapTab(e);
  });
  function trapTab(e) {
    var f = dialog.querySelectorAll('button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])');
    f = Array.prototype.filter.call(f, function (el) { return el.offsetParent !== null; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  Array.prototype.forEach.call(document.querySelectorAll('a'), function (a) {
    if (/request a demo/i.test((a.textContent || '').trim())) a.addEventListener('click', open);
  });
})();
