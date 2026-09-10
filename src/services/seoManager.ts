import { Newsletter, VideoItem } from '../types';

export const SITE_CANONICAL_DOMAIN = 'https://wordpastorai.com';
export const SITE_FALLBACK_DOMAIN = 'https://www.wordembassy.org';
export const SITE_NAME = 'Living Word Embassy Ministries';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Cleanly injects or updates a meta tag in document.head
 */
function setMetaTag(attrName: 'name' | 'property', attrValue: string, content: string) {
  if (typeof document === 'undefined') return;
  let element = document.head.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

/**
 * Sets or updates the canonical link in document.head
 */
export function setCanonicalUrl(url: string) {
  if (typeof document === 'undefined') return;
  let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

/**
 * Injects or updates a JSON-LD structured data script block
 */
export function setStructuredData(id: string, schemaObj: Record<string, any>) {
  if (typeof document === 'undefined') return;
  const scriptId = `schema-${id}`;
  let script = document.getElementById(scriptId) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(schemaObj, null, 2);
}

/**
 * Generates global Organization Schema
 */
export function setGlobalOrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_CANONICAL_DOMAIN}/#organization`,
    name: 'Living Word Embassy Ministries',
    alternateName: ['Word Embassy', 'Word Pastor AI', 'Living Word Embassy Digital Ministry'],
    url: SITE_CANONICAL_DOMAIN,
    logo: {
      '@type': 'ImageObject',
      url: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=800&q=80',
      caption: 'Living Word Embassy Emblem',
    },
    description:
      'Living Word Embassy is an expository Christian digital ministry dedicated to publishing biblically grounded devotionals, theological exegesis, prayer guides, and multimedia scripture studies.',
    email: 'embassyword@gmail.com',
    sameAs: [
      'https://www.youtube.com/channel/UCAsSQvaTy6ZUPpLeLjbOA6g',
      'https://www.youtube.com/channel/UCymieOPsE0wPoPjS-vC57LA',
      'https://www.tiktok.com/@paulinefaith67',
      'https://www.instagram.com/embassyword02/',
      'https://x.com/Wordembass76269',
      'https://www.facebook.com/profile.php?id=61570922167817',
      'https://www.facebook.com/groups/1421329093238399',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'embassyword@gmail.com',
      contactType: 'pastoral support and reader inquiries',
    },
  };
  setStructuredData('global-org', schema);
}

/**
 * Generates WebSite Schema with Potential SearchAction
 */
export function setWebSiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_CANONICAL_DOMAIN}/#website`,
    url: SITE_CANONICAL_DOMAIN,
    name: 'Living Word Embassy — Daily Devotionals & Scripture Exegesis',
    description:
      'Biblically sound Christian digital publication providing daily devotionals, verse-by-verse scripture exegesis, audio narrations, and prayer declarations.',
    publisher: {
      '@id': `${SITE_CANONICAL_DOMAIN}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_CANONICAL_DOMAIN}/archive?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
  setStructuredData('global-website', schema);
}

/**
 * Generates BreadcrumbList Schema
 */
export function setBreadcrumbSchema(items: BreadcrumbItem[]) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_CANONICAL_DOMAIN}${item.url}`,
    })),
  };
  setStructuredData('breadcrumbs', schema);
}

/**
 * Sets comprehensive SEO for a Devotional Newsletter
 */
export function setNewsletterSEO(newsletter: Newsletter, canonicalBase: string = SITE_CANONICAL_DOMAIN) {
  const pageUrl = newsletter.CanonicalURL?.trim() || `${canonicalBase}/newsletter/${newsletter.Slug}`;
  const title = newsletter.MetaTitle || `${newsletter.Title} | Scripture Exegesis & Prayer | Living Word Embassy`;
  const description =
    newsletter.MetaDescription ||
    `${newsletter.ScriptureReference} devotional study: ${newsletter.Excerpt.substring(0, 150)}... Read full teaching, audio narration, and prayer points.`;
  const imageUrl =
    newsletter.FeaturedImageURL ||
    'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1200&q=80';

  if (typeof document !== 'undefined') {
    document.title = title;
  }

  setMetaTag('name', 'description', description);
  setMetaTag('name', 'keywords', (newsletter.Keywords || ['Christian devotional', 'Bible study', 'Scripture exegesis', newsletter.Theme]).join(', '));
  setCanonicalUrl(pageUrl);

  // Open Graph
  setMetaTag('property', 'og:title', title);
  setMetaTag('property', 'og:description', description);
  setMetaTag('property', 'og:url', pageUrl);
  setMetaTag('property', 'og:type', 'article');
  setMetaTag('property', 'og:image', imageUrl);
  setMetaTag('property', 'og:site_name', SITE_NAME);

  // Twitter
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', title);
  setMetaTag('name', 'twitter:description', description);
  setMetaTag('name', 'twitter:image', imageUrl);

  // Article Schema
  const articleSchema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${pageUrl}#article`,
    headline: newsletter.Title,
    description: description,
    image: [imageUrl],
    datePublished: newsletter.PublishDate || newsletter.CreatedAt || '2026-08-28T00:00:00Z',
    dateModified: newsletter.UpdatedAt || newsletter.PublishDate || '2026-09-04T00:00:00Z',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
    author: {
      '@type': 'Organization',
      name: 'Living Word Embassy Pastoral & Editorial Team',
      url: `${canonicalBase}/about`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Living Word Embassy Ministries',
      url: canonicalBase,
      logo: {
        '@type': 'ImageObject',
        url: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=800&q=80',
      },
    },
    articleSection: newsletter.Theme || 'Theological Exegesis',
    about: {
      '@type': 'Thing',
      name: newsletter.ScriptureReference,
    },
    wordCount: (newsletter.Teaching + newsletter.Opening + newsletter.PracticalApplication).split(/\s+/).length,
  };

  if (newsletter.AudioURL) {
    articleSchema.audio = {
      '@type': 'AudioObject',
      contentUrl: newsletter.AudioURL,
      description: `Audio narration for ${newsletter.Title}`,
      duration: newsletter.AudioNarrationDuration || 'PT2M',
    };
  }

  setStructuredData('page-article', articleSchema);

  // Breadcrumbs schema
  setBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Devotionals Archive', url: '/archive' },
    { name: newsletter.Title, url: `/newsletter/${newsletter.Slug}` },
  ]);

  // Video schema if present
  if (newsletter.YouTubeURL || newsletter.VideoURL) {
    const videoSchema = {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: newsletter.YouTubeTitle || `${newsletter.Title} (Video Devotional)`,
      description: newsletter.YouTubeDescription || description,
      thumbnailUrl: [imageUrl],
      uploadDate: newsletter.PublishDate || '2026-09-01T00:00:00Z',
      contentUrl: newsletter.VideoURL || newsletter.YouTubeURL,
      embedUrl: newsletter.YouTubeURL?.includes('youtube.com') ? newsletter.YouTubeURL.replace('watch?v=', 'embed/') : newsletter.YouTubeURL,
    };
    setStructuredData('page-video', videoSchema);
  }
}

