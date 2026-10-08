/* Velaris v2 homepage: renders logos, work and reviews from window.VELARIS_* (Sanity or static data). */
(function(){
  'use strict';
  function esc(s){ return String(s == null ? '' : s).replace(/&amp;/g,'&').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  var logos = document.getElementById('vLogos');
  if(logos && window.VELARIS_LOGOS){
    logos.innerHTML = window.VELARIS_LOGOS.slice(0,7).map(function(l){
      return '<img src="'+esc(l.src)+'" alt="'+esc(l.name)+'" loading="lazy">';
    }).join('');
  }

  var work = document.getElementById('vWork');
  if(work && window.VELARIS_CASES){
    work.innerHTML = window.VELARIS_CASES.slice(0, +(work.getAttribute('data-limit') || 6)).map(function(c){
      return '<a class="v-case" href="/case-studies/'+encodeURIComponent(c.slug)+'">'+
        '<div class="shot" role="img" aria-label="'+esc(c.client)+' website" style="background-image:url(\''+esc(c.img)+'\')"></div>'+
        '<div class="meta"><div><b>'+esc(c.client)+'</b><small>'+esc(c.sector || c.tag)+'</small></div><span class="go">'+ARROW+'</span></div></a>';
    }).join('');
  }

  var reviews = document.getElementById('vReviews');
  if(reviews && window.VELARIS_TESTIMONIALS){
    reviews.innerHTML = window.VELARIS_TESTIMONIALS.slice(0,3).map(function(t){
      var stars = new Array((t.stars || 5) + 1).join('★');
      return '<figure class="v-review"><div class="stars" aria-label="'+(t.stars || 5)+' out of 5 stars">'+stars+'</div>'+
        '<blockquote>'+esc(t.quote)+'</blockquote>'+
        '<figcaption class="who">'+(t.avatar ? '<img src="'+esc(t.avatar)+'" alt="" loading="lazy">' : '')+
        '<div><b>'+esc(t.author)+'</b><small>'+esc(t.role)+'</small></div></figcaption></figure>';
    }).join('');
  }

  /* Animated counters: .v-stat b values like 30+, 5.0★, £30K count up once when scrolled into view.
     The final value stays in the HTML for SEO and no-JS visitors. */
  var stats = [].slice.call(document.querySelectorAll('.v-stat b'));
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(stats.length && !reduce && 'IntersectionObserver' in window){
    var parsed = stats.map(function(el){
      var m = el.textContent.match(/^([^\d]*)(\d[\d,]*(?:\.\d+)?)(.*)$/);
      if(!m) return null;
      var raw = m[2].replace(/,/g,''), dec = (raw.split('.')[1]||'').length;
      return {el:el, pre:m[1], to:parseFloat(raw), dec:dec, suf:m[3], comma:/,/.test(m[2]), final:el.textContent};
    }).filter(Boolean);
    var fmt = function(p, v){ var n = v.toFixed(p.dec); if(p.comma) n = Number(n).toLocaleString('en-US',{minimumFractionDigits:p.dec}); return p.pre+n+p.suf; };
    parsed.forEach(function(p){ p.el.textContent = fmt(p, 0); });
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(!en.isIntersecting) return;
        io.unobserve(en.target);
        var p = parsed.filter(function(x){ return x.el === en.target; })[0]; if(!p) return;
        var start = null, dur = 1400;
        (function tick(t){
          if(start === null) start = t;
          var k = Math.min((t-start)/dur, 1), eased = 1-Math.pow(1-k, 3);
          p.el.textContent = k < 1 ? fmt(p, p.to*eased) : p.final;
          if(k < 1) requestAnimationFrame(tick);
        })(performance.now());
      });
    },{threshold:.4});
    parsed.forEach(function(p){ io.observe(p.el); });
  }
})();
