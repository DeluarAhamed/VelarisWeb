/* Optional Sanity -> current static renderer bridge.
   This keeps the existing HTML/JS app editable from Sanity without a full rebuild. */
(function () {
  'use strict';

  var cfg = window.VELARIS_SANITY || {};
  if (!cfg.projectId || cfg.projectId === 'replace-with-project-id') return;

  var basePath = '';
  try {
    basePath = document.body.getAttribute('data-base') || '';
  } catch (_) {}

  function clean(s) {
    return String(s || '').replace(/&/g, '&amp;');
  }

  function plain(s) {
    return String(s || '').replace(/&amp;/g, '&');
  }

  function legacy(path) {
    if (!path) return '';
    if (/^(https?:|data:|\/)/.test(path)) return path;
    return basePath + String(path).replace(/^(home-img\/.+)\.(png|jpe?g)$/i, '$1.webp');
  }

  function imageFrom(obj, fallback) {
    if (obj && obj.asset && obj.asset.url) return obj.asset.url;
    if (obj && obj.legacyPath) return legacy(obj.legacyPath);
    return legacy(fallback || '');
  }

  function slugOf(doc) {
    return doc && doc.slug && doc.slug.current ? doc.slug.current : '';
  }

  function statTuple(item) {
    return [plain(item && item.value), plain(item && item.label)];
  }

  function sectionTitle(headline) {
    var text = plain(headline || '');
    if (!text) return ['Project', ' story'];
    var words = text.split(/\s+/);
    if (words.length < 4) return [text];
    var mid = Math.max(1, Math.floor(words.length / 2));
    return [words.slice(0, mid).join(' ') + ' ', words.slice(mid).join(' ')];
  }

  function blockText(block) {
    if (!block || block._type !== 'block') return '';
    return (block.children || []).map(function (child) { return child.text || ''; }).join('');
  }

  function bodyToHtml(body, legacyHtml) {
    if (legacyHtml) return legacyHtml;
    return (body || []).map(function (block) {
      if (block._type === 'block') {
        var text = clean(blockText(block));
        if (!text) return '';
        if (block.style === 'h2') return '<h2>' + text + '</h2>';
        if (block.style === 'h3') return '<h3>' + text + '</h3>';
        if (block.style === 'blockquote') return '<blockquote>' + text + '</blockquote>';
        return '<p>' + text + '</p>';
      }
      if (block._type === 'imageWithAlt') {
        return '<figure><img src="' + imageFrom(block) + '" alt="' + clean(block.alt || '') + '"></figure>';
      }
      if (block._type === 'callout') {
        return '<figure class="blog-visual"><div class="bv-head"><b>' + clean(block.title || 'Note') + '</b><span>' + clean(block.tone || 'Insight') + '</span></div><p>' + clean(block.text || '') + '</p></figure>';
      }
      if (block._type === 'infographic') {
        var items = (block.items || []).map(function (item, i) {
          return '<div class="bv-cell"><span class="bv-num">0' + (i + 1) + '</span><strong>' + clean(item.title) + '</strong><small>' + clean(item.description) + '</small></div>';
        }).join('');
        return '<figure class="blog-visual"><div class="bv-head"><b>' + clean(block.title || 'Framework') + '</b><span>' + clean(block.label || 'Infographic') + '</span></div><div class="bv-grid">' + items + '</div></figure>';
      }
      return '';
    }).join('');
  }

  var query = encodeURIComponent([
    '{',
    '"services":*[_type=="service"]|order(orderRank asc){name,slug,tag,icon,featured,shortDescription,tagline,intro,features,includes,highlights[]{value,label},bestFor,deliverable,startingPrice},',
    '"cases":*[_type=="caseStudy"]|order(caseNumber asc){client,slug,caseNumber,sector,industry,projectClient,headline,summary,challenge,approach,outcome,liveUrl,featured,darkTheme,logo{asset->{url},alt,legacyPath},logoPath,heroImage{asset->{url},alt,legacyPath},heroImagePath,gallery[]{asset->{url},alt,legacyPath},galleryPaths,pageScreenshots[]{title,image{asset->{url},alt,legacyPath},legacyPath},services,deliverables,timeline,results[]{value,label},quote,quoteAuthor,quoteRole,quoteAvatar{asset->{url},alt,legacyPath},quoteAvatarPath,fonts,palette[]{hex},targetKeywords},',
    '"testimonials":*[_type=="testimonial"]|order(_createdAt asc){name,role,company,quote,stars,avatar{asset->{url},alt,legacyPath},avatarPath,featured},',
    '"logos":*[_type=="clientLogo"]|order(_createdAt asc){name,logo{asset->{url},alt,legacyPath},logoPath,website},',
    '"resources":*[_type=="resource"]|order(featured desc,_createdAt asc){title,slug,resourceType,category,price,description,coverImage{asset->{url},alt,legacyPath},coverImagePath,ctaLabel,featured},',
    '"posts":*[_type=="post"]|order(publishedAt desc){title,slug,category->{title},categoryName,targetKeyword,excerpt,coverImage{asset->{url},alt,legacyPath},coverGraphicKey,author->{name},authorName,publishedAt,readTimeMinutes,body,legacyHtmlBody,seo},',
    '"faqs":*[_type=="faq"]|order(orderRank asc){question,answer},',
    '"pricing":*[_type=="pricingPlan"]|order(orderRank asc){name,price,period,tagline,features,cta,featured}',
    '}'
  ].join(''));

  var url = 'https://' + cfg.projectId + '.api.sanity.io/v' + (cfg.apiVersion || '2026-07-03') + '/data/query/' + (cfg.dataset || 'production') + '?query=' + query;

  try {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send(null);
    if (xhr.status < 200 || xhr.status >= 300) return;
    var result = JSON.parse(xhr.responseText).result || {};

    if (result.services && result.services.length) {
      window.VELARIS_SERVICES = result.services.map(function (s, i) {
        return {
          slug: slugOf(s),
          tag: s.tag || String(i + 1).padStart(2, '0'),
          name: clean(s.name),
          icon: s.icon || 'spark',
          feat: !!s.featured,
          short: clean(s.shortDescription),
          feats: s.features || [],
          tagline: clean(s.tagline),
          intro: plain(s.intro),
          includes: s.includes || [],
          highlights: (s.highlights || []).map(statTuple),
          bestfor: plain(s.bestFor),
          deliverable: plain(s.deliverable),
          startingPrice: plain(s.startingPrice)
        };
      });
    }

    if (result.cases && result.cases.length) {
      window.VELARIS_CASES = result.cases.map(function (c) {
        var hero = imageFrom(c.heroImage, c.heroImagePath);
        return {
          slug: slugOf(c),
          n: c.caseNumber || '',
          client: clean(c.client),
          sector: clean(c.sector),
          logo: imageFrom(c.logo, c.logoPath),
          logoInvert: !!c.darkTheme,
          dark: !!c.darkTheme,
          featured: !!c.featured,
          projectClient: plain(c.projectClient),
          timeline: plain(c.timeline),
          fonts: c.fonts || {},
          palette: (c.palette || []).map(function (p) { return p.hex; }).filter(Boolean),
          title: sectionTitle(c.headline),
          headline: clean(c.headline),
          summary: plain(c.summary),
          img: hero,
          gallery: (c.gallery && c.gallery.length ? c.gallery.map(function (g) { return imageFrom(g); }) : c.galleryPaths || [hero]).filter(Boolean),
          live: c.liveUrl || '',
          pages: (c.pageScreenshots || []).map(function (p) { return {title: plain(p.title), img: imageFrom(p.image, p.legacyPath)}; }).filter(function (p) { return p.img; }),
          services: c.services || [],
          deliverables: c.deliverables || [],
          stats: (c.results || []).map(statTuple),
          challenge: plain(c.challenge),
          approach: plain(c.approach),
          outcome: plain(c.outcome),
          quote: plain(c.quote),
          author: plain(c.quoteAuthor),
          role: plain(c.quoteRole),
          avatar: imageFrom(c.quoteAvatar, c.quoteAvatarPath),
          targetKeywords: c.targetKeywords || []
        };
      });
      window.VELARIS_HERO_SLIDES = window.VELARIS_CASES.map(function (c) {
        return {client: plain(c.client), tag: plain(c.sector), img: c.img, headline: plain(c.headline), blurb: plain(c.summary), href: '/case?c=' + c.slug};
      });
    }

    if (result.testimonials && result.testimonials.length) {
      window.VELARIS_TESTIMONIALS = result.testimonials.map(function (t) {
        return {
          quote: plain(t.quote),
          stars: t.stars || 5,
          author: plain(t.name),
          role: plain(t.role || t.company),
          avatar: imageFrom(t.avatar, t.avatarPath),
          url: '',
          avatarLogo: false
        };
      });
    }

    if (result.logos && result.logos.length) {
      window.VELARIS_LOGOS = result.logos.map(function (l) {
        return {name: plain(l.name), src: imageFrom(l.logo, l.logoPath)};
      });
    }

    if (result.resources && result.resources.length) {
      window.VELARIS_RESOURCES = result.resources.map(function (r) {
        return {
          type: plain(r.resourceType || 'guide'),
          price: plain(r.price),
          title: plain(r.title),
          cat: plain(r.category),
          desc: plain(r.description),
          cta: plain(r.ctaLabel || 'Download'),
          featured: !!r.featured,
          img: imageFrom(r.coverImage, r.coverImagePath)
        };
      });
    }

    if (result.posts && result.posts.length) {
      window.VELARIS_POSTS = result.posts.map(function (p) {
        var date = p.publishedAt ? new Date(p.publishedAt).toLocaleDateString('en-US', {month: 'short', day: '2-digit', year: 'numeric'}) : '';
        return {
          title: plain(p.title),
          cat: plain((p.category && p.category.title) || p.categoryName),
          kw: plain(p.targetKeyword),
          excerpt: plain(p.excerpt),
          slug: slugOf(p),
          date: date,
          read: p.readTimeMinutes || 8,
          body: bodyToHtml(p.body, p.legacyHtmlBody),
          coverImage: imageFrom(p.coverImage),
          coverGraphicKey: p.coverGraphicKey || ''
        };
      });
    }

    if (result.faqs && result.faqs.length) {
      window.VELARIS_FAQS = result.faqs.map(function (f) {
        return {q: plain(f.question), a: plain(f.answer)};
      });
    }

    if (result.pricing && result.pricing.length) {
      window.VELARIS_PRICING = result.pricing.map(function (p) {
        return {
          name: plain(p.name),
          price: plain(p.price),
          per: plain(p.period),
          tagline: plain(p.tagline),
          feats: p.features || [],
          cta: plain(p.cta && p.cta.label),
          feat: !!p.featured
        };
      });
    }

    window.VELARIS_CMS_LOADED = true;
  } catch (error) {
    window.VELARIS_CMS_ERROR = error;
  }
})();
