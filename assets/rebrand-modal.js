/* First-visit rebrand notice: "EZ Loader TMS is now EZ TMS". Shows once per visitor
   (remembered in localStorage), reusing the .demo-modal chrome for the dimmed, blurred
   backdrop and the pop-in dialog. Injected on every page; the localStorage flag keeps
   it to a single appearance across the whole site. */
(function () {
  var KEY = 'ez_rebrand_seen';
  try { if (localStorage.getItem(KEY)) return; } catch (e) { return; }

  var modal = document.createElement('div');
  modal.className = 'demo-modal rebrand-modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML =
    '<div class="demo-overlay" data-close></div>' +
    '<div class="demo-dialog rebrand-dialog" role="dialog" aria-modal="true" aria-labelledby="rebrandTitle">' +
      '<span class="rebrand-bar" aria-hidden="true"></span>' +
      '<div class="rebrand-body">' +
        '<div class="rebrand-logos">' +
          '<img class="rebrand-old" src="assets/rebrand-old.png" alt="EZ Loader TMS logo" />' +
          '<svg class="rebrand-arrow" viewBox="0 0 48 12" aria-hidden="true">' +
            '<path d="M0 6H40M34 1l7 5-7 5" fill="none" stroke="#ef151a" stroke-width="2" ' +
            'stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          '<img class="rebrand-new" src="assets/rebrand-new.png" alt="EZ TMS logo" />' +
        '</div>' +
        '<h2 id="rebrandTitle" class="rebrand-title">' +
          '<span class="rl-1">EZ Loader TMS is now</span>' +
          '<span class="rl-2">EZ TMS</span>' +
        '</h2>' +
        '<a class="rebrand-link" href="blog-founders-message.html">Read a message from the founders</a>' +
        '<button type="button" class="btn-outline rebrand-btn" data-close>Got it</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(modal);

  var btn = modal.querySelector('.rebrand-btn');
  var link = modal.querySelector('.rebrand-link');
  var lastFocus = null;

  // reading the founders' message counts as seeing the notice — don't pop it again
  link.addEventListener('click', function () {
    try { localStorage.setItem(KEY, '1'); } catch (e) {}
  });

  function open() {
    lastFocus = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    btn.focus();
  }
  function dismiss() {
    try { localStorage.setItem(KEY, '1'); } catch (e) {}
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
    setTimeout(function () { modal.remove(); }, 240);
  }

  modal.addEventListener('click', function (e) {
    if (e.target.hasAttribute('data-close')) dismiss();
  });
  document.addEventListener('keydown', function (e) {
    if (!modal.classList.contains('is-open')) return;
    if (e.key === 'Escape') dismiss();
    if (e.key === 'Tab') {                                        // trap between link and button
      e.preventDefault();
      (document.activeElement === btn ? link : btn).focus();
    }
  });

  // let the page paint first, then present the notice
  setTimeout(open, 450);
})();
