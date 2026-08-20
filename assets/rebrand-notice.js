/* EZ TMS rebrand notice — FOR THE OLD SITE (ezloadertms.com, built on Flypaper).
   Self-contained: injects its own styles + markup, loads images/fonts from the
   new site, and needs nothing from the host page. Install by pasting ONE tag
   into Flypaper's custom-scripts / tracking-code area:

     <script async src="https://www.ez-tms.com/assets/rebrand-notice.js"></script>

   Shows once per browser session. Primary button sends visitors to the new
   site (UTM-tagged); "Continue to the old site" dismisses. */
(function () {
  var KEY = 'eztms_rebrand_notice';
  try { if (sessionStorage.getItem(KEY)) return; } catch (e) {}

  // resolve asset URLs from wherever this script was loaded (works on any host)
  var script = document.currentScript || (function () {
    var s = document.getElementsByTagName('script');
    return s[s.length - 1];
  })();
  var BASE = (script && script.src) ? script.src.replace(/\/assets\/[^/]*$/, '') : 'https://www.ez-tms.com';
  var NEW_SITE = 'https://www.ez-tms.com/?utm_source=ezloadertms&utm_medium=popup&utm_campaign=rebrand';

  var css =
    '@font-face{font-family:"EZ Momo Trust Display";src:url("' + BASE + '/assets/fonts/Momo_Trust_Display/MomoTrustDisplay-Regular.ttf") format("truetype");font-weight:400;font-style:normal;font-display:swap}' +
    '.eztms-rn{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;font-family:system-ui,-apple-system,"Segoe UI",sans-serif}' +
    '.eztms-rn *{box-sizing:border-box;margin:0;padding:0}' +
    '.eztms-rn img{max-width:none;max-height:none;border:none;box-shadow:none;background:none;display:inline-block}' +
    '.eztms-rn-overlay{position:absolute;inset:0;background:rgba(8,12,25,.62)}' +
    '.eztms-rn-dialog{position:relative;z-index:1;width:calc(100% - 32px);max-width:560px;max-height:92vh;overflow-y:auto;background:#fff;color:#0a1225;border-radius:22px;padding:0;text-align:center;box-shadow:0 30px 80px rgba(5,8,20,.45);animation:eztmsRnPop .22s ease;overflow:hidden}' +
    '@keyframes eztmsRnPop{from{opacity:0;transform:translateY(14px) scale(.98)}to{opacity:1;transform:none}}' +
    '.eztms-rn-bar{display:block;height:8px;background:#ef151a}' +
    '.eztms-rn-body{padding:42px 46px 40px}' +
    '.eztms-rn-logos{display:flex;align-items:center;justify-content:center;gap:20px;margin-bottom:30px}' +
    '.eztms-rn-old{height:24px;width:auto}' +
    '.eztms-rn-new{height:32px;width:auto}' +
    '.eztms-rn-arrow{width:44px;height:12px;flex:0 0 auto}' +
    '.eztms-rn-title{font-family:"EZ Momo Trust Display","Arial Narrow",system-ui,sans-serif;font-weight:400;text-transform:uppercase;line-height:1.04;letter-spacing:-.01em;margin:0 0 28px}' +
    '.eztms-rn-l1{display:block;font-size:26px;color:#182954}' +
    '.eztms-rn-l2{display:block;font-size:48px;color:#ef151a;margin-top:4px}' +
    '.eztms-rn-cta{display:inline-block;background:#ef151a;color:#fff;border:2px solid #ef151a;border-radius:6px;font-weight:700;text-transform:uppercase;font-size:15px;letter-spacing:.04em;padding:13px 26px;text-decoration:none;cursor:pointer;transition:background .15s,color .15s}' +
    '.eztms-rn-cta:hover{background:#c90f13;border-color:#c90f13;color:#fff}' +
    '.eztms-rn-stay{display:block;margin:18px auto 0;background:none;border:none;font-size:13px;color:#9aa3bd;text-decoration:underline;cursor:pointer}' +
    '.eztms-rn-stay:hover{color:#182954}' +
    '@media (max-width:560px){.eztms-rn-body{padding:34px 24px 30px}.eztms-rn-logos{gap:14px;margin-bottom:24px}.eztms-rn-old{height:21px}.eztms-rn-new{height:28px}.eztms-rn-l1{font-size:20px}.eztms-rn-l2{font-size:36px}}';

  var modal = document.createElement('div');
  modal.className = 'eztms-rn';
  modal.setAttribute('aria-hidden', 'false');
  modal.innerHTML =
    '<div class="eztms-rn-overlay" data-eztms-close></div>' +
    '<div class="eztms-rn-dialog" role="dialog" aria-modal="true" aria-labelledby="eztmsRnTitle">' +
      '<span class="eztms-rn-bar" aria-hidden="true"></span>' +
      '<div class="eztms-rn-body">' +
        '<div class="eztms-rn-logos">' +
          '<img class="eztms-rn-old" src="' + BASE + '/assets/rebrand-old.png" alt="EZ Loader TMS logo" />' +
          '<svg class="eztms-rn-arrow" viewBox="0 0 48 12" aria-hidden="true">' +
            '<path d="M0 6H40M34 1l7 5-7 5" fill="none" stroke="#ef151a" stroke-width="2" ' +
            'stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          '<img class="eztms-rn-new" src="' + BASE + '/assets/rebrand-new.png" alt="EZ TMS logo" />' +
        '</div>' +
        '<h2 id="eztmsRnTitle" class="eztms-rn-title">' +
          '<span class="eztms-rn-l1">EZ Loader TMS is now</span>' +
          '<span class="eztms-rn-l2">EZ TMS</span>' +
        '</h2>' +
        '<a class="eztms-rn-cta" href="' + NEW_SITE + '">Visit the new site</a>' +
        '<button type="button" class="eztms-rn-stay" data-eztms-close>Continue to the old site</button>' +
      '</div>' +
    '</div>';

  function mount() {
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    document.body.appendChild(modal);
    var cta = modal.querySelector('.eztms-rn-cta');
    if (cta) cta.focus();
  }

  function seen() { try { sessionStorage.setItem(KEY, '1'); } catch (e) {} }
  function dismiss() {
    seen();
    modal.remove();
  }

  modal.addEventListener('click', function (e) {
    if (e.target.hasAttribute('data-eztms-close')) dismiss();
  });
  modal.querySelector('.eztms-rn-cta').addEventListener('click', seen);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.parentNode) dismiss();
  });

  if (document.body) { setTimeout(mount, 450); }
  else document.addEventListener('DOMContentLoaded', function () { setTimeout(mount, 450); });
})();
