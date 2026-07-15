
<!-- Fonts -->
<!--
<link href="https://api.fontshare.com/v2/css?f[]=general-sans@300,400,401,500,501,600, 700&display=swap" rel="stylesheet">
-->


<!-- Primary Font -->
<link href="https://api.fontshare.com/v2/css?f[]=supreme@300,400,401,500,501,700&amp;f[]=archivo@300,400,401,500,501,600,700&amp;display=swap" rel="stylesheet">

<!-- Secondary Font -->
<link href="https://api.fontshare.com/v2/css?f[]=work-sans@300,400,401,500,501,600,700&amp;display=swap" rel="stylesheet"> 


<!-- other Secondary -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
<link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&amp;display=swap" rel="stylesheet">

<!-- Google tag (gtag.js) -->
<script async="" src="https://www.googletagmanager.com/gtag/js?id=G-GKV9HGX94Y"></script>

<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-GKV9HGX94Y');
</script>

<!-- Performative img rendering -->

<script>
(function () {
  var FROM = '/t/original/';
  var TO   = '/w/1500/';   // 1500px wide, Cargo default quality (q95)

  function fix(img) {
    if (!img || img.tagName !== 'IMG') return;
    var ds = img.getAttribute('data-src');
    if (ds && ds.indexOf(FROM) > -1) {
      img.setAttribute('data-src', ds.replace(FROM, TO));
    }
    if (img.src && img.src.indexOf(FROM) > -1) {
      img.src = img.src.replace(FROM, TO);
    }
  }

  function sweep(root) {
    (root || document).querySelectorAll('img').forEach(fix);
  }

  sweep();

  var mo = new MutationObserver(function (muts) {
    muts.forEach(function (m) {
      if (m.type === 'attributes' && m.target.tagName === 'IMG') fix(m.target);
      m.addedNodes && m.addedNodes.forEach(function (n) {
        if (n.nodeType !== 1) return;
        if (n.tagName === 'IMG') fix(n);
        else if (n.querySelectorAll) sweep(n);
      });
    });
  });

  mo.observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['data-src', 'src']
  });
})();
</script>


<!-- Handles exclusive toggle, auto-open of the current page's group and rebinding when the menu re-opens. -->

<script>
(function(){
  var mq = window.matchMedia("(max-height: 1400px)");
  function groups(){ return Array.prototype.slice.call(
    document.querySelectorAll("#site_menu .set-link .set-link")); }
  function closeAll(except){ groups().forEach(function(g){
    if(g!==except) g.classList.remove("acc-open"); }); }

  // Delegated click — works no matter when Cargo renders the menu
  document.addEventListener("click", function(e){
    if(!mq.matches) return;
    var span = e.target.closest && e.target.closest("#site_menu .set-link .set-link > span");
    if(!span) return;
    var g = span.parentElement;
    e.preventDefault(); e.stopPropagation();
    var open = g.classList.contains("acc-open");
    closeAll(null);
    if(!open) g.classList.add("acc-open");
  }, true);

  // Auto-open the current page's group when the menu renders
  function autoOpen(){
    if(!mq.matches) return;
    var gs = groups();
    if(!gs.length) return;
    if(gs.some(function(g){ return g.classList.contains("acc-open"); })) return;
    var active = document.querySelector("#site_menu a.active");
    var target = active ? active.closest(".set-link .set-link") : null;
    if(target) target.classList.add("acc-open");
  }
  var stable = document.querySelector("#site_menu_wrapper") || document.body;
  new MutationObserver(autoOpen).observe(stable, { childList: true, subtree: true });
  autoOpen();
})();
</script>



<!-- Remove auto link tags for menu items -->

<!-- Menu: replace set-link <a> with <span> + mobile accordion -->
<script>
(function () {
  // Replace set-link <a> labels with <span> (no navigation), then
  // delegate accordion toggling so it survives Cargo's menu rebuilds.
  function replaceLabels() {
    var sels = [
      '#site_menu > .set-link > a',
      '#site_menu > .set-link > .indent > .set-link > a'
    ];
    sels.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (a) {
        var span = document.createElement('span');
        span.innerHTML = a.innerHTML;
        span.className = a.className;
        a.parentNode.replaceChild(span, a);
      });
    });
  }

  var mo = new MutationObserver(function () { replaceLabels(); });
  mo.observe(document.documentElement, { childList: true, subtree: true });
  replaceLabels();

  // ONE delegated handler — bound once, never cloned, timing-independent.
  document.addEventListener('click', function (e) {
    if (!document.body.classList.contains('mobile')) return;
var menu = document.getElementById('site_menu_wrapper') || document.getElementById('site_menu_panel_container');
if (!menu) return;

    var label = e.target.closest('.set-link > span, .set-link > a');
    if (!label || !menu.contains(label)) return;

    var setLink = label.parentElement;
    if (!setLink.querySelector(':scope > .indent')) return;

    e.preventDefault();
    e.stopPropagation();

    setLink.parentElement
      .querySelectorAll(':scope > .set-link.accordion-open')
      .forEach(function (sib) { if (sib !== setLink) sib.classList.remove('accordion-open'); });

    setLink.classList.toggle('accordion-open');
  }, true);
})();
</script>


<script>
(function () {
  // MOBILE: Cargo rebuilds #site_menu from scratch each time the menu opens,
  // collapsing every accordion. When the menu opens we re-expand the path of
  // sections leading to the currently active link, so the visitor lands where
  // they left off instead of having to re-navigate the whole tree.
  //
  // We add the same `accordion-open` class the manual toggle uses, so the +/-
  // indicators stay in sync. This is button-driven with a short bounded poll
  // (no global MutationObserver) to avoid any observer feedback loops.
  function expandActiveSection() {
    if (!document.body.classList.contains('mobile')) return false;
    var menu = document.getElementById('site_menu_wrapper') || document.getElementById('site_menu_panel_container');
if (!menu) return false;
    var active = menu.querySelector('a.active');
    if (!active) return false;
    var el = active.parentElement;
    while (el && el.id !== 'site_menu') {
      if (el.classList && el.classList.contains('set-link')) {
        el.classList.add('accordion-open');
      }
      el = el.parentElement;
    }
    return true;
  }

  // Poll briefly until the freshly-rebuilt menu is populated, then stop.
  function runWhenReady() {
    var tries = 0;
    var timer = setInterval(function () {
      tries++;
      if (expandActiveSection() || tries > 30) clearInterval(timer);
    }, 50);
  }

  // The menu button re-renders #site_menu on each open, so react to its click.
  document.addEventListener('click', function (e) {
    var btn = e.target && e.target.closest && e.target.closest('#site_menu_button');
    if (btn) runWhenReady();
  }, true);

  // Cover the case where the menu is already present on load.
  if (document.readyState !== 'loading') runWhenReady();
  else document.addEventListener('DOMContentLoaded', runWhenReady);
})();
</script>
</span></a>