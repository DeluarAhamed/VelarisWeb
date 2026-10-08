/* ============================================================================
   VELARIS WEB — shared site chrome (nav + drawer + footer) for every page.
   Include AFTER home-data.js. Pages mark active item via <body data-page="…">.
   ========================================================================== */
(function(){
  'use strict';
  var base = document.body.getAttribute('data-base') || '';
  var page = document.body.getAttribute('data-page') || '';
  var CAL_URL = 'https://calendly.com/velarisweb/30min';
  var ASSET_BASE = '/velaris-design-system/ui_kits/web-app/';

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

  /* logo mark */
  var MARK = '<img class="mk" src="/velaris-design-system/assets/velaris-icon.webp" width="32" height="32" alt="">';
  var BRAND = '<a class="brand" href="/" aria-label="Velaris Web home">'+MARK+'<span class="brand-name">Velaris<span>Web</span></span></a>';
  /* WhatsApp: +880 1989-570693. Links marked data-wa="message" get that message pre-filled. */
  var WA_NUMBER = '8801989570693';
  var WA_DEFAULT = "Hi Velaris, I'd like to talk about a website for my business.";
  function waLink(text){ return 'https://wa.me/'+WA_NUMBER+'?text='+encodeURIComponent(text || WA_DEFAULT); }
  var WA_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1112 20.2z"/><path d="M16.6 14.1c-.3-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 01-3.4-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 00-.7.3 3 3 0 00-.9 2.2 5.2 5.2 0 001.1 2.7 11.8 11.8 0 004.5 4c1.7.7 2.3.8 3.2.7a2.7 2.7 0 001.8-1.3 2.2 2.2 0 00.1-1.3c0-.1-.2-.2-.5-.3z"/></svg>';
  window.VELARIS_WA = {number: WA_NUMBER, link: waLink, icon: WA_ICON};
  var LINKEDIN_URL = 'https://www.linkedin.com/in/deluar-ahamed/';
  var LINKEDIN_ICON = ASSET_BASE+'home-img/linkedin.webp';

  function svcMega(){
    var S = window.VELARIS_SERVICES||[];
    var ic = {code:'<path d="M8 7l-4 5 4 5M16 7l4 5-4 5M13 5l-2 14"/>',spark:'<path d="M12 3l2.5 5 5.5.8-4 3.9 1 5.5L12 21l-5-2.3 1-5.5-4-3.9L10.5 8z"/>',search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/>',mail:'<path d="M3 6l9 7 9-7M3 6v12h18V6"/>',ux:'<path d="M4 16l5-5 4 4 7-8"/><circle cx="4" cy="16" r="1.4"/>',brand:'<circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/>',webflow:'<path d="M3 8l9-4 9 4-9 4-9-4zM3 12l9 4 9-4M3 16l9 4 9-4"/>',framer:'<path d="M6 3h12v6H12zM6 9h6l6 6h-6v6z"/>'};
    var links = S.map(function(s){
      return '<a class="mega-link" href="/service?s='+s.slug+'"><span class="mega-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">'+ic[s.icon]+'</svg></span><span><b>'+s.name+'</b><span>'+s.tagline+'</span></span></a>';
    }).join('');
    return '<div class="mega wide"><div class="mega-inner"><div class="mega-grid">'+links+'</div>'+
      '<div class="mega-foot"><div><b>Not sure what you need?</b><p>Book a free 20-min call and we\'ll map it out.</p></div><a class="btn btn-teal" href="/pricing">See pricing</a></div></div></div>';
  }
  function caseMega(){
    var C = (window.VELARIS_CASES||[]).slice(0,4);
    var icons={hazelwood:'icon-hazelwood.webp',navasana:'icon-navasana.webp',core:'icon-core.webp',bellavista:'icon-bellavista.webp',coastal:'icon-coastal.webp'};
    var links = C.map(function(c){
      var ic = icons[c.slug] ? ASSET_BASE+'home-img/'+icons[c.slug] : ASSET_BASE+c.logo;
      return '<a class="mega-link" href="/case?c='+c.slug+'"><span class="mega-ic case-ic"><img src="'+ic+'" alt=""></span><span><b>'+c.client+'</b><span>'+c.sector+'</span></span></a>';
    }).join('');
    return '<div class="mega"><div class="mega-inner"><div class="mega-grid one">'+links+'</div>'+
      '<div class="mega-foot"><div><b>See every project</b><p>Browse the full Velaris portfolio.</p></div><a class="btn btn-teal" href="/case-studies">View all</a></div></div></div>';
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
      return '<a class="dsub" href="/service?s='+s.slug+'" data-close>'+s.name+'</a>';
    }).join('');
  }
  function caseDrawerLinks(){
    return (window.VELARIS_CASES||[]).slice(0,5).map(function(c){
      return '<a class="dsub" href="/case?c='+c.slug+'" data-close>'+c.client+'</a>';
    }).join('');
  }

  var navHTML =
    '<div class="topbar"><div class="wrap"><span>Your website on one simple monthly plan. No upfront cost, cancel anytime.</span>'+
    '<a href="/pricing">See plans <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" width="14" height="14"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a></div></div>'+
    '<header class="nav"><div class="wrap nav-inner">'+BRAND+
      '<nav class="nav-links" aria-label="Primary">'+
        '<div class="nav-item has-mega'+(page==='services'?' active':'')+'"><a href="/services" aria-haspopup="true">Services <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9l6 6 6-6"/></svg></a>'+svcMega()+'</div>'+
        '<div class="nav-item'+(page==='pricing'?' active':'')+'"><a href="/pricing">Pricing</a></div>'+
        '<div class="nav-item has-mega'+(page==='cases'?' active':'')+'"><a href="/case-studies" aria-haspopup="true">Our Work <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9l6 6 6-6"/></svg></a>'+caseMega()+'</div>'+
        '<div class="nav-item'+(page==='about'?' active':'')+'"><a href="/about">About</a></div>'+
        '<div class="nav-item'+(page==='blog'?' active':'')+'"><a href="/blog">Blog</a></div>'+
      '</nav>'+
      '<div class="nav-right"><a class="ghost nav-wa" href="'+waLink()+'" target="_blank" rel="noopener">'+WA_ICON+'WhatsApp us</a>'+
        '<a class="btn btn-teal" href="/pricing">Get Started</a>'+
        '<button class="nav-burger" id="burger" aria-label="Open menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button></div>'+
    '</div></header>'+
    '<div class="drawer" id="drawer"><div class="drawer-bg" data-close></div><div class="drawer-panel">'+
      '<div class="drawer-head">'+BRAND+'<button class="drawer-close" data-close aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>'+
      '<nav class="drawer-nav" aria-label="Mobile">'+
        '<a class="dl" href="/" data-close>Home</a>'+
        drawerAcc('Services', svcDrawerLinks(), '/services', 'All services')+
        drawerAcc('Our Work', caseDrawerLinks(), '/case-studies', 'View all case studies')+
        '<a class="dl" href="/pricing" data-close>Pricing</a>'+
        '<a class="dl" href="/about" data-close>About</a>'+
        '<a class="dl" href="/blog" data-close>Blog</a>'+
      '</nav>'+
      '<div class="drawer-cta">'+
        '<a class="btn btn-line" data-close href="'+waLink()+'" target="_blank" rel="noopener">WhatsApp us</a>'+
        '<a class="btn btn-teal" data-close href="/pricing">See Plans</a>'+
      '</div>'+
    '</div></div>';

  var footHTML =
    '<footer class="site"><div class="wrap"><div class="foot-grid">'+
      '<div class="foot-brand">'+BRAND+
        '<p>Professionally designed, fully managed websites for founders, consultants and service businesses, all for one simple monthly fee.</p>'+
        '<div class="foot-social">'+
          '<a href="#" aria-label="X"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h3l-7 8 8 12h-6l-5-7-5 7H2l8-9L2 2h6l4 6z"/></svg></a>'+
          '<a href="'+LINKEDIN_URL+'" target="_blank" rel="noopener" aria-label="LinkedIn"><img src="'+LINKEDIN_ICON+'" alt=""></a>'+
          '<a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></a>'+
        '</div></div>'+
      '<div class="foot-col"><h5>Plans</h5>'+
        '<a href="/pricing#plans">Starter</a>'+
        '<a href="/pricing#plans">Growth</a>'+
        '<a href="/pricing#plans">Scale</a>'+
        '<a href="/pricing#included">What&rsquo;s included</a>'+
        '<a href="/services">All services</a></div>'+
      '<div class="foot-col"><h5>Company</h5>'+
        '<a href="/case-studies">Case Studies</a>'+
        '<a href="/pricing">Pricing</a>'+
        '<a href="/resources">Resources</a>'+
        '<a href="/about">About</a>'+
        '<a href="/blog">Blog</a></div>'+
      '<div class="foot-col"><h5>Get started</h5>'+
        '<a href="/pricing">See Plans</a>'+
        '<a href="'+waLink()+'" target="_blank" rel="noopener">WhatsApp +880 1989-570693</a>'+
        '<a data-booking href="https://calendly.com/velarisweb/30min">Book a Call</a>'+
        '<a href="/playbook">Free Playbook</a></div>'+
    '</div><div class="foot-bottom"><span>© <span id="yr">2026</span> Velaris Web. All rights reserved.</span>'+
      '<div class="links"><a href="#">Privacy Policy</a><a href="#">Terms of Service</a></div></div></div></footer>';

  var navMount = document.getElementById('site-nav');
  var footMount = document.getElementById('site-footer');
  if(navMount) navMount.innerHTML = navHTML;
  if(footMount) footMount.innerHTML = footHTML;

  /* WhatsApp: pre-fill marked links and add the floating button */
  [].slice.call(document.querySelectorAll('[data-wa]')).forEach(function(a){
    a.href = waLink(a.getAttribute('data-wa'));
    a.target = '_blank'; a.rel = 'noopener';
  });
  if(!document.querySelector('.v-wa-fab')){
    var fab = document.createElement('a');
    fab.className = 'v-wa-fab'; fab.href = waLink(); fab.target = '_blank'; fab.rel = 'noopener';
    fab.setAttribute('aria-label','Chat with Velaris on WhatsApp');
    fab.innerHTML = WA_ICON+'<span>WhatsApp</span>';
    document.body.appendChild(fab);
  }

  function tuneMedia(root){
    root = root || document;
    [].slice.call(root.querySelectorAll('img')).forEach(function(img, i){
      if(!img.hasAttribute('decoding')) img.setAttribute('decoding','async');
      if(!img.hasAttribute('loading')){
        var top = 9999;
        try { top = img.getBoundingClientRect().top; } catch(e){}
        if(i > 1 || top > window.innerHeight * 1.25) img.setAttribute('loading','lazy');
        else img.setAttribute('fetchpriority','high');
      }
    });
  }
  tuneMedia();
  if('MutationObserver' in window){
    new MutationObserver(function(list){
      list.forEach(function(m){ [].slice.call(m.addedNodes).forEach(function(n){ if(n.nodeType===1) tuneMedia(n); }); });
    }).observe(document.body,{childList:true,subtree:true});
  }

  /* interactions */
  var nav = document.querySelector('header.nav');
  var lastY = window.pageYOffset || 0, ticking = false;
  function onScroll(){
    var y = window.pageYOffset || document.documentElement.scrollTop || 0;
    if(nav){
      nav.classList.toggle('solid', y > 14);
      var wasHidden = nav.classList.contains('hide');
      if(y > 84 && y > lastY + 2){ nav.classList.add('hide'); document.documentElement.classList.add('nav-hidden'); document.querySelectorAll('.nav-item.open').forEach(function(i){i.classList.remove('open');}); }
      else if(y < lastY || y < 72){ nav.classList.remove('hide'); document.documentElement.classList.remove('nav-hidden'); }
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
            '<span class="if-photo" style="background-image:url('+ASSET_BASE+'home-img/founder.webp)"></span>'+
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
            '<div class="ifield"><label>Plan of interest *</label><select name="budget" required><option value="" disabled selected>Select a plan</option><option>Starter ($199/month)</option><option>Growth ($399/month)</option><option>Scale (from $699/month)</option><option>One-off project</option><option>Not sure yet</option></select></div>'+
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
  /* ---- LEAD CAPTURE: POST to /api/leads; if that fails, offer the same details via WhatsApp so no lead is lost ---- */
  function leadSummary(d){
    return ['Hi Velaris, I\'d like to get started.',
      d.budget ? 'Plan: '+d.budget : '', d.serviceInterest ? 'Service: '+d.serviceInterest : '',
      'Name: '+d.name, 'Email: '+d.email, d.phone ? 'Phone: '+d.phone : '', d.company ? 'Company: '+d.company : '',
      d.problem ? 'Project: '+d.problem : ''].filter(Boolean).join('\n');
  }
  function sendLead(d, done){
    var fallback = waLink(leadSummary(d));
    if(!window.fetch){ done(false, fallback); return; }
    fetch('/api/leads', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(d)})
      .then(function(r){ done(r.ok, fallback); })
      .catch(function(){ done(false, fallback); });
  }
  function formData(form){
    var v = function(n){ var el = form.querySelector('[name="'+n+'"]'); return el ? String(el.value||'').trim() : ''; };
    return {name:v('name'), email:v('email'), phone:v('phone'), company:v('company'), serviceInterest:v('service'), budget:v('budget'), problem:v('details')};
  }
  function leadResult(form, ok, fallback){
    var box = form.querySelector('.imodal-ok');
    var btn = form.querySelector('button[type="submit"]');
    if(btn){ btn.disabled = false; btn.classList.remove('is-busy'); }
    if(!box) return;
    box.innerHTML = ok
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12l5 5 9-11"/></svg> Thanks! We\'ll be in touch within a few hours.'
      : 'We couldn\'t send the form just now. <a href="'+fallback+'" target="_blank" rel="noopener">Send these details on WhatsApp</a> and we\'ll reply fast.';
    box.classList.toggle('warn', !ok);
    box.classList.add('show');
    if(ok) form.reset();
  }
  function wireLeadForm(form, source, after){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var d = formData(form); d.source = source;
      var btn = form.querySelector('button[type="submit"]');
      if(btn){ btn.disabled = true; btn.classList.add('is-busy'); }
      sendLead(d, function(ok, fallback){ leadResult(form, ok, fallback); if(ok && after) after(); });
    });
  }
  var iform = document.getElementById('inquiryForm');
  if(iform) wireLeadForm(iform, 'website_inquiry', function(){ setTimeout(closeModal, 2200); });

  /* ---- PLAN MODAL: "Get started" on a plan card ([data-plan]) ---- */
  function esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  var pmodal = null;
  function planModal(plan, price){
    if(!pmodal){
      pmodal = document.createElement('div');
      pmodal.className = 'pmodal';
      pmodal.innerHTML =
        '<div class="pmodal-bg" data-pclose></div>'+
        '<div class="pmodal-panel" role="dialog" aria-modal="true" aria-labelledby="pmodalTitle">'+
          '<button class="pmodal-x" type="button" data-pclose aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg></button>'+
          '<span class="pmodal-badge" data-pm-badge></span>'+
          '<h2 id="pmodalTitle">Let\'s build your website.</h2>'+
          '<p class="pmodal-sub">Send us a message or reach out directly. We reply within a few hours.</p>'+
          '<div class="pmodal-quick">'+
            '<a class="pq wa" data-pm-wa target="_blank" rel="noopener" href="'+waLink()+'"><span class="pq-ic">'+WA_ICON+'</span><span><b>WhatsApp us</b>+880 1989-570693</span></a>'+
            '<a class="pq" data-booking href="'+CAL_URL+'"><span class="pq-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg></span><span><b>Book a call</b>Free 20-minute chat</span></a>'+
          '</div>'+
          '<div class="pmodal-or"><span>or send a message</span></div>'+
          '<form class="pmodal-form" novalidate>'+
            '<input type="hidden" name="budget">'+
            '<div class="pmodal-row">'+
              '<label class="pf"><span>Full name</span><input type="text" name="name" placeholder="Jane Cooper" autocomplete="name" required></label>'+
              '<label class="pf"><span>Email</span><input type="email" name="email" placeholder="jane@company.com" autocomplete="email" required></label>'+
            '</div>'+
            '<label class="pf"><span>Phone / WhatsApp <em>(optional)</em></span><input type="tel" name="phone" placeholder="+1 555 000 0000" autocomplete="tel"></label>'+
            '<label class="pf"><span>Tell us about your project</span><textarea name="details" rows="4" placeholder="New website, redesign, online store, a question..."></textarea></label>'+
            '<p class="pmodal-err" hidden>Please add your name and a valid email.</p>'+
            '<button class="btn btn-blue" type="submit">Send message <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>'+
            '<div class="imodal-ok"></div>'+
          '</form>'+
        '</div>';
      document.body.appendChild(pmodal);
      var form = pmodal.querySelector('form');
      form.addEventListener('submit', function(e){
        e.preventDefault();
        var d = formData(form); d.source = 'website_plan_modal'; d.serviceInterest = 'Monthly website plan';
        var err = form.querySelector('.pmodal-err');
        var valid = d.name && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email);
        err.hidden = !!valid;
        if(!valid) return;
        var btn = form.querySelector('button[type="submit"]'); btn.disabled = true; btn.classList.add('is-busy');
        sendLead(d, function(ok, fallback){ leadResult(form, ok, fallback); });
      });
      pmodal.addEventListener('click', function(e){ if(e.target.closest('[data-pclose]')) closePlanModal(); });
    }
    var label = plan ? esc(plan)+' plan'+(price ? ' &middot; '+esc(price) : '') : 'Get started';
    pmodal.querySelector('[data-pm-badge]').innerHTML = label;
    pmodal.querySelector('[name="budget"]').value = plan ? plan+(price ? ' ('+price+')' : '') : '';
    pmodal.querySelector('[data-pm-wa]').href = waLink('Hi Velaris, I\'m interested in the '+(plan || 'monthly')+' plan'+(price ? ' ('+price+')' : '')+'.');
    var ok = pmodal.querySelector('.imodal-ok'); ok.classList.remove('show'); ok.innerHTML = '';
    pmodal.classList.add('on'); document.body.style.overflow = 'hidden';
    setTimeout(function(){ var f = pmodal.querySelector('[name="name"]'); if(f) f.focus(); }, 60);
  }
  function closePlanModal(){ if(pmodal){ pmodal.classList.remove('on'); document.body.style.overflow = ''; } }
  document.addEventListener('click', function(e){
    var t = e.target.closest('[data-plan]');
    if(t){ e.preventDefault(); planModal(t.getAttribute('data-plan'), t.getAttribute('data-price')); }
  });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closePlanModal(); });

  /* ---- CALENDLY booking integration ---- */
  var calendlyLoading = false;
  var calendlyQueue = [];
  function flushCalendlyQueue(){
    var q = calendlyQueue.slice();
    calendlyQueue = [];
    q.forEach(function(fn){ if(fn) fn(); });
  }
  function loadCalendly(done){
    if(window.Calendly){ if(done) done(); return; }
    if(done) calendlyQueue.push(done);
    if(!document.querySelector('link[href*="calendly"]')){
      var l=document.createElement('link'); l.rel='stylesheet'; l.href='https://assets.calendly.com/assets/external/widget.css'; document.head.appendChild(l);
    }
    var existing = document.querySelector('script[src*="calendly"]');
    if(existing) return;
    if(calendlyLoading) return;
    calendlyLoading = true;
    var s=document.createElement('script');
    s.src='https://assets.calendly.com/assets/external/widget.js';
    s.async=true;
    s.onload=function(){ calendlyLoading=false; flushCalendlyQueue(); };
    s.onerror=function(){ calendlyLoading=false; flushCalendlyQueue(); };
    document.head.appendChild(s);
  }
  function openCalendly(){
    loadCalendly(function(){
      if(window.Calendly && window.Calendly.initPopupWidget){ window.Calendly.initPopupWidget({url:CAL_URL}); }
      else { window.open(CAL_URL,'_blank','noopener'); }
    });
  }
  document.addEventListener('click', function(e){
    var b = e.target.closest('[data-booking]');
    if(b){ e.preventDefault(); closeModal(); closePlanModal(); closeDrawer(); openCalendly(); }
  });

  /* auto-wire any existing "Book a call" CTAs across pages to Calendly */
  [].slice.call(document.querySelectorAll('a.btn, a.ghost, a.cs-live')).forEach(function(a){
    if(a.hasAttribute('data-booking')||a.hasAttribute('data-inquiry')) return;
    var t=(a.textContent||'').trim().toLowerCase();
    if(/^book a (free )?call/.test(t) || t==='book a call'){ a.setAttribute('data-booking',''); a.setAttribute('href', CAL_URL); }
  });

  function renderContactSections(){
    [].slice.call(document.querySelectorAll('[data-contact-section]')).forEach(function(mount){
      var mode = mount.getAttribute('data-mode') || 'form';
      mount.innerHTML =
        '<div class="wrap contact-booking-wrap">'+
          '<div class="contact-booking-copy">'+
            '<span class="eyebrow">Start the conversation</span>'+
            '<h2>Have a project idea in mind? <span class="serif">Let\'s get started</span></h2>'+
            '<p>We\'ll schedule a call to understand your goals. After discovery, we\'ll send a clear proposal, timeline and next steps.</p>'+
            '<div class="contact-founder">'+
              '<img src="'+ASSET_BASE+'home-img/founder.webp" alt="Deluar Ahamed">'+
              '<div><b>Deluar Ahamed</b><span>Founder &amp; Lead Designer</span><a href="'+LINKEDIN_URL+'" target="_blank" rel="noopener"><img src="'+LINKEDIN_ICON+'" alt=""> Connect on LinkedIn</a></div>'+
            '</div>'+
            '<ul class="contact-checks"><li>Free 20-minute strategy call</li><li>Clear proposal and timeline</li><li>No obligation, ever</li></ul>'+
          '</div>'+
          '<div class="contact-booking-card">'+
            '<div class="contact-tabs" role="tablist">'+
              '<button class="active" type="button" data-contact-tab="form">Send inquiry</button>'+
              '<button type="button" data-contact-tab="calendar">Book a call</button>'+
            '</div>'+
            '<form class="contact-inline-form" data-panel="form">'+
              '<div class="ifield"><label>Full name</label><input type="text" name="name" placeholder="Jane Cooper" required></div>'+
              '<div class="ifield-row"><div class="ifield"><label>Company name</label><input type="text" name="company" placeholder="Ex. Tesla Inc"></div><div class="ifield"><label>Email *</label><input type="email" name="email" placeholder="you@example.com" required></div></div>'+
              '<div class="ifield-row"><div class="ifield"><label>Service required *</label><select name="service" required><option value="" selected disabled>Select your service</option>'+SVC_OPTS.map(function(o){return '<option>'+o+'</option>';}).join('')+'</select></div><div class="ifield"><label>Plan of interest *</label><select name="budget" required><option value="" selected disabled>Select a plan</option><option>Starter ($199/month)</option><option>Growth ($399/month)</option><option>Scale (from $699/month)</option><option>One-off project</option><option>Not sure yet</option></select></div></div>'+
              '<div class="ifield"><label>Project details *</label><textarea name="details" placeholder="Tell us more about your idea" required></textarea></div>'+
              '<button class="btn btn-dark" type="submit">Send inquiry <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>'+
              '<p class="imodal-alt">Not interested in the form? <a href="#" data-contact-tab="calendar">Book a call directly</a></p>'+
              '<div class="imodal-ok"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12l5 5 9-11"/></svg> Thanks! We\'ll be in touch within one business day.</div>'+
            '</form>'+
            '<div class="contact-calendar" data-panel="calendar" hidden><div class="calendly-inline-widget" data-url="'+CAL_URL+'" style="min-width:320px;height:700px;"></div></div>'+
          '</div>'+
        '</div>';
      var tabs = [].slice.call(mount.querySelectorAll('[data-contact-tab]'));
      var formPanel = mount.querySelector('[data-panel="form"]');
      var calPanel = mount.querySelector('[data-panel="calendar"]');
      var calReady = false;
      function show(which, shouldLoad){
        var calendar = which === 'calendar';
        var topBefore = mount.getBoundingClientRect().top;
        tabs.forEach(function(t){ t.classList.toggle('active', t.getAttribute('data-contact-tab') === which); });
        formPanel.hidden = calendar;
        calPanel.hidden = !calendar;
        formPanel.style.display = calendar ? 'none' : '';
        calPanel.style.display = calendar ? '' : 'none';
        if(calendar && shouldLoad !== false && !calReady){
          calReady = true;
          loadCalendly(function(){
            if(window.Calendly && window.Calendly.initInlineWidget){
              var widget = calPanel.querySelector('.calendly-inline-widget');
              widget.innerHTML = '';
              window.Calendly.initInlineWidget({url:CAL_URL,parentElement:widget});
            }
          });
        }
        requestAnimationFrame(function(){
          var delta = mount.getBoundingClientRect().top - topBefore;
          if(Math.abs(delta) > 1) window.scrollBy(0, delta);
        });
      }
      tabs.forEach(function(t){ t.addEventListener('click', function(e){ e.preventDefault(); show(t.getAttribute('data-contact-tab')); }); });
      wireLeadForm(formPanel, 'website_contact');
      if(mode === 'calendly') show('calendar', false);
      else if('IntersectionObserver' in window){
        new IntersectionObserver(function(entries, obs){
          entries.forEach(function(entry){ if(entry.isIntersecting && mode === 'calendly'){ show('calendar'); obs.disconnect(); } });
        },{rootMargin:'500px'}).observe(mount);
      }
      if(mode === 'calendly' && 'IntersectionObserver' in window){
        new IntersectionObserver(function(entries, obs){
          entries.forEach(function(entry){ if(entry.isIntersecting){ show('calendar'); obs.disconnect(); } });
        },{rootMargin:'500px'}).observe(mount);
      } else if(mode === 'calendly') {
        show('calendar');
      }
    });
  }
  renderContactSections();

  /* Ava AI assistant — lazy-loaded after the page is interactive. */
  function loadAva(){
    if(document.querySelector('script[data-ava]')) return;
    var css=document.createElement('link'); css.rel='stylesheet'; css.href=ASSET_BASE+'voice-agent.css?v=20261008-v4'; document.head.appendChild(css);
    var script=document.createElement('script'); script.src=ASSET_BASE+'voice-agent.js?v=20261008-v4'; script.async=true; script.setAttribute('data-ava',''); document.body.appendChild(script);
  }
  if('requestIdleCallback' in window) requestIdleCallback(loadAva,{timeout:2500});
  else window.addEventListener('load',function(){setTimeout(loadAva,600);},{once:true});
})();
