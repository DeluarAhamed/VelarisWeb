/* Velaris Web — sub-page renderers (service / case / blog list / post detail) */
(function(){
  'use strict';
  var ARROW='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var CHECK='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12l5 5 9-11"/></svg>';
  var IC={code:'<path d="M8 7l-4 5 4 5M16 7l4 5-4 5M13 4l-2 16"/>',spark:'<path d="M12 3l2.5 5 5.5.8-4 3.9 1 5.5L12 21l-5-2.3 1-5.5-4-3.9L10.5 8z"/>',search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/>',mail:'<path d="M3 6l9 7 9-7M3 6v12h18V6"/>',ux:'<path d="M4 16l5-5 4 4 7-8"/><circle cx="4" cy="16" r="1.5"/>',brand:'<circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/>',webflow:'<path d="M3 8l9-4 9 4-9 4-9-4zM3 12l9 4 9-4M3 16l9 4 9-4"/>',framer:'<path d="M6 3h12v6H12zM6 9h6l6 6h-6v6z"/>'};
  function qs(k){ return new URLSearchParams(location.search).get(k); }
  function uns(id, w){ id=(id||'').replace('unsplash:',''); return 'https://images.unsplash.com/'+id+'?auto=format&fit=crop&w='+(w||800)+'&q=80'; }
  var GRADS={ "Local SEO":'linear-gradient(135deg,#0a5d5d,#1f8a5b,#0a3d3d)',"Web Design":'linear-gradient(135deg,#1a1a2e,#3a2a4a,#0f3460)',"Conversion":'linear-gradient(135deg,#ff9a56,#a259ff,#2d9bf0)',"Lead Generation":'linear-gradient(135deg,#0f2027,#2F9B95,#203a43)',"Webflow":'linear-gradient(135deg,#11212d,#2563eb,#0b1d2a)',"Framer":'linear-gradient(135deg,#1a1a1a,#444,#0d0d0d)',"AI Web Development":'linear-gradient(135deg,#2d1b4e,#7c3aed,#1e1b4b)',"Email Marketing":'linear-gradient(135deg,#0b1d2a,#0ea5a0,#072e2c)',"Branding":'linear-gradient(135deg,#2d1b4e,#c94b9c,#f4a261)',"Analytics":'linear-gradient(135deg,#0f2027,#203a43,#2c5364)' };
  /* category -> rotating Unsplash photos so blog covers do not repeat */
  var PIMG={
    "Local SEO":["photo-1524661135-423995f22d0b","photo-1486406146926-c627a92ad1ab","photo-1497366811353-6870744d04b2","photo-1500530855697-b586d89ba3ee","photo-1516321318423-f06f85e504b3"],
    "Web Design":["photo-1467232004584-a241de8bcf5d","photo-1498050108023-c5249f4df085","photo-1481487196290-c152efe083f5","photo-1559028012-481c04fa702d","photo-1519389950473-47ba0277781c"],
    "Conversion":["photo-1460925895917-afdab827c52f","photo-1551288049-bebda4e38f71","photo-1554224155-6726b3ff858f","photo-1542744173-8e7e53415bb0","photo-1553729459-efe14ef6055d"],
    "Lead Generation":["photo-1551288049-bebda4e38f71","photo-1556761175-b413da4baf72","photo-1552664730-d307ca884978","photo-1521791055366-0d553872125f","photo-1517245386807-bb43f82c33c4"],
    "Webflow":["photo-1547658719-da2b51169166","photo-1498050108023-c5249f4df085","photo-1515879218367-8466d910aaa4","photo-1555066931-4365d14bab8c","photo-1461749280684-dccba630e2f6"],
    "Framer":["photo-1517077304055-6e89abbf09b0","photo-1518005020951-eccb494ad742","photo-1559028006-448665bd7c7f","photo-1561070791-2526d30994b5","photo-1581291518857-4e27b48ff24e"],
    "AI Web Development":["photo-1620712943543-bcc4688e7485","photo-1677442136019-21780ecad995","photo-1674027444485-cec3da58eef4","photo-1518770660439-4636190af475","photo-1535223289827-42f1e9919769"],
    "Email Marketing":["photo-1596526131083-e8c633c948d2","photo-1563986768609-322da13575f3","photo-1557200134-90327ee9fafa","photo-1492724441997-5dc865305da7","photo-1516321497487-e288fb19713f"],
    "Branding":["photo-1626785774573-4b799315345d","photo-1600267185393-e158a98703de","photo-1516321318423-f06f85e504b3","photo-1523726491678-bf852e717f6a","photo-1512295767273-ac109ac3acfa"],
    "Analytics":["photo-1551288049-bebda4e38f71","photo-1460925895917-afdab827c52f","photo-1554224154-26032ffc0d07","photo-1542744095-fcf48d80b0fd","photo-1454165804606-c3d57bc86b40"]
  };
  function seedFor(p){ var key=(p.slug||p.title||p.kw||'velaris'); var n=0; for(var i=0;i<key.length;i++) n=(n+key.charCodeAt(i)*(i+11))%99991; return n; }
  function esc(s){ return String(s||'').replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
  function wrapWords(s,max){ var words=String(s||'').split(/\s+/), lines=[], line=''; words.forEach(function(w){ if((line+' '+w).trim().length>max&&line){ lines.push(line); line=w; } else line=(line+' '+w).trim(); }); if(line) lines.push(line); return lines.slice(0,3); }
  function coverSvg(p){
    var palettes={
      "Local SEO":['#0A5D5D','#2F9B95','#7FD3D6','#06111C'],
      "Web Design":['#1A2940','#6A4CF6','#49C9C0','#07111E'],
      "Conversion":['#1A2940','#F97316','#A259FF','#07111E'],
      "Lead Generation":['#07111E','#2F9B95','#D6F7F6','#0F424A'],
      "Webflow":['#0B1D2A','#2563EB','#7FD3D6','#07111E'],
      "Framer":['#111111','#4B5563','#F5F5F5','#050505'],
      "AI Web Development":['#22163F','#7C3AED','#7FD3D6','#0F172A'],
      "Email Marketing":['#082F49','#0EA5A0','#F4A261','#07111E'],
      "Branding":['#2D1B4E','#C94B9C','#F4A261','#160A22'],
      "Analytics":['#0F2027','#2C5364','#7FD3D6','#07111E']
    };
    var pal=palettes[p.cat]||['#07111E','#2F9B95','#7FD3D6','#0F424A'];
    var seed=seedFor(p), angle=115+(seed%50), x=8+(seed%72), y=16+(seed%54), lines=wrapWords(p.title,24), kw=esc(p.kw||p.cat||'SEO strategy');
    var bars=[0,1,2,3,4].map(function(i){ var h=38+((seed+i*17)%72), bx=654+i*38, by=314-h; return '<rect x="'+bx+'" y="'+by+'" width="22" height="'+h+'" rx="11" fill="'+(i%2?pal[2]:pal[1])+'" opacity="'+(.45+i*.08).toFixed(2)+'"/>'; }).join('');
    var title=lines.map(function(l,i){ return '<text x="64" y="'+(150+i*54)+'" font-family="Inter,Arial,sans-serif" font-size="44" font-weight="800" fill="#FFFFFF">'+esc(l)+'</text>'; }).join('');
    var svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 506">'+
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="'+pal[0]+'"/><stop offset=".58" stop-color="'+pal[3]+'"/><stop offset="1" stop-color="'+pal[1]+'"/></linearGradient>'+
      '<radialGradient id="r" cx="'+x+'%" cy="'+y+'%" r="70%"><stop stop-color="'+pal[2]+'" stop-opacity=".55"/><stop offset="1" stop-color="'+pal[2]+'" stop-opacity="0"/></radialGradient></defs>'+
      '<rect width="900" height="506" fill="url(#g)"/><rect width="900" height="506" fill="url(#r)"/>'+
      '<path d="M0 392 C170 326 258 474 424 396 S724 282 900 358 L900 506 L0 506 Z" fill="#ffffff" opacity=".08"/>'+
      '<g opacity=".16" stroke="#fff"><path d="M68 88H832M68 420H832M126 50V456M774 50V456"/></g>'+
      '<circle cx="'+(690+(seed%80))+'" cy="'+(128+(seed%70))+'" r="'+(70+(seed%38))+'" fill="'+pal[1]+'" opacity=".18"/>'+
      '<circle cx="'+(728-(seed%70))+'" cy="'+(168+(seed%54))+'" r="'+(42+(seed%28))+'" fill="'+pal[2]+'" opacity=".22"/>'+
      '<text x="64" y="72" font-family="Inter,Arial,sans-serif" font-size="18" font-weight="800" letter-spacing="3" fill="'+pal[2]+'">'+esc((p.cat||'INSIGHT').toUpperCase())+'</text>'+
      title+
      '<g transform="translate(64 362)"><rect width="'+Math.min(480,Math.max(180,kw.length*10+36))+'" height="44" rx="22" fill="#fff" opacity=".12"/><text x="22" y="29" font-family="Inter,Arial,sans-serif" font-size="16" font-weight="700" fill="#fff">'+kw+'</text></g>'+
      '<g transform="rotate('+angle+' 720 260)">'+bars+'</g>'+
      '<text x="64" y="466" font-family="Inter,Arial,sans-serif" font-size="15" font-weight="700" fill="#fff" opacity=".72">Velaris Web SEO Playbook</text>'+
      '</svg>';
    return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg);
  }
  function thumb(p, w){ return "background:linear-gradient(180deg,rgba(2,16,31,.05),rgba(2,16,31,.18)),url('"+coverSvg(p)+"') center/cover no-repeat"; }
  function seoKeywords(p){
    var rel={
      "Local SEO":["local SEO","Google Business Profile","map pack ranking","near me searches","local lead generation","service area SEO"],
      "Web Design":["website design","conversion web design","responsive website design","service business website","UX design","homepage design"],
      "Conversion":["conversion rate optimization","website conversion","CTA optimization","landing page optimization","trust signals","lead conversion"],
      "Lead Generation":["lead generation","qualified leads","lead magnet","sales funnel","website enquiries","booked calls"],
      "Webflow":["Webflow development","Webflow CMS","Webflow SEO","no-code website","CMS website","Webflow agency"],
      "Framer":["Framer development","Framer website","animated landing page","Framer CMS","fast launch website","interactive web design"],
      "AI Web Development":["AI web development","AI website","automation","Claude AI development","AI workflow","custom web app"],
      "Email Marketing":["email marketing","cold email","email automation","lead nurturing","outreach campaign","B2B email"],
      "Branding":["brand identity","logo design","brand system","visual identity","brand guidelines","brand strategy"],
      "Analytics":["website analytics","Google Search Console","conversion tracking","GA4","SEO reporting","performance dashboard"]
    };
    return [p.kw,p.title,p.cat].concat(rel[p.cat]||[]).filter(Boolean).join(', ');
  }
  function svcIcon(s){ return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">'+(IC[s.icon]||'')+'</svg>'; }

  /* ===== SERVICES LISTING ===== */
  var svcList=document.getElementById('svcListing');
  if(svcList && window.VELARIS_SERVICES){
    svcList.innerHTML=window.VELARIS_SERVICES.map(function(s){
      var feats=s.feats.map(function(f){ return '<li>'+CHECK+f+'</li>'; }).join('');
      return '<a class="svc'+(s.feat?' feat':'')+'" href="service.html?s='+s.slug+'" style="text-decoration:none;color:inherit">'+
        '<div class="svc-top"><div class="svc-ic">'+svcIcon(s)+'</div><span class="svc-n">'+s.tag+'</span></div>'+
        '<h3>'+s.name+'</h3><p>'+s.short+'</p><ul class="feats">'+feats+'</ul>'+
        '<span class="svc-link">Learn more '+ARROW+'</span></a>';
    }).join('');
  }

  /* ===== SERVICE DETAIL (musemind-structured, CMS-driven) ===== */
  var sd=document.getElementById('serviceDetail');
  if(sd && window.VELARIS_SERVICES){
    var s=window.VELARIS_SERVICES.filter(function(x){return x.slug===qs('s');})[0]||window.VELARIS_SERVICES[0];
    var plain=function(t){ return (t||'').replace(/&amp;/g,'&'); };
    var nameShort=plain(s.name).replace('Claude AI Web Development','Claude AI development');
    var capIcons=['ux','code','spark','search','brand','webflow'];
    var pathIcon=function(key){ return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">'+(IC[key]||IC.spark)+'</svg>'; };
    var pick=function(map){ return (map && (map[s.slug]||map._default)) || []; };

    document.title=plain(s.name)+' — Velaris Web';
    var md=document.querySelector('meta[name="description"]'); if(md) md.setAttribute('content',plain(s.intro));

    // ---- hero ----
    sd.querySelector('[data-crumb]').innerHTML=s.name;
    sd.querySelector('[data-tagline]').textContent=plain(s.tagline);
    sd.querySelector('[data-name]').innerHTML=s.name;
    sd.querySelector('[data-intro]').textContent=plain(s.intro);
    var hl=sd.querySelector('[data-highlights]');
    if(hl && s.highlights) hl.innerHTML=s.highlights.map(function(h){ return '<div class="svh"><b>'+h[0]+'</b><small>'+h[1]+'</small></div>'; }).join('');
    var hv=sd.querySelector('[data-hero-visual]');
    if(hv){
      var hImg=(window.VELARIS_SVC_MEDIA&&(window.VELARIS_SVC_MEDIA[s.slug]||window.VELARIS_SVC_MEDIA._default))||'photo-1467232004584-a241de8bcf5d';
      hv.innerHTML='<img src="'+uns(hImg,900)+'" alt="'+nameShort+'">'+
        '<span class="svc-hero-chip"><span class="dot"></span>Live client work</span>'+
        '<div class="svc-hero-badge"><span class="ic">'+svcIcon(s)+'</span><span><b>'+nameShort+'</b><small>Velaris Web</small></span></div>';
    }

    // ---- trusted-by logos ----
    var lg=sd.querySelector('[data-logos]');
    if(lg && window.VELARIS_CASES){
      lg.innerHTML=window.VELARIS_CASES.slice(0,6).map(function(c){
        return '<img src="'+c.logo+'" alt="'+c.client+'"'+(c.logoInvert?' style="filter:grayscale(1) brightness(0)"':'')+'>';
      }).join('');
    }

    // ---- process (per-service, with checklists) ----
    var ph=sd.querySelector('[data-proc-head]'); if(ph) ph.innerHTML='Our '+nameShort+' <span class="serif">process</span>';
    var pr=sd.querySelector('[data-process]');
    if(pr) pr.innerHTML=pick(window.VELARIS_SVC_PROCESS).map(function(st,i){
      var pts=(st.points||[]).map(function(p){ return '<li>'+CHECK+'<span>'+p+'</span></li>'; }).join('');
      return '<div class="proc-card"><span class="bgnum">0'+(i+1)+'</span><span class="step">Step 0'+(i+1)+'</span><h3>'+st.t+'</h3><p>'+st.d+'</p><ul class="proc-points">'+pts+'</ul></div>';
    }).join('');

    // ---- capabilities (what's included) ----
    var ih=sd.querySelector('[data-inc-head]'); if(ih) ih.innerHTML='Everything in '+nameShort.replace(/&/g,'&amp;')+' <span class="serif">included</span>';
    var cp=sd.querySelector('[data-caps]');
    if(cp){
      var caps=pick(window.VELARIS_SVC_CAPS);
      if(!caps.length && s.includes) caps=s.includes.map(function(f){ return [f,'']; });
      cp.innerHTML=caps.map(function(c,i){
        var num=(i+1<10?'0':'')+(i+1);
        return '<div class="cap2"><span class="cap-n">'+num+'</span><span class="cap-ic">'+pathIcon(capIcons[i%capIcons.length])+'</span>'+
          '<h3>'+c[0]+'</h3>'+(c[1]?'<p>'+c[1]+'</p>':'')+'</div>';
      }).join('');
    }

    // ---- benefits (why it works) ----
    var bv=sd.querySelector('[data-ben-visual]');
    if(bv){
      bv.innerHTML='<img src="'+uns('photo-1522071820081-009f0129c71c',800)+'" alt="The Velaris team at work">'+
        '<div class="ben-proof"><span class="stars">★★★★★</span><span><b>5.0 average</b><small>Trusted by founders</small></span></div>';
    }
    var bl=sd.querySelector('[data-benefits]');
    if(bl && window.VELARIS_SVC_BENEFITS) bl.innerHTML=window.VELARIS_SVC_BENEFITS.map(function(b){
      var pts=(b.points||[]).map(function(p){ return '<li>'+CHECK+'<span>'+p+'</span></li>'; }).join('');
      return '<div class="ben-item"><h3>'+b.t+'</h3><p>'+b.d+'</p><ul class="ben-points">'+pts+'</ul></div>';
    }).join('');

    // ---- success story (related case with a testimonial) ----
    var sw=sd.querySelector('[data-story-wrap]');
    if(sw && window.VELARIS_CASES){
      var firstWord=plain(s.name).split(' ')[0].toLowerCase();
      var story=window.VELARIS_CASES.filter(function(c){ return c.quote && c.services && c.services.join(' ').toLowerCase().indexOf(firstWord)>-1; })[0]
        || window.VELARIS_CASES.filter(function(c){ return c.quote; })[0];
      if(story){
        sd.querySelector('[data-story-quote]').textContent='“'+plain(story.quote)+'”';
        sd.querySelector('[data-story-who]').innerHTML='<span class="av" style="background-image:url('+story.avatar+')"></span><span><b>'+story.author+'</b><span>'+story.role+'</span></span>';
        var sl=sd.querySelector('[data-story-link]'); if(sl) sl.href='case.html?c='+story.slug;
        sd.querySelector('[data-story-stats]').innerHTML=(story.stats||[]).slice(0,4).map(function(st){
          return '<div class="ss"><b>'+st[0]+'</b><small>'+st[1]+'</small></div>';
        }).join('');
      } else { sw.style.display='none'; }
    }

    // ---- industries (global) ----
    var ind=sd.querySelector('[data-industries]');
    if(ind && window.VELARIS_INDUSTRIES) ind.innerHTML=window.VELARIS_INDUSTRIES.map(function(x,i){
      return '<div class="ind-card"><span class="ind-x">0'+(i+1)+'</span><h3>'+x.name+'</h3><p>'+x.desc+'</p></div>';
    }).join('');

    // ---- why velaris (global) ----
    var wy=sd.querySelector('[data-whyus]');
    if(wy && window.VELARIS_WHYUS) wy.innerHTML=window.VELARIS_WHYUS.map(function(x,i){
      return '<div class="why-card"><span class="wic">'+pathIcon(capIcons[i%capIcons.length])+'</span><h3>'+x.t+'</h3><p>'+x.d+'</p></div>';
    }).join('');

    // ---- related work ----
    var rw=sd.querySelector('[data-related-work]');
    if(rw && window.VELARIS_CASES){
      var rel=window.VELARIS_CASES.filter(function(c){ return c.services.join(' ').toLowerCase().indexOf(plain(s.name).split(' ')[0].toLowerCase())>-1; });
      if(rel.length<2) rel=window.VELARIS_CASES.slice(0,3);
      rw.innerHTML=rel.slice(0,3).map(function(c){
        return '<a class="svw-card" href="case.html?c='+c.slug+'"><div class="svw-img"><img src="'+c.img+'" alt="'+c.client+'"></div>'+
          '<div class="svw-b"><span>'+c.sector+'</span><b>'+c.client+'</b></div></a>';
      }).join('');
    }

    // ---- other services ----
    var others=window.VELARIS_SERVICES.filter(function(x){return x.slug!==s.slug;}).slice(0,3);
    var ow=document.getElementById('svcOther');
    if(ow) ow.innerHTML=others.map(function(o){
      return '<a href="service.html?s='+o.slug+'"><span class="ic">'+svcIcon(o)+'</span><span><b>'+o.name+'</b><span>'+o.tagline+'</span></span></a>';
    }).join('');
  }

  /* ===== WORK / PORTFOLIO LIST ===== */
  var wl=document.getElementById('workList');
  if(wl && window.VELARIS_CASES){
    var workCardsHTML=window.VELARIS_CASES.map(function(c,idx){
      var title=c.title.map(function(seg,k){ return k%2 ? '<span class="serif">'+seg+'</span>' : seg; }).join('');
      var stats=c.stats.map(function(s){ return '<div><b>'+s[0]+'</b><small>'+s[1]+'</small></div>'; }).join('');
      var foot = c.quote
        ? '<div class="sc-quote"><span class="av" style="background-image:url('+c.avatar+')"></span><div><p class="qt">"'+c.quote.slice(0,160)+(c.quote.length>160?'…':'')+'"</p><span class="nm">'+c.author+' <span class="rl">— '+c.role+'</span></span></div></div>'
        : '<div class="sc-outcome"><span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 16l5-5 4 4 7-8"/><circle cx="4" cy="16" r="1.4"/></svg></span><p><b>The outcome</b>'+c.outcome+'</p></div>';
      return '<a class="stack-card'+(c.dark?' dark':'')+'" style="z-index:'+(10+idx)+'" href="case.html?c='+c.slug+'">'+
        '<div class="sc-text"><div class="sc-top"><span class="sc-num">CASE '+c.n+'</span><span class="sc-sector">'+c.sector+'</span></div>'+
        '<img class="sc-logo" src="'+c.logo+'" alt="'+c.client+'"'+(c.logoInvert?' style="filter:brightness(0) invert(1)"':'')+'>'+
        '<h3>'+title+'</h3><p class="sum">'+c.summary+'</p>'+
        '<div class="sc-stats">'+stats+'</div>'+foot+
        '<span class="sc-read">Read full case study <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></div>'+
        '<div class="sc-visual"><img src="'+c.img+'" alt="'+c.client+' website"></div></a>';
    }).join('');
    wl.innerHTML='<div class="stack-pin">'+workCardsHTML+'</div>';
    if(window.VelarisInitStack) window.VelarisInitStack(wl);
  }
  var cd=document.getElementById('caseDetail');
  if(cd && window.VELARIS_CASES){
    var list=window.VELARIS_CASES;
    var i=Math.max(0,list.map(function(x){return x.slug;}).indexOf(qs('c')));
    var c=list[i];
    cd.classList.add('case-'+c.slug);
    if(c.fonts){
      if(c.fonts.uiStack) cd.style.setProperty('--case-font-ui', c.fonts.uiStack);
      else if(c.fonts.ui) cd.style.setProperty('--case-font-ui', '"'+c.fonts.ui+'", var(--font-ui)');
      if(c.fonts.displayStack) cd.style.setProperty('--case-font-display', c.fonts.displayStack);
      else if(c.fonts.display) cd.style.setProperty('--case-font-display', '"'+c.fonts.display+'", var(--font-display)');
    }
    document.title=c.client+' Case Study — Velaris Web';
    var md2=document.querySelector('meta[name="description"]'); if(md2) md2.setAttribute('content',c.summary);

    // per-case enrichment (palettes + requirement copy)
    var PAL={
      hazelwood:['#0E7C86','#7FC6CD','#0B2B3A','#EAF4F5'],
      navasana:['#104C45','#9BFFA8','#15233C','#F4F6F7'],
      core:['#2F63F4','#294BC4','#050505','#F4F6FF'],
      bellavista:['#02053D','#D2B15F','#0A0B2A','#F5F1E6'],
      coastal:['#15607A','#6FB3C9','#0A2D3A','#EFE6D8'],
      menstruation:['#D94F92','#A57AD8','#351C42','#FCE8F1']
    };
    var REQ={
      hazelwood:"Hazelwood needed a website that made booking a hearing appointment effortless, ranked for high-intent local searches, and built immediate trust with an older, care-focused audience from the very first screen.",
      navasana:"Navasana needed to translate a sophisticated AI cyber-insurance product into a clear, credible experience that earned the confidence of technical, enterprise buyers and consistently drove qualified demo requests.",
      core:"Core needed a website that reflected the depth of their concept-to-product engineering, positioned them as a premium partner, and turned serious product teams into qualified enquiries.",
      bellavista:"Bellavista needed an institutional-grade digital presence that signalled credibility to investors and founders, with a clear architecture spanning real estate, private equity and M&amp;A.",
      coastal:"Coastal Crest needed a modern, trustworthy lettings website that felt approachable to landlords and tenants while bringing a 20-year, family-run business confidently online.",
      menstruation:"Menstruacion needed a warm, expert-led resource that discussed a sensitive topic with reassurance and clarity — comfortable and trustworthy for both parents and teens."
    };
    var KW={
      hazelwood:["hearing test near me","hearing aids [city]","ear wax removal near me","audiologist near me","book hearing appointment","NHS hearing aid alternative","tinnitus clinic","hearing care clinic"],
      navasana:["AI cyber insurance","cyber insurance platform","cyber risk assessment software","cyber insurance for SaaS","automated cyber underwriting","cyber liability cover","insurtech cyber platform"],
      core:["mechanical design consultancy","product design engineering","concept to product","CAD design services","prototype to production","product development partner","engineering design firm"],
      bellavista:["private equity firm [city]","real estate investment firm","M&amp;A advisory","capital investment partners","institutional investment","property investment fund","private capital advisory"],
      coastal:["letting agents [city]","property management near me","landlord services","rent my property","residential lettings","trusted letting agent","tenant find service"],
      menstruation:["first period guide","talking to teens about periods","period education for parents","menstrual health resource","period products guide","puberty support for parents","femtech health platform"]
    };
    var pal=c.palette||PAL[c.slug]||['#2F9B95','#49C9C0','#02101F','#F5F3EE'];
    var industry=(c.sector.split('·')[1]||c.sector).trim();
    var gal=c.gallery&&c.gallery.length?c.gallery:[c.img];
    var pageImgs=(c.pages&&c.pages.length)?c.pages.map(function(p){ return p.img; }):[];
    var visualSet=pageImgs.length?pageImgs:gal;

    cd.querySelector('[data-crumb]').textContent=c.client;
    cd.querySelector('[data-sector]').textContent=c.sector;
    cd.querySelector('[data-head]').innerHTML=c.headline;
    cd.querySelector('[data-summary]').textContent=c.summary;
    cd.querySelector('[data-client]').textContent=c.projectClient||c.client;
    cd.querySelector('[data-services]').innerHTML=c.services.join(', ');
    cd.querySelector('[data-industry]').textContent=industry;
    cd.querySelector('[data-deliverables]').innerHTML=(c.deliverables&&c.deliverables.length?c.deliverables:c.services.slice(0,3).concat(['Launch & SEO'])).join(', ');
    var timeline=cd.querySelector('[data-timeline]');
    if(timeline) timeline.textContent=c.timeline||'From 1 week';
    cd.querySelector('[data-about]').textContent=c.summary;
    cd.querySelector('[data-requirement]').innerHTML=REQ[c.slug]||c.summary;
    cd.querySelector('[data-challenge]').textContent=c.challenge;
    cd.querySelector('[data-approach]').textContent=c.approach;
    cd.querySelector('[data-outcome]').textContent=c.outcome;

    // SEO keywords
    var kws=KW[c.slug]||['web design','lead generation','local seo'];
    cd.querySelector('[data-keywords]').innerHTML=kws.map(function(k){ return '<span class="kw">'+k+'</span>'; }).join('');

    // hero visual on a palette panel
    cd.querySelector('[data-hero]').style.background='linear-gradient(150deg,'+pal[0]+','+pal[2]+')';
    cd.querySelector('[data-hero]').innerHTML='<img src="'+c.img+'" alt="'+c.client+' website">';

    // about 3-up gallery (reuse available images, pad with hero)
    var g3=[visualSet[0]||c.img,visualSet[1]||gal[1]||c.img,visualSet[2]||gal[2]||gal[0]||c.img];
    cd.querySelector('[data-gallery3]').innerHTML=g3.map(function(g,k){
      return '<div class="g3" style="background:linear-gradient(150deg,'+pal[k%2]+','+pal[2]+')"><img src="'+g+'" alt="'+c.client+' visual"></div>';
    }).join('');

    // solutions showcase (laptop on color)
    cd.querySelector('[data-showcase-a]').innerHTML=
      '<div class="sh-panel" style="background:'+pal[3]+'"><div class="sh-float lg" style="box-shadow:0 50px 90px -40px '+pal[2]+'66"><img src="'+(visualSet[0]||c.img)+'" alt="'+c.client+' desktop"></div></div>';

    // style guide: type specimen + palette
    var displayFont=(c.fonts&&c.fonts.display)||'Zodiak';
    var uiFont=(c.fonts&&c.fonts.ui)||'Cabinet Grotesk';
    cd.querySelector('[data-type]').innerHTML=
      '<div class="cs-type-card"><div class="ct-big serif">Aa</div><div class="ct-info"><b>'+displayFont+'</b><span>Display &amp; headings</span><div class="ct-line serif">The quick brown fox</div></div></div>'+
      '<div class="cs-type-card"><div class="ct-big">Aa</div><div class="ct-info"><b>'+uiFont+'</b><span>Interface &amp; body copy</span><div class="ct-line">The quick brown fox</div></div></div>';
    cd.querySelector('[data-palette]').innerHTML=pal.map(function(hex){
      return '<div class="sw"><span class="sw-c" style="background:'+hex+'"></span><small>'+hex.toUpperCase()+'</small></div>';
    }).join('');
    cd.querySelector('[data-showcase-b]').innerHTML=
      '<div class="sh-panel" style="background:linear-gradient(150deg,'+pal[0]+','+pal[2]+')"><div class="sh-float tab"><img src="'+(visualSet[1]||gal[1]||c.img)+'" alt="'+c.client+' tablet"></div></div>';

    // work in detail grid (mix of available shots)
    var det=[visualSet[0]||c.img, visualSet[1]||gal[1]||c.img, visualSet[2]||gal[2]||gal[0]||c.img];
    cd.querySelector('[data-detail]').innerHTML=
      '<div class="dt-tall"><img src="'+det[0]+'" alt="'+c.client+' full page"></div>'+
      '<div class="dt-side">'+
        '<div class="dt-card" style="background:'+pal[3]+'"><img src="'+det[1]+'" alt="'+c.client+' screen"></div>'+
        '<div class="dt-card" style="background:linear-gradient(150deg,'+pal[1]+','+pal[2]+')"><img src="'+det[2]+'" alt="'+c.client+' screen"></div>'+
      '</div>';

    var pageGallery = cd.querySelector('[data-page-gallery]');
    var pageHead = cd.querySelector('[data-page-gallery-head]');
    if(pageGallery && c.pages && c.pages.length){
      pageGallery.innerHTML = c.pages.map(function(p){
        return '<article class="cs-page-shot"><div class="cs-page-cap"><span>'+p.title+'</span><small>'+c.client+'</small></div><img src="'+p.img+'" alt="'+c.client+' '+p.title+' page"></article>';
      }).join('');
    } else {
      if(pageGallery) pageGallery.style.display='none';
      if(pageHead) pageHead.style.display='none';
    }

    // results stats
    cd.querySelector('[data-meta]').innerHTML=c.stats.map(function(st){ return '<div class="cm"><b>'+st[0]+'</b><small>'+st[1]+'</small></div>'; }).join('');
    cd.querySelector('[data-showcase-c]').innerHTML=
      '<div class="sh-panel" style="background:linear-gradient(150deg,'+pal[1]+','+pal[0]+')"><div class="sh-float lg"><img src="'+c.img+'" alt="'+c.client+' result"></div></div>';

    // live links
    var lv=cd.querySelector('[data-live]');
    if(c.live){ if(lv)lv.href=c.live; }
    else if(lv){ lv.style.display='none'; }

    // quote
    var qb=cd.querySelector('[data-quote]');
    if(c.quote){
      qb.innerHTML='<p>"'+c.quote+'"</p><div class="who"><span class="av" style="background-image:url('+c.avatar+')"></span><span><b>'+c.author+'</b><span>'+c.role+'</span></span></div>';
    } else { var qw=cd.querySelector('[data-quote-wrap]'); if(qw) qw.style.display='none'; }

    // prev/next
    var prev=list[(i-1+list.length)%list.length], next=list[(i+1)%list.length];
    var cn=cd.querySelector('[data-casenav]');
    if(cn) cn.innerHTML='<a href="case.html?c='+prev.slug+'"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 6l-6 6 6 6"/></svg> '+prev.client+'</a>'+
      '<a href="case.html?c='+next.slug+'">'+next.client+' <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 6l6 6-6 6"/></svg></a>';

    // scroll reveal for case sections
    var cobs=new IntersectionObserver(function(es){ es.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); cobs.unobserve(en.target);} }); },{threshold:.12});
    cd.querySelectorAll('.reveal').forEach(function(el){ cobs.observe(el); });
  }

  /* ===== RESOURCES ===== */
  var rg=document.getElementById('resGrid');
  if(rg && window.VELARIS_RESOURCES){
    rg.innerHTML=window.VELARIS_RESOURCES.map(function(r){
      var free=/free/i.test(r.price);
      var href=/playbook/i.test(r.title+' '+r.desc+' '+r.cta) ? 'playbook.html' : 'about.html#contact';
      return '<a class="res-card'+(r.featured?' feat':'')+'" href="'+href+'">'+
        '<div class="res-thumb" style="background:linear-gradient(180deg,rgba(2,16,31,.18),rgba(2,16,31,.66)),url('+uns(r.img,700)+') center/cover">'+
          '<span class="res-type">'+r.type+'</span>'+
          '<span class="res-price'+(free?' free':'')+'">'+r.price+'</span></div>'+
        '<div class="res-body"><span class="res-cat">'+r.cat+'</span>'+
        '<h3>'+r.title+'</h3><p>'+r.desc+'</p>'+
        '<span class="res-cta">'+r.cta+' <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></div></a>';
    }).join('');
  }

  /* ===== BLOG LISTING ===== */
  var bl=document.getElementById('blogListing');
  if(bl && window.VELARIS_POSTS){
    var posts=window.VELARIS_POSTS, PAGE=9, shown=PAGE, filter='All';
    // featured (first two)
    var fw=document.getElementById('blogFeatured');
    if(fw) fw.innerHTML=posts.slice(0,2).map(function(p){
      return '<a class="feat-post" href="post.html?slug='+p.slug+'"><div class="thumb" style="'+thumb(p,900)+'"><span class="topic">'+p.cat+'</span></div>'+
        '<div class="fb"><div class="tags"><span class="cat">'+p.cat+'</span><span>'+p.date+'</span><span>'+p.read+' min read</span></div>'+
        '<h3>'+p.title+'</h3><p>'+p.excerpt+'</p><span class="more">Read more '+ARROW+'</span></div></a>';
    }).join('');
    var cats=['All'].concat(Object.keys(posts.reduce(function(a,p){a[p.cat]=1;return a;},{})));
    var fbar=document.getElementById('blogFilters');
    var grid=document.getElementById('blogGrid');
    var countEl=document.getElementById('blogCount');
    var moreBtn=document.getElementById('blogMore');
    cats.forEach(function(cat){
      var b=document.createElement('button'); b.className='chip'+(cat==='All'?' on':''); b.textContent=cat;
      b.addEventListener('click',function(){ filter=cat; shown=PAGE; fbar.querySelectorAll('.chip').forEach(function(x){x.classList.remove('on');}); b.classList.add('on'); render(); });
      fbar.appendChild(b);
    });
    function listFor(){ return filter==='All'?posts:posts.filter(function(p){return p.cat===filter;}); }
    function render(){
      var data=listFor(), slice=data.slice(0,shown);
      grid.innerHTML=slice.map(function(p){
        return '<a class="pcard" href="post.html?slug='+p.slug+'"><div class="thumb" style="'+thumb(p)+'"><span class="topic">'+p.cat+'</span></div>'+
          '<div class="pb"><div class="tags"><span class="cat">'+p.cat+'</span><span>'+p.read+' min</span></div>'+
          '<h3>'+p.title+'</h3><p>'+p.excerpt+'</p><span class="more">Read more '+ARROW+'</span></div></a>';
      }).join('');
      countEl.textContent='Showing '+slice.length+' of '+data.length+' articles ('+posts.length+' in the CMS)';
      moreBtn.style.display=shown<data.length?'':'none';
    }
    moreBtn.addEventListener('click',function(){ shown+=PAGE; render(); });
    render();
  }

  /* ===== POST DETAIL ===== */
  var pd=document.getElementById('postDetail');
  if(pd && window.VELARIS_POSTS){
    var P=window.VELARIS_POSTS, pi=Math.max(0,P.map(function(x){return x.slug;}).indexOf(qs('slug'))), post=P[pi];
    document.title=post.title+' — Velaris Web';
    var md3=document.querySelector('meta[name="description"]'); if(md3) md3.setAttribute('content',post.excerpt);
    var mk=document.querySelector('meta[name="keywords"]');
    if(!mk){ mk=document.createElement('meta'); mk.setAttribute('name','keywords'); document.head.appendChild(mk); }
    mk.setAttribute('content',seoKeywords(post));
    pd.querySelector('[data-crumb]').textContent=post.cat;
    pd.querySelector('[data-cat]').textContent=post.cat;
    pd.querySelector('[data-date]').textContent=post.date;
    pd.querySelector('[data-read]').textContent=post.read+' min read';
    pd.querySelector('[data-title]').textContent=post.title;
    pd.querySelector('[data-cover]').style.cssText=thumb(post,1400);
    pd.querySelector('[data-topic]').textContent=post.cat;
    pd.querySelector('[data-body]').innerHTML=post.body;
    // related: same category
    var rel=P.filter(function(x){return x.cat===post.cat && x.slug!==post.slug;}).slice(0,3);
    if(rel.length<3) rel=rel.concat(P.filter(function(x){return x.slug!==post.slug && rel.indexOf(x)<0;}).slice(0,3-rel.length));
    var rw=pd.querySelector('[data-related]');
    if(rw) rw.innerHTML=rel.map(function(p){
      return '<a class="pcard" href="post.html?slug='+p.slug+'"><div class="thumb" style="'+thumb(p)+'"><span class="topic">'+p.cat+'</span></div>'+
        '<div class="pb"><div class="tags"><span class="cat">'+p.cat+'</span><span>'+p.read+' min</span></div>'+
        '<h3>'+p.title+'</h3><p>'+p.excerpt+'</p><span class="more">Read more '+ARROW+'</span></div></a>';
    }).join('');
  }

  /* reveal */
  var revObs=new IntersectionObserver(function(es){ es.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); revObs.unobserve(en.target);} }); },{threshold:.1});
  document.querySelectorAll('.reveal').forEach(function(el){ revObs.observe(el); });

  /* FAQ accordion (pricing / service pages reuse) */
  document.querySelectorAll('[data-faq]').forEach(function(list){
    if(!window.VELARIS_FAQS) return;
    list.innerHTML=window.VELARIS_FAQS.slice(0, +(list.getAttribute('data-faq')||6)).map(function(f){
      return '<div class="faq-item"><button class="faq-q">'+f.q+'<span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 5v14M5 12h14"/></svg></span></button><div class="faq-a"><p>'+f.a+'</p></div></div>';
    }).join('');
    list.querySelectorAll('.faq-item').forEach(function(item){
      var q=item.querySelector('.faq-q'), a=item.querySelector('.faq-a');
      q.addEventListener('click',function(){
        var open=item.classList.contains('open');
        list.querySelectorAll('.faq-item.open').forEach(function(o){ o.classList.remove('open'); o.querySelector('.faq-a').style.maxHeight='0'; });
        if(!open){ item.classList.add('open'); a.style.maxHeight=a.scrollHeight+'px'; }
      });
    });
  });

  /* PRICING + PROCESS render */
  var pg=document.getElementById('priceGrid');
  if(pg && window.VELARIS_PRICING){
    pg.innerHTML=window.VELARIS_PRICING.map(function(p){
      var feats=p.feats.map(function(f){ return '<li>'+CHECK+f+'</li>'; }).join('');
      return '<div class="price-card'+(p.feat?' feat':'')+'">'+(p.feat?'<span class="price-badge">Most popular</span>':'')+
        '<span class="price-tag">'+p.name+'</span>'+
        '<div class="price-amt"><b>'+p.price+'</b><span>'+p.per+'</span></div>'+
        '<p class="tl">'+p.tagline+'</p>'+
        '<ul class="price-feats">'+feats+'</ul>'+
        '<a class="btn '+(p.feat?'btn-teal':'btn-dark')+'" data-inquiry href="#start">'+p.cta+'</a></div>';
    }).join('');
  }
  /* individual service pricing */
  var spg=document.getElementById('servicePricing');
  if(spg && window.VELARIS_SERVICE_PRICING){
    spg.innerHTML=window.VELARIS_SERVICE_PRICING.map(function(p){
      return '<a class="sprice" href="service.html?s='+p.slug+'">'+
        '<span class="sp-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">'+(IC[p.icon]||'')+'</svg></span>'+
        '<div class="sp-body"><b>'+p.name+'</b><span>'+p.note+'</span></div>'+
        '<div class="sp-price">'+p.price+'</div></a>';
    }).join('');
  }
  var pr=document.getElementById('procRail');
  if(pr && window.VELARIS_PROCESS){
    pr.innerHTML=window.VELARIS_PROCESS.map(function(p){
      var tags=p.tags.map(function(t){ return '<span>'+t+'</span>'; }).join('');
      return '<div class="proc-row reveal"><div class="proc-n">'+p.n+'</div>'+
        '<div class="proc-mid"><h3>'+p.title+'</h3><p>'+p.desc+'</p><div class="tags">'+tags+'</div></div>'+
        '<div class="proc-out"><small>Output</small>'+p.out+'</div></div>';
    }).join('');
    pr.querySelectorAll('.reveal').forEach(function(el){ revObs.observe(el); });
  }
})();
