/* Velaris Web — home page interactions (data-driven). Nav/footer = site.js */
(function () {
  'use strict';
  var rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ease = 'cubic-bezier(.22,.61,.36,1)';
  var ARROW='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var CHECK='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12l5 5 9-11"/></svg>';

  var revObs=new IntersectionObserver(function(es){ es.forEach(function(en){
    if(en.isIntersecting){ en.target.classList.add('in'); revObs.unobserve(en.target); } }); },{threshold:.12});
  function revObserve(els){ els.forEach(function(el){ revObs.observe(el); }); }

  /* category + real imagery helper (shared visual language for blog) */
  function uns(id, w){ return 'https://images.unsplash.com/'+id+'?auto=format&fit=crop&w='+(w||600)+'&q=80'; }
  var PIMG={ "Local SEO":"photo-1524661135-423995f22d0b","Web Design":"photo-1467232004584-a241de8bcf5d","Conversion":"photo-1460925895917-afdab827c52f","Lead Generation":"photo-1551288049-bebda4e38f71","Webflow":"photo-1547658719-da2b51169166","Framer":"photo-1517077304055-6e89abbf09b0","AI Web Development":"photo-1620712943543-bcc4688e7485","Email Marketing":"photo-1596526131083-e8c633c948d2","Branding":"photo-1626785774573-4b799315345d","Analytics":"photo-1551288049-bebda4e38f71" };
  function thumb(p){ var id=PIMG[p.cat]||"photo-1467232004584-a241de8bcf5d";
    return 'linear-gradient(180deg,rgba(2,16,31,.12),rgba(2,16,31,.6)),url('+uns(id)+') center/cover'; }

  /* ---- B2B / B2C : slide up from bottom ---- */
  (function(){
    var swap=document.querySelector('[data-swap]'); if(!swap) return;
    var words=['B2B','B2C'], i=0;
    var el=document.createElement('span'); el.className='word'; el.textContent=words[0]; swap.appendChild(el);
    if(rm) return;
    setInterval(function(){
      i=(i+1)%words.length;
      el.style.transition='transform .42s '+ease+', opacity .42s';
      el.style.transform='translateY(-110%)'; el.style.opacity='0';
      setTimeout(function(){
        el.style.transition='none'; el.style.transform='translateY(110%)'; el.textContent=words[i];
        requestAnimationFrame(function(){ requestAnimationFrame(function(){
          el.style.transition='transform .5s '+ease+', opacity .5s';
          el.style.transform='translateY(0)'; el.style.opacity='1';
        });});
      },420);
    },2800);
  })();

  /* ---- HERO case-study slider: image on top, caption below ---- */
  (function(){
    var track=document.getElementById('hsTrack'); if(!track||!window.VELARIS_HERO_SLIDES) return;
    var S=window.VELARIS_HERO_SLIDES;
    track.innerHTML=S.map(function(s){
      return '<a class="hs-slide" href="'+s.href+'" aria-label="'+s.client+' case study"><img src="'+s.img+'" alt="'+s.client+' website"></a>';
    }).join('');
    var caps=document.getElementById('hsCaps');
    caps.innerHTML=S.map(function(s,i){
      return '<a class="hs-capitem'+(i===0?' on':'')+'" href="'+s.href+'"><h3>'+s.headline+'</h3><p>'+s.blurb+'</p></a>';
    }).join('');
    var capEls=[].slice.call(caps.children);
    var slides=S.length, idx=0, timer;
    var dotsWrap=document.getElementById('hsDots'); var dots=[];
    for(var k=0;k<slides;k++){(function(n){
      var b=document.createElement('button'); if(n===0)b.className='on'; b.setAttribute('aria-label','Slide '+(n+1));
      b.addEventListener('click',function(){ go(n); reset(); }); dotsWrap.appendChild(b); dots.push(b);
    })(k);}
    function go(n){ idx=(n+slides)%slides; track.style.transform='translateX(-'+(idx*100)+'%)';
      dots.forEach(function(d,j){ d.classList.toggle('on',j===idx); });
      capEls.forEach(function(c,j){ c.classList.toggle('on',j===idx); }); }
    function reset(){ if(rm)return; clearInterval(timer); timer=setInterval(function(){ go(idx+1); },5000); }
    var prev=document.getElementById('hsPrev'), next=document.getElementById('hsNext');
    if(prev)prev.addEventListener('click',function(){ go(idx-1); reset(); });
    if(next)next.addEventListener('click',function(){ go(idx+1); reset(); });
    reset();
  })();

  /* ---- marquee logos ---- */
  (function(){
    var track=document.getElementById('logoTrack'); if(!track||!window.VELARIS_LOGOS) return;
    var L=window.VELARIS_LOGOS;
    function cells(){ return L.map(function(l){ return '<div class="cell"><img src="'+l.src+'" alt="'+l.name+'"></div>'; }).join(''); }
    track.innerHTML=cells()+cells();
  })();

  /* ---- testimonials two-row marquee ---- */
  (function(){
    var r1=document.getElementById('testiRow1'), r2=document.getElementById('testiRow2');
    if(!r1||!window.VELARIS_TESTIMONIALS) return;
    var VER='<span class="verified" title="Verified review"><svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><path d="M8 12l2.5 2.5L16 9" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';
    var STAR='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17.8 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z"/></svg>';
    function starRow(n){ var s=''; for(var i=0;i<5;i++) s+=STAR; return '<div class="tc-stars">'+s+'</div>'; }
    var T=window.VELARIS_TESTIMONIALS;
    function card(t){
      return '<figure class="tcard">'+
        '<div class="tc-top">'+starRow(t.stars||5)+'<span class="tc-qm">&#8220;</span></div>'+
        '<blockquote class="tc-quote">'+t.quote+'</blockquote>'+
        '<figcaption class="tc-author"><span class="av'+(t.avatarLogo?' logo':'')+'" style="background-image:url('+t.avatar+')"></span>'+
        '<span class="tc-meta"><b>'+t.author+VER+'</b><span>'+t.role+'</span></span></figcaption></figure>';
    }
    // each row uses all testimonials (row 2 reversed); duplicate once for seamless -50% loop
    var rowA = T.slice();
    var rowB = T.slice().reverse();
    function fill(el,arr){ var html=arr.map(card).join(''); el.innerHTML=html+html; }
    fill(r1,rowA); fill(r2,rowB);
  })();

  /* ---- count-up stats ---- */
  function animateNum(el){
    var target=parseFloat(el.getAttribute('data-to')), dec=(el.getAttribute('data-dec')|0),
        pre=el.getAttribute('data-pre')||'', dur=1500, t0=null;
    function fmt(v){ return pre+v.toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g,','); }
    function step(t){ if(!t0)t0=t; var p=Math.min((t-t0)/dur,1), e=1-Math.pow(1-p,3);
      el.firstChild.textContent=fmt(target*e); if(p<1)requestAnimationFrame(step); }
    if(rm){ el.firstChild.textContent=fmt(target); return; }
    requestAnimationFrame(step);
  }
  var statObs=new IntersectionObserver(function(es){ es.forEach(function(en){
    if(en.isIntersecting){ animateNum(en.target); statObs.unobserve(en.target); } }); },{threshold:.5});
  document.querySelectorAll('[data-to]').forEach(function(el){ statObs.observe(el); });

  /* ---- CASE STUDIES (featured stack) ---- */
  (function(){
    var stack=document.getElementById('caseStack'); if(!stack||!window.VELARIS_CASES) return;
    var feat=window.VELARIS_CASES.slice();
    var cardsHTML=feat.map(function(c,idx){
      var title=c.title.map(function(seg,i){ return i%2 ? '<span class="serif">'+seg+'</span>' : seg; }).join('');
      var stats=c.stats.map(function(s){ return '<div><b>'+s[0]+'</b><small>'+s[1]+'</small></div>'; }).join('');
      var foot;
      if(c.quote){
        foot='<div class="sc-quote"><span class="av" style="background-image:url('+c.avatar+')"></span>'+
          '<div><p class="qt">"'+c.quote+'"</p><span class="nm">'+c.author+' <span class="rl">— '+c.role+'</span></span></div></div>';
      } else {
        foot='<div class="sc-outcome"><span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 16l5-5 4 4 7-8"/><circle cx="4" cy="16" r="1.4"/></svg></span>'+
          '<p><b>The outcome</b>'+c.outcome+'</p></div>';
      }
      return '<a class="stack-card'+(c.dark?' dark':'')+'" style="z-index:'+(10+idx)+'" id="case-'+c.slug+'" href="case.html?c='+c.slug+'">'+
        '<div class="sc-text">'+
          '<div class="sc-top"><span class="sc-num">CASE '+c.n+'</span><span class="sc-sector">'+c.sector+'</span></div>'+
          '<img class="sc-logo" src="'+c.logo+'" alt="'+c.client+'"'+(c.logoInvert?' style="filter:brightness(0) invert(1)"':'')+'>'+
          '<h3>'+title+'</h3><p class="sum">'+c.summary+'</p>'+
          '<div class="sc-stats">'+stats+'</div>'+foot+
          '<span class="sc-read">Read full case study '+ARROW+'</span>'+
        '</div>'+
        '<div class="sc-visual"><img src="'+c.img+'" alt="'+c.client+' website"></div></a>';
    }).join('');
    stack.innerHTML='<div class="stack-pin">'+cardsHTML+'</div>';
    if(window.VelarisInitStack) window.VelarisInitStack(stack);
  })();

  /* ---- MORE CASES grid ---- */
  (function(){
    var grid=document.getElementById('moreCases'); if(!grid||!window.VELARIS_CASES) return;
    var more=window.VELARIS_CASES.filter(function(c){ return !c.featured; });
    grid.innerHTML=more.map(function(c){
      var foot = c.quote
        ? '<p class="mc-quote">"'+c.quote+'"</p><div class="mc-author"><span class="av" style="background-image:url('+c.avatar+')"></span><span><b>'+c.author+'</b><span>'+c.role+'</span></span></div>'
        : '<p class="mc-quote">'+c.summary+'</p><div class="mc-author"><span class="av" style="background:var(--cream);display:flex;align-items:center;justify-content:center"><img src="'+c.logo+'" alt="" style="width:22px;height:auto"></span><span><b>'+c.client+'</b><span>'+c.sector+'</span></span></div>';
      return '<a class="mc" id="case-'+c.slug+'" href="case.html?c='+c.slug+'">'+
        '<div class="mc-img"><img src="'+c.img+'" alt="'+c.client+' website"></div>'+
        '<div class="mc-body"><span class="mc-sector">'+c.sector+'</span>'+foot+'</div></a>';
    }).join('');
  })();

  /* ---- SERVICES (horizontal scroll + arrows) ---- */
  (function(){
    var scroll=document.getElementById('svcScroll'); if(!scroll||!window.VELARIS_SERVICES) return;
    var ic={code:'<path d="M8 7l-4 5 4 5M16 7l4 5-4 5M13 4l-2 16"/>',spark:'<path d="M12 3l2.5 5 5.5.8-4 3.9 1 5.5L12 21l-5-2.3 1-5.5-4-3.9L10.5 8z"/>',search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/>',mail:'<path d="M3 6l9 7 9-7M3 6v12h18V6"/>',ux:'<path d="M4 16l5-5 4 4 7-8"/><circle cx="4" cy="16" r="1.5"/>',brand:'<circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/>',webflow:'<path d="M3 8l9-4 9 4-9 4-9-4zM3 12l9 4 9-4M3 16l9 4 9-4"/>',framer:'<path d="M6 3h12v6H12zM6 9h6l6 6h-6v6z"/>'};
    scroll.innerHTML=window.VELARIS_SERVICES.map(function(s){
      var feats=s.feats.map(function(f){ return '<li>'+CHECK+f+'</li>'; }).join('');
      return '<div class="svc'+(s.feat?' feat':'')+'">'+
        '<div class="svc-top"><div class="svc-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">'+ic[s.icon]+'</svg></div><span class="svc-n">'+s.tag+'</span></div>'+
        '<h3>'+s.name+'</h3><p>'+s.short+'</p><ul class="feats">'+feats+'</ul>'+
        '<a class="svc-link" href="service.html?s='+s.slug+'">Learn more '+ARROW+'</a></div>';
    }).join('');
    var prev=document.getElementById('svcPrev'), next=document.getElementById('svcNext');
    function by(){ var c=scroll.querySelector('.svc'); return c?c.getBoundingClientRect().width+20:360; }
    if(prev)prev.addEventListener('click',function(){ scroll.scrollBy({left:-by(),behavior:'smooth'}); });
    if(next)next.addEventListener('click',function(){ scroll.scrollBy({left:by(),behavior:'smooth'}); });
  })();

  /* ---- PROCESS (home — optional) ---- */
  (function(){
    var rail=document.getElementById('procRail'); if(!rail||!window.VELARIS_PROCESS) return;
    rail.innerHTML=window.VELARIS_PROCESS.map(function(p){
      var tags=p.tags.map(function(t){ return '<span>'+t+'</span>'; }).join('');
      return '<div class="proc-row reveal"><div class="proc-n">'+p.n+'</div>'+
        '<div class="proc-mid"><h3>'+p.title+'</h3><p>'+p.desc+'</p><div class="tags">'+tags+'</div></div>'+
        '<div class="proc-out"><small>Output</small>'+p.out+'</div></div>';
    }).join('');
    revObserve(rail.querySelectorAll('.reveal'));
  })();

  /* ---- FAQ ---- */
  (function(){
    var list=document.getElementById('faqList'); if(!list||!window.VELARIS_FAQS) return;
    list.innerHTML=window.VELARIS_FAQS.map(function(f){
      return '<div class="faq-item"><button class="faq-q">'+f.q+
        '<span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 5v14M5 12h14"/></svg></span></button>'+
        '<div class="faq-a"><p>'+f.a+'</p></div></div>';
    }).join('');
    list.querySelectorAll('.faq-item').forEach(function(item){
      var q=item.querySelector('.faq-q'), a=item.querySelector('.faq-a');
      q.addEventListener('click',function(){
        var open=item.classList.contains('open');
        list.querySelectorAll('.faq-item.open').forEach(function(o){ o.classList.remove('open'); o.querySelector('.faq-a').style.maxHeight='0'; });
        if(!open){ item.classList.add('open'); a.style.maxHeight=a.scrollHeight+'px'; }
      });
    });
  })();

  /* ---- WHY scroll highlight ---- */
  (function(){
    var box=document.getElementById('whyText'); if(!box) return;
    var s="We help service businesses, founders and consultants grow online with strategic website design, local SEO, conversion-focused UX and modern development. Every site we build is engineered to rank on Google, increase trust, and turn more visitors into paying customers.";
    var accent=["leads","Google","trust","grow","qualified","SEO","ranks","ranking,","customers."];
    box.innerHTML=s.split(' ').map(function(w){
      var clean=w.replace(/[^A-Za-z.]/g,''); var acc=accent.indexOf(clean)>-1?' acc':'';
      return '<span class="w'+acc+'">'+w+'</span>';
    }).join(' ');
    var words=[].slice.call(box.querySelectorAll('.w'));
    function upd(){ var r=box.getBoundingClientRect(), vh=window.innerHeight;
      var start=vh*0.8, end=vh*0.3, prog=(start-r.top)/(start-end+r.height*0.6);
      prog=Math.min(Math.max(prog,0),1); var lit=Math.floor(prog*words.length);
      words.forEach(function(w,k){ w.classList.toggle('lit',k<lit); }); }
    window.addEventListener('scroll',upd,{passive:true}); window.addEventListener('resize',upd); upd();
  })();

  /* ---- ARTICLES slider ---- */
  (function(){
    var track=document.getElementById('artTrack'); if(!track||!window.VELARIS_POSTS) return;
    var posts=window.VELARIS_POSTS.slice(0,8);
    track.innerHTML=posts.map(function(p,i){
      return '<a class="art-card" href="post.html?slug='+p.slug+'"><div class="art-thumb"><div class="ph" style="background:'+thumb(p)+'"></div><span class="art-topic">'+p.cat+'</span></div>'+
        '<div class="art-body"><div class="art-tags"><span class="cat">'+p.cat+'</span><span>'+p.read+' min read</span></div>'+
        '<h3>'+p.title+'</h3><p>'+p.excerpt+'</p>'+
        '<span class="art-read">Read more '+ARROW+'</span></div></a>';
    }).join('');
    var idx=0;
    var prev=document.getElementById('artPrev'), next=document.getElementById('artNext');
    var dotsWrap=document.getElementById('artDots');
    function per(){ return window.innerWidth<=680?1:window.innerWidth<=1040?2:3; }
    function maxIdx(){ return Math.max(0,posts.length-per()); }
    function cardW(){ var c=track.querySelector('.art-card'); return c?c.getBoundingClientRect().width+24:384; }
    function buildDots(){ dotsWrap.innerHTML=''; for(var k=0;k<=maxIdx();k++){(function(n){
      var b=document.createElement('button'); if(n===0)b.className='on'; b.addEventListener('click',function(){ idx=n; render(); });
      dotsWrap.appendChild(b); })(k); } }
    function render(){ idx=Math.min(idx,maxIdx());
      track.style.transform='translateX(-'+(idx*cardW())+'px)';
      if(prev)prev.disabled=idx<=0; if(next)next.disabled=idx>=maxIdx();
      [].slice.call(dotsWrap.children).forEach(function(d,j){ d.classList.toggle('on',j===idx); }); }
    if(prev)prev.addEventListener('click',function(){ idx--; render(); });
    if(next)next.addEventListener('click',function(){ idx++; render(); });
    var rt; window.addEventListener('resize',function(){ clearTimeout(rt); rt=setTimeout(function(){ buildDots(); render(); },150); });
    buildDots(); render();
  })();

  revObserve(document.querySelectorAll('.reveal'));
})();
