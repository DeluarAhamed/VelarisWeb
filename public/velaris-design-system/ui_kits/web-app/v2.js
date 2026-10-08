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
      return '<a class="v-case" href="/case?c='+encodeURIComponent(c.slug)+'">'+
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
})();