/**
 * Sets comprehensive SEO for a Pillar Hub Page
 */
export function setPillarSEO(
  pillar: {
    id: string;
    slug: string;
    title: string;
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    featuredImage: string;
    faqs: FAQItem[];
  },
  canonicalBase: string = SITE_CANONICAL_DOMAIN
) {
  const pageUrl = `${canonicalBase}/pillar/${pillar.slug}`;
  if (typeof document !== 'undefined') {
    document.title = pillar.metaTitle;
  }

  setMetaTag('name', 'description', pillar.metaDescription);
  setMetaTag('name', 'keywords', pillar.keywords.join(', '));
  setCanonicalUrl(pageUrl);

  // Open Graph
  setMetaTag('property', 'og:title', pillar.metaTitle);
  setMetaTag('property', 'og:description', pillar.metaDescription);
  setMetaTag('property', 'og:url', pageUrl);
  setMetaTag('property', 'og:type', 'website');
  setMetaTag('property', 'og:image', pillar.featuredImage);
  setMetaTag('property', 'og:site_name', SITE_NAME);

  // Twitter
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', pillar.metaTitle);
  setMetaTag('name', 'twitter:description', pillar.metaDescription);
  setMetaTag('name', 'twitter:image', pillar.featuredImage);

  // Breadcrumbs schema
  setBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Scripture Pillars & Theological Guides', url: '/topics' },
    { name: pillar.title, url: `/pillar/${pillar.slug}` },
  ]);

  // FAQPage Schema
  if (pillar.faqs && pillar.faqs.length > 0) {
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: pillar.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    };
    setStructuredData('page-faq', faqSchema);
  }
}

/**
 * Sets standard page SEO (Home, Archive, Videos, About, Subscribe, etc.)
 */
export function setStandardPageSEO(
  title: string,
  description: string,
  path: string,
  canonicalBase: string = SITE_CANONICAL_DOMAIN
) {
  const fullUrl = `${canonicalBase}${path}`;
  if (typeof document !== 'undefined') {
    document.title = title;
  }

  setMetaTag('name', 'description', description);
  setCanonicalUrl(fullUrl);

  setMetaTag('property', 'og:title', title);
  setMetaTag('property', 'og:description', description);
  setMetaTag('property', 'og:url', fullUrl);
  setMetaTag('property', 'og:type', 'website');
  setMetaTag('property', 'og:image', 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1200&q=80');

  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', title);
  setMetaTag('name', 'twitter:description', description);

  // Breadcrumbs
  if (path !== '/') {
    const cleanName = path.replace('/', '').replace(/-/g, ' ');
    const formatted = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    setBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: formatted, url: path },
    ]);
  }
}

/**
 * GA4 & Conversion Event Dispatcher
 */
export function trackSEOEvent(
  eventName:
    | 'page_view'
    | 'newsletter_signup'
    | 'audio_play'
    | 'video_watch'
    | 'scripture_read'
    | 'scripture_copy'
    | 'pdf_download'
    | 'pillar_view'
    | 'topic_filter'
    | 'channel_click',
  params: Record<string, any> = {}
) {
  if (typeof window === 'undefined') return;

  // Log in console for development inspection
  console.log(`[SEO-Analytics] Event: ${eventName}`, params);

  // Google Analytics 4 integration if gtag is loaded on window
  const w = window as any;
  if (typeof w.gtag === 'function') {
    w.gtag('event', eventName, params);
  }

  // Also dispatch CustomEvent for decoupled listeners in app
  window.dispatchEvent(
    new CustomEvent('we_seo_event', {
      detail: { eventName, params, timestamp: new Date().toISOString() },
    })
  );
}
