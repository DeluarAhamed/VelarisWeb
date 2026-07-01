/* ============================================================================
   VELARIS WEB — shared site chrome (nav + drawer + footer) for every page.
   Include AFTER home-data.js. Pages mark active item via <body data-page="…">.
   ========================================================================== */
(function(){
  'use strict';
  var base = document.body.getAttribute('data-base') || '';
  var page = document.body.getAttribute('data-page') || '';

  window.VelarisInitStack = function(stack){
    if(!stack) return;
    var pin=stack.querySelector('.stack-pin');
    var cards=[].slice.call(stack.querySelectorAll('.stack-card'));
    if(!pin||!cards.length) return;
    var mobile=window.matchMedia('(max-width:680px)');
    var reduced=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    var currentProgress=0, targetProgress=0, frame=0, ready=false;
    function render(progress){
      var active=Math.floor(progress), frac=progress-active;
      var eased=frac*frac*(3-2*frac);
      cards.forEach(function(card,i){
        var y=104, scale=.985;
        if(i<active){ y=0; scale=.982; }
        else if(i===active){ y=0; scale=1-eased*.018; }
        else if(i===active+1){ y=(1-eased)*100; scale=.985+eased*.015; }
        card.style.transform='translate3d(0,'+y+'%,0) scale('+scale+')';
        card.style.pointerEvents=i===active||i===active+1?'auto':'none';
      });
      stack.setAttribute('data-active',String(active));
    }
    function animate(){
      frame=0;
      var delta=targetProgress-currentProgress;
      if(reduced||Math.abs(delta)<.001){ currentProgress=targetProgress; render(currentProgress); return; }
      currentProgress+=delta*.16;
      render(currentProgress);
      frame=requestAnimationFrame(animate);
    }
    function updateTarget(){
      if(mobile.matches){
        cards.forEach(function(card){ card.style.transform='none'; card.style.pointerEvents='auto'; });
        return;
      }
      var distance=Math.max(0,104-stack.getBoundingClientRect().top);
      targetProgress=Math.min(distance/Math.max(window.innerHeight,1),cards.length-1);
      if(!ready){ currentProgress=targetProgress; ready=true; render(currentProgress); return; }
      if(!frame) frame=requestAnimationFrame(animate);
    }
    function layout(){
      if(mobile.matches){
        if(frame) cancelAnimationFrame(frame);
        frame=0; ready=false; stack.style.height='auto'; updateTarget(); return;
      }
      ready=false;
      var pinHeight=pin.getBoundingClientRect().height;
      stack.style.height=((cards.length-1)*window.innerHeight+pinHeight+window.innerHeight*.55)+'px';
      updateTarget();
    }
    window.addEventListener('scroll',updateTarget,{passive:true});
    window.addEventListener('resize',layout);
    window.addEventListener('velaris:chrome',layout);
    if(mobile.addEventListener) mobile.addEventListener('change',layout);
    layout();
  };

  /* gradient logo mark (from brand SVG) */
  var MARK = '<svg class="mk" width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">'+
    '<rect width="32" height="32" rx="4.57" fill="url(#vlg)"></rect>'+
    '<path d="M16.81 23.58c-.02.12-.05.23-.1.34-.45.96-.83 1.95-1.21 2.94-.03.07-.04.16-.13.18-.11.02-.14-.08-.18-.14-1.8-2.39-3.6-4.78-5.4-7.17-1.64-2.18-3.27-4.37-4.9-6.56l-1.91-2.57c-.02-.02-.04-.05-.06-.08-.03-.05-.09-.09-.05-.15.03-.05.1-.02.15-.01.47.07.95.13 1.42.22 1.04.2 2.06.5 3.05.88 1.36.54 2.39 1.43 3.16 2.68 1.04 1.69 2.14 3.33 3.23 4.99.94 1.42 1.88 2.83 2.82 4.25.05.07.1.13.11.21z" fill="white"></path>'+
    '<path d="M25.79 10.7c-.07.11-.1.12-.16.18-2.2 2.09-4.12 4.45-5.73 7.03-.84 1.35-1.62 2.74-2.34 4.16-.11.22-.14.22-.28.02-.65-.99-1.31-1.97-1.96-2.96-.2-.3-.19-.3.06-.57.92-.99 1.88-1.95 2.9-2.85 1.44-1.28 2.96-2.45 4.6-3.48.81-.52 1.66-.99 2.52-1.42.22-.11.27-.11.39-.12z" fill="white"></path>'+
    '<path d="M21.93 11.83c-.21.12-.37.22-.54.31-1.36.77-2.58 1.73-3.75 2.76-1.04.92-2.01 1.91-2.92 2.96-.13.15-.18.15-.3 0-.37-.5-.7-1.03-1.02-1.56-.09-.15-.06-.23.07-.33 1.88-1.4 3.92-2.51 6.08-3.4.68-.28 1.39-.54 2.1-.74.07-.02.15-.05.27 0z" fill="white"></path>'+
    '<path d="M27.36 7.36c-.02.06-.08.07-.13.08-.38.11-.75.23-1.14.31-.33.07-.53.25-.61.61-.1.43-.23.86-.34 1.29-.01.04-.01.11-.07.1-.05 0-.04-.06-.05-.1-.1-.42-.22-.84-.32-1.26-.08-.35-.26-.57-.6-.64-.4-.08-.79-.19-1.17-.32-.05-.02-.12-.01-.12-.08 0-.06.06-.05.11-.07.4-.12.81-.25 1.22-.35.32-.08.49-.28.56-.6.09-.4.18-.81.28-1.21.02-.07.01-.19.1-.19.09 0 .08.12.1.19.11.41.22.82.31 1.24.07.31.24.48.53.56.41.1.81.23 1.22.35.05.01.11 0 .12.08z" fill="white"></path>'+
    '<defs><linearGradient id="vlg" x1="16" y1="0" x2="16" y2="32" gradientUnits="userSpaceOnUse"><stop stop-color="#2B8B8D"></stop><stop offset=".89" stop-color="#1A283F"></stop></linearGradient></defs></svg>';
  var BRAND = '<a class="brand" href="'+base+'home-figma.html" aria-label="Velaris Web home">'+MARK+'<span class="brand-name">Velaris<span>Web</span></span></a>';
  var LINKEDIN_URL = 'https://www.linkedin.com/in/deluar-ahamed/';
  var LINKEDIN_ICON = base+'home-img/linkedin.png';

  function svcMega(){
    var S = window.VELARIS_SERVICES||[];
    var ic = {code:'<path d="M8 7l-4 5 4 5M16 7l4 5-4 5M13 5l-2 14"/>',spark:'<path d="M12 3l2.5 5 5.5.8-4 3.9 1 5.5L12 21l-5-2.3 1-5.5-4-3.9L10.5 8z"/>',search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/>',mail:'<path d="M3 6l9 7 9-7M3 6v12h18V6"/>',ux:'<path d="M4 16l5-5 4 4 7-8"/><circle cx="4" cy="16" r="1.4"/>',brand:'<circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/>',webflow:'<path d="M3 8l9-4 9 4-9 4-9-4zM3 12l9 4 9-4M3 16l9 4 9-4"/>',framer:'<path d="M6 3h12v6H12zM6 9h6l6 6h-6v6z"/>'};
    var links = S.map(function(s){
      return '<a class="mega-link" href="'+base+'service.html?s='+s.slug+'"><span class="mega-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">'+ic[s.icon]+'</svg></span><span><b>'+s.name+'</b><span>'+s.tagline+'</span></span></a>';
    }).join('');
    return '<div class="mega wide"><div class="mega-inner"><div class="mega-grid">'+links+'</div>'+
      '<div class="mega-foot"><div><b>Not sure what you need?</b><p>Book a free 20-min call and we\'ll map it out.</p></div><a class="btn btn-teal" href="'+base+'pricing.html">See pricing</a></div></div></div>';
  }
  function caseMega(){
    var C = (window.VELARIS_CASES||[]).slice(0,4);
    var icons={hazelwood:'icon-hazelwood.png',navasana:'icon-navasana.png',core:'icon-core.png',bellavista:'icon-bellavista.png',coastal:'icon-coastal.png'};
    var links = C.map(function(c){
      var ic = icons[c.slug] ? base+'home-img/'+icons[c.slug] : base+c.logo;
      return '<a class="mega-link" href="'+base+'case.html?c='+c.slug+'"><span class="mega-ic case-ic"><img src="'+ic+'" alt=""></span><span><b>'+c.client+'</b><span>'+c.sector+'</span></span></a>';
    }).join('');
    return '<div class="mega"><div class="mega-inner"><div class="mega-grid one">'+links+'</div>'+
      '<div class="mega-foot"><div><b>See every project</b><p>Browse the full Velaris portfolio.</p></div><a class="btn btn-teal" href="'+base+'work.html">View all</a></div></div></div>';
  }

  /* mobile drawer accordion sections */
  var CHEV = '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9l6 6 6-6"/></svg>';
  function drawerAcc(label, inner, allHref, allLabel){
    return '<div class="dacc">'+
      '<button class="dl dacc-trig" type="button" aria-expanded="false">'+label+CHEV+'</button>'+
      '<div class="dacc-body"><div class="dacc-inner">'+inner+
      '<a class="dsub dsub-all" href="'+allHref+'" data-close>'+allLabel+' \u2192</a></div></div></div>';
  }
  function svcDrawerLinks(){
    return (window.VELARIS_SERVICES||[]).map(function(s){
      return '<a class="dsub" href="'+base+'service.html?s='+s.slug+'" data-close>'+s.name+'</a>';
    }).join('');
  }
  function caseDrawerLinks(){
    return (window.VELARIS_CASES||[]).slice(0,5).map(function(c){
      return '<a class="dsub" href="'+base+'case.html?c='+c.slug+'" data-close>'+c.client+'</a>';
    }).join('');
  }

  var navHTML =
    '<div class="topbar"><div class="wrap"><span>New — The 2026 Lead Generation Playbook for B2B &amp; B2C founders.</span>'+
    '<a href="'+base+'playbook.html">Download Free Playbook <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" width="14" height="14"><path d="M12 3v12M7 11l5 5 5-5M5 21h14"/></svg></a></div></div>'+
    '<header class="nav"><div class="wrap nav-inner">'+BRAND+
      '<nav class="nav-links" aria-label="Primary">'+
        '<div class="nav-item'+(page==='home'?' active':'')+'"><a href="'+base+'home-figma.html">Home</a></div>'+
        '<div class="nav-item has-mega'+(page==='services'?' active':'')+'"><a href="'+base+'services.html" aria-haspopup="true">Services <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9l6 6 6-6"/></svg></a>'+svcMega()+'</div>'+
        '<div class="nav-item has-mega'+(page==='cases'?' active':'')+'"><a href="'+base+'work.html" aria-haspopup="true">Case Studies <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9l6 6 6-6"/></svg></a>'+caseMega()+'</div>'+
        '<div class="nav-item'+(page==='pricing'?' active':'')+'"><a href="'+base+'pricing.html">Pricing</a></div>'+
        '<div class="nav-item'+(page==='resources'?' active':'')+'"><a href="'+base+'resources.html">Resources</a></div>'+
        '<div class="nav-item'+(page==='about'?' active':'')+'"><a href="'+base+'about.html">About</a></div>'+
        '<div class="nav-item'+(page==='blog'?' active':'')+'"><a href="'+base+'blog.html">Blog</a></div>'+
      '</nav>'+
      '<div class="nav-right"><a class="ghost" data-booking href="https://calendly.com/velarisweb/30min">Book a Call</a>'+
        '<a class="btn btn-teal" data-inquiry href="#start">Start a Project</a>'+
        '<button class="nav-burger" id="burger" aria-label="Open menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button></div>'+
    '</div></header>'+
    '<div class="drawer" id="drawer"><div class="drawer-bg" data-close></div><div class="drawer-panel">'+
      '<div class="drawer-head">'+BRAND+'<button class="drawer-close" data-close aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>'+
      '<nav class="drawer-nav" aria-label="Mobile">'+
        '<a class="dl" href="'+base+'home-figma.html" data-close>Home</a>'+
        drawerAcc('Services', svcDrawerLinks(), base+'services.html', 'All services')+
        drawerAcc('Case Studies', caseDrawerLinks(), base+'work.html', 'View all work')+
        '<a class="dl" href="'+base+'pricing.html" data-close>Pricing</a>'+
        '<a class="dl" href="'+base+'resources.html" data-close>Resources</a>'+
        '<a class="dl" href="'+base+'about.html" data-close>About</a>'+
        '<a class="dl" href="'+base+'blog.html" data-close>Blog</a>'+
      '</nav>'+
      '<div class="drawer-cta">'+
        '<a class="btn btn-line" data-booking data-close href="https://calendly.com/velarisweb/30min">Book a Call</a>'+
        '<a class="btn btn-teal" data-inquiry data-close href="#start">Start a Project</a>'+
      '</div>'+
    '</div></div>';

  var footHTML =
    '<footer class="site"><div class="wrap"><div class="foot-grid">'+
      '<div class="foot-brand">'+BRAND+
        '<p>We help B2B &amp; B2C founders grow online with strategic design, local SEO, custom development and outreach that actually performs.</p>'+
        '<div class="foot-social">'+
          '<a href="#" aria-label="X"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h3l-7 8 8 12h-6l-5-7-5 7H2l8-9L2 2h6l4 6z"/></svg></a>'+
          '<a href="'+LINKEDIN_URL+'" target="_blank" rel="noopener" aria-label="LinkedIn"><img src="'+LINKEDIN_ICON+'" alt=""></a>'+
          '<a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></a>'+
        '</div></div>'+
      '<div class="foot-col"><h5>Services</h5>'+
        '<a href="'+base+'service.html?s=brand-identity">Logo &amp; Brand Design</a>'+
        '<a href="'+base+'service.html?s=conversion-uiux">UI/UX Design</a>'+
        '<a href="'+base+'service.html?s=webflow-development">Webflow Development</a>'+
        '<a href="'+base+'service.html?s=seo-optimization">Local SEO</a>'+
        '<a href="'+base+'service.html?s=social-media-management">Social Media Management</a></div>'+
      '<div class="foot-col"><h5>Company</h5>'+
        '<a href="'+base+'work.html">Case Studies</a>'+
        '<a href="'+base+'pricing.html">Pricing</a>'+
        '<a href="'+base+'resources.html">Resources</a>'+
        '<a href="'+base+'about.html">About</a>'+
        '<a href="'+base+'blog.html">Blog</a></div>'+
      '<div class="foot-col"><h5>Get started</h5>'+
        '<a data-inquiry href="#start">Start a Project</a>'+
        '<a data-booking href="https://calendly.com/velarisweb/30min">Book a Call</a>'+
        '<a href="'+base+'playbook.html">Free Playbook</a></div>'+
    '</div><div class="foot-bottom"><span>© <span id="yr">2026</span> Velaris Web. All rights reserved.</span>'+
      '<div class="links"><a href="#">Privacy Policy</a><a href="#">Terms of Service</a></div></div></div></footer>';

  var navMount = document.getElementById('site-nav');
  var footMount = document.getElementById('site-footer');
  if(navMount) navMount.innerHTML = navHTML;
  if(footMount) footMount.innerHTML = footHTML;

  /* interactions */
  var nav = document.querySelector('header.nav');
  var lastY = window.pageYOffset || 0, ticking = false;
  function onScroll(){
    var y = window.pageYOffset || document.documentElement.scrollTop || 0;
    if(nav){
      nav.classList.toggle('solid', y > 14);
      var wasHidden = nav.classList.contains('hide');
      if(y > 84 && y > lastY + 4){ nav.classList.add('hide'); document.documentElement.classList.add('nav-hidden'); document.querySelectorAll('.nav-item.open').forEach(function(i){i.classList.remove('open');}); }
      else if(y < lastY - 4 || y < 72){ nav.classList.remove('hide'); document.documentElement.classList.remove('nav-hidden'); }
      if(wasHidden !== nav.classList.contains('hide')) window.dispatchEvent(new CustomEvent('velaris:chrome'));
      lastY = y;
    }
    ticking = false;
  }
  window.addEventListener('scroll', function(){ if(!ticking){ ticking = true; window.requestAnimationFrame(onScroll); } }, {passive:true});
  onScroll();

  function closeAll(except){ document.querySelectorAll('.nav-item.open').forEach(function(i){ if(i!==except) i.classList.remove('open'); }); }
  document.querySelectorAll('.nav-item.has-mega').forEach(function(item){
    var link=item.querySelector('a'), t;
    item.addEventListener('mouseenter', function(){ clearTimeout(t); closeAll(item); item.classList.add('open'); });
    item.addEventListener('mouseleave', function(){ t=setTimeout(function(){ item.classList.remove('open'); }, 120); });
    if(link) link.addEventListener('click', function(e){
      if(window.innerWidth<=680) return; // allow nav on mobile (drawer handles it)
      // let the link navigate, but on first tap of a touch device just open
    });
  });
  document.addEventListener('click', function(e){ if(!e.target.closest('.nav-item')) closeAll(); });

  var drawer=document.getElementById('drawer');
  var burger=document.getElementById('burger');
  function closeDrawer(){ if(!drawer) return; drawer.classList.remove('on'); document.body.style.overflow='';
    drawer.querySelectorAll('.dacc.open').forEach(function(a){ a.classList.remove('open'); var b=a.querySelector('.dacc-body'); if(b) b.style.maxHeight='0'; var t=a.querySelector('.dacc-trig'); if(t) t.setAttribute('aria-expanded','false'); }); }
  if(burger) burger.addEventListener('click', function(){ drawer.classList.add('on'); document.body.style.overflow='hidden'; });
  if(drawer) drawer.addEventListener('click', function(e){ if(e.target.closest('[data-close]')||e.target.classList.contains('drawer-bg')){ closeDrawer(); } });

  /* drawer accordion (Services / Case Studies) */
  if(drawer) drawer.querySelectorAll('.dacc-trig').forEach(function(t){
    t.addEventListener('click', function(){
      var acc=t.closest('.dacc'), body=acc.querySelector('.dacc-body'), open=acc.classList.contains('open');
      // close siblings for a tidy single-open accordion
      drawer.querySelectorAll('.dacc.open').forEach(function(o){ if(o!==acc){ o.classList.remove('open'); var ob=o.querySelector('.dacc-body'); if(ob) ob.style.maxHeight='0'; var ot=o.querySelector('.dacc-trig'); if(ot) ot.setAttribute('aria-expanded','false'); } });
      acc.classList.toggle('open', !open);
      t.setAttribute('aria-expanded', String(!open));
      body.style.maxHeight = open ? '0' : body.scrollHeight+'px';
    });
  });

  var y=document.getElementById('yr'); if(y) y.textContent=new Date().getFullYear();

  /* ---- INQUIRY MODAL (Start a Project) ---- */
  var preferredServices = ['Starter','Growth','Scale','Logo & Brand Design','UI/UX Design','Webflow Development','Local SEO','Social Media Management'];
  var cmsServices = (window.VELARIS_SERVICES||[]).map(function(s){ return s.name.replace(/&amp;/g,'&').replace('Web & UX Design','UI/UX Design').replace('SEO Optimization','Local SEO'); });
  var SVC_OPTS = preferredServices.concat(cmsServices).filter(function(item, index, arr){ return arr.indexOf(item) === index; });
  if(!SVC_OPTS.length) SVC_OPTS = ['Logo & Brand Design','Web & UX Design','Custom Development','SEO','Cold Email'];
  var modal = document.createElement('div');
  modal.className = 'imodal'; modal.id = 'inquiryModal';
  modal.innerHTML =
    '<div class="imodal-bg" data-iclose></div>'+
    '<div class="imodal-panel" role="dialog" aria-modal="true" aria-label="Start a project">'+
      '<button class="imodal-x" data-iclose aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg></button>'+
      '<div class="imodal-grid">'+
        '<div class="imodal-left">'+
          '<h2>Have a project in mind? <span class="serif">Let\'s get started</span></h2>'+
          '<p>We\'ll schedule a call to discuss your idea. After a discovery session we\'ll send a proposal, and once approved we get to work.</p>'+
          '<div class="imodal-founder">'+
            '<span class="if-photo" style="background-image:url('+base+'home-img/founder.jpg)"></span>'+
            '<div class="if-meta"><b>Deluar Ahamed</b><span>Founder &amp; Lead Designer</span>'+
            '<a class="if-li" href="'+LINKEDIN_URL+'" target="_blank" rel="noopener"><img src="'+LINKEDIN_ICON+'" alt=""> Connect on LinkedIn</a></div>'+
          '</div>'+
          '<ul class="imodal-trust">'+
            '<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12l5 5 9-11"/></svg> Free 20-minute strategy call</li>'+
            '<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12l5 5 9-11"/></svg> Clear proposal &amp; timeline</li>'+
            '<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12l5 5 9-11"/></svg> No obligation, ever</li>'+
          '</ul>'+
        '</div>'+
        '<form class="imodal-form" id="inquiryForm">'+
          '<div class="ifield"><label>Full name</label><input type="text" name="name" placeholder="Jane Cooper" required></div>'+
          '<div class="ifield-row">'+
            '<div class="ifield"><label>Company name</label><input type="text" name="company" placeholder="Ex. Tesla Inc"></div>'+
            '<div class="ifield"><label>Email *</label><input type="email" name="email" placeholder="you@example.com" required></div>'+
          '</div>'+
          '<div class="ifield-row">'+
            '<div class="ifield"><label>Service required *</label><select name="service" required><option value="" disabled selected>Select your service</option>'+SVC_OPTS.map(function(o){return '<option>'+o+'</option>';}).join('')+'<option>Not sure yet</option></select></div>'+
            '<div class="ifield"><label>Project budget *</label><select name="budget" required><option value="" disabled selected>Select your range</option><option>£1k – £3k</option><option>£3k – £6k</option><option>£6k – £12k</option><option>£12k+</option></select></div>'+
          '</div>'+
          '<div class="ifield"><label>Project details *</label><textarea name="details" placeholder="Tell us more about your idea" required></textarea></div>'+
          '<button class="btn btn-dark" type="submit" style="width:100%">Send inquiry <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>'+
          '<p class="imodal-alt">Not ready to submit? <a data-booking href="https://calendly.com/velarisweb/30min">Book a call directly</a></p>'+
          '<div class="imodal-ok"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12l5 5 9-11"/></svg> Thanks! We\'ll be in touch within one business day.</div>'+
        '</form>'+
      '</div>'+
    '</div>';
  document.body.appendChild(modal);

  function openModal(){ modal.classList.add('on'); document.body.style.overflow='hidden'; }
  function closeModal(){ modal.classList.remove('on'); document.body.style.overflow=''; }
  document.addEventListener('click', function(e){
    var trig = e.target.closest('[data-inquiry]');
    if(trig){ e.preventDefault(); openModal(); return; }
    if(e.target.closest('[data-iclose]') || e.target.classList.contains('imodal-bg')) closeModal();
  });
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeModal(); });
  var iform = document.getElementById('inquiryForm');
  if(iform) iform.addEventListener('submit', function(e){ e.preventDefault(); iform.querySelector('.imodal-ok').classList.add('show'); setTimeout(closeModal, 1800); });

  /* ---- CALENDLY booking integration ---- */
  var CAL_URL = 'https://calendly.com/velarisweb/30min';
  (function loadCalendly(){
    if(!document.querySelector('link[href*="calendly"]')){
      var l=document.createElement('link'); l.rel='stylesheet'; l.href='https://assets.calendly.com/assets/external/widget.css'; document.head.appendChild(l);
    }
    if(!document.querySelector('script[src*="calendly"]')){
      var s=document.createElement('script'); s.src='https://assets.calendly.com/assets/external/widget.js'; s.async=true; document.head.appendChild(s);
    }
  })();
  function openCalendly(){
    if(window.Calendly && window.Calendly.initPopupWidget){ window.Calendly.initPopupWidget({url:CAL_URL}); }
    else { window.open(CAL_URL,'_blank','noopener'); }
  }
  document.addEventListener('click', function(e){
    var b = e.target.closest('[data-booking]');
    if(b){ e.preventDefault(); closeModal(); closeDrawer(); openCalendly(); }
  });

  /* auto-wire any existing "Book a call" CTAs across pages to Calendly */
  [].slice.call(document.querySelectorAll('a.btn, a.ghost, a.cs-live')).forEach(function(a){
    if(a.hasAttribute('data-booking')||a.hasAttribute('data-inquiry')) return;
    var t=(a.textContent||'').trim().toLowerCase();
    if(/^book a (free )?call/.test(t) || t==='book a call'){ a.setAttribute('data-booking',''); a.setAttribute('href', CAL_URL); }
  });
})();
