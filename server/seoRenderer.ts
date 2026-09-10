import { SEO_PILLARS } from '../src/data/seoPillarsData';
import { INITIAL_NEWSLETTERS } from '../src/data/initialData';
import { BLOG_POSTS } from '../src/data/blogPostsData';

const CANONICAL_DOMAIN = 'https://wordpastorai.com';
const SITE_NAME = 'Living Word Embassy Ministries';

/**
 * Generates an RSS 2.0 XML feed with full devotional content and audio enclosures.
 */
export function generateRssFeed(): string {
  const publishedNewsletters = INITIAL_NEWSLETTERS.filter(
    (nl) => nl.Status === 'PUBLISHED' || !nl.Status
  );

  const itemsXml = publishedNewsletters
    .map((nl) => {
      const link = `${CANONICAL_DOMAIN}/newsletter/${nl.Slug}`;
      const pubDate = nl.PublishDate
        ? new Date(nl.PublishDate).toUTCString()
        : new Date('2026-09-01T00:00:00Z').toUTCString();
      const description = escapeXml(
        `${nl.ScriptureReference} - ${nl.Excerpt || nl.Opening || ''}`
      );
      const content = escapeXml(
        `<h3>${nl.ScriptureReference}</h3>` +
          `<p><strong>Opening Reflection:</strong> ${nl.Opening}</p>` +
          `<div><h4>Exposition & Biblical Teaching</h4><p>${nl.Teaching.replace(/\n\n/g, '</p><p>')}</p></div>` +
          `<div><h4>Practical Application</h4><p>${nl.PracticalApplication}</p></div>` +
          `<div><h4>Prayer Declaration</h4><p>${nl.Prayer || ''}</p></div>`
      );

      const enclosure = nl.AudioURL
        ? `    <enclosure url="${nl.AudioURL.startsWith('http') ? nl.AudioURL : CANONICAL_DOMAIN + nl.AudioURL}" length="2048000" type="audio/mpeg" />\n`
        : '';

      return `  <item>
    <title>${escapeXml(nl.Title)}</title>
    <link>${link}</link>
    <guid isPermaLink="true">${link}</guid>
    <pubDate>${pubDate}</pubDate>
    <description>${description}</description>
    <content:encoded><![CDATA[${content}]]></content:encoded>
    <category>${escapeXml(nl.Theme || 'Christian Devotional')}</category>
    <author>embassyword@gmail.com (Living Word Embassy)</author>
${enclosure}  </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:content="http://purl.org/rss/1.0/modules/content/" 
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <channel>
    <title>Living Word Embassy — Daily Christian Devotionals & Scripture Exegesis</title>
    <link>${CANONICAL_DOMAIN}</link>
    <description>Daily biblically grounded Christian devotionals, verse-by-verse Greek and Hebrew exegesis, audio narrations, and prophetic prayer declarations.</description>
    <language>en-US</language>
    <copyright>Copyright ${new Date().getFullYear()} Living Word Embassy Ministries. All rights reserved.</copyright>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${CANONICAL_DOMAIN}/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1200&q=80</url>
      <title>Living Word Embassy</title>
      <link>${CANONICAL_DOMAIN}</link>
    </image>
    <category>Religion &amp; Spirituality</category>
    <itunes:category text="Religion &amp; Spirituality">
      <itunes:category text="Christianity" />
    </itunes:category>
    <itunes:author>Living Word Embassy Pastoral Team</itunes:author>
    <itunes:summary>Verse-by-verse devotional exegesis, audio scripture readings, and prayer declarations.</itunes:summary>
${itemsXml}
  </channel>
</rss>`;
}

/**
 * Server-side Meta Tag & Schema Prerenderer for bot crawlers and social scrapers.
 */
export function injectSeoMeta(originalHtml: string, requestPath: string): string {
  // Normalize path without query string or trailing slash
  const cleanPath = requestPath.split('?')[0].replace(/\/$/, '') || '/';
  
  let pageTitle = 'Living Word Embassy — Christian Daily Devotionals & Scripture Exegesis';
  let metaDesc =
    'Read biblically sound Christian devotionals, verse-by-verse Greek and Hebrew exegesis, audio narrations, and prayer declarations from Living Word Embassy Ministries.';
  let canonicalUrl = `${CANONICAL_DOMAIN}${cleanPath === '/' ? '/' : cleanPath}`;
  let ogImage =
    'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1200&q=80';
  let ogType = 'website';
  let extraJsonLd = '';

  // 1. Check if route is a Pillar page: /pillar/:slug
  if (cleanPath.startsWith('/pillar/')) {
    const slug = cleanPath.replace('/pillar/', '');
    const pillar = SEO_PILLARS.find(
      (p) => p.slug === slug || p.slug.includes(slug) || slug.includes(p.slug)
    );

    if (pillar) {
      pageTitle = `${pillar.metaTitle} | Living Word Embassy`;
      metaDesc = pillar.metaDescription;
      ogImage = pillar.featuredImage || ogImage;
      ogType = 'article';

      // Inject Pillar FAQ Schema
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
        extraJsonLd = `\n    <script type="application/ld+json">\n${JSON.stringify(faqSchema, null, 2)}\n    </script>`;
      }
    }
  }

  // 2. Check if route is a Newsletter page: /newsletter/:slug
  else if (cleanPath.startsWith('/newsletter/')) {
    const slug = cleanPath.replace('/newsletter/', '');
    const newsletter = INITIAL_NEWSLETTERS.find((nl) => nl.Slug === slug);

    if (newsletter) {
      pageTitle = newsletter.MetaTitle || `${newsletter.Title} — ${newsletter.ScriptureReference} | Living Word Embassy`;
      metaDesc =
        newsletter.MetaDescription ||
        `${newsletter.ScriptureReference} Exegesis: ${newsletter.Excerpt.substring(0, 150)}... Read devotional study and listen to audio narration.`;
      ogImage = newsletter.FeaturedImageURL || ogImage;
      ogType = 'article';

      const articleSchema: Record<string, any> = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: newsletter.Title,
        description: metaDesc,
        image: [ogImage],
        datePublished: newsletter.PublishDate || '2026-09-01T00:00:00Z',
        dateModified: newsletter.UpdatedAt || newsletter.PublishDate || '2026-09-04T00:00:00Z',
        author: {
          '@type': 'Organization',
          name: 'Living Word Embassy Pastoral Team',
          url: `${CANONICAL_DOMAIN}/about`,
        },
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
          url: CANONICAL_DOMAIN,
        },
        mainEntityOfPage: canonicalUrl,
      };

      if (newsletter.AudioURL) {
        articleSchema.audio = {
          '@type': 'AudioObject',
          contentUrl: newsletter.AudioURL.startsWith('http') ? newsletter.AudioURL : `${CANONICAL_DOMAIN}${newsletter.AudioURL}`,
          name: `Audio Devotional: ${newsletter.Title}`,
          description: `Full vocal narration for ${newsletter.ScriptureReference}`,
        };
      }

      extraJsonLd = `\n    <script type="application/ld+json">\n${JSON.stringify(articleSchema, null, 2)}\n    </script>`;
    }
  }

  // 3. Check if route is a Blog post: /blog/:slug
  else if (cleanPath.startsWith('/blog/')) {
    const slug = cleanPath.replace('/blog/', '');
    const post = BLOG_POSTS.find((p) => p.slug === slug);
    if (post) {
      pageTitle = `${post.metaTitle} | Living Word Embassy`;
      metaDesc = post.metaDescription;
      ogImage = post.featuredImageUrl || ogImage;
      ogType = 'article';

      const blogSchema: Record<string, any> = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.metaDescription,
        image: [post.featuredImageUrl],
        datePublished: post.publishDate || '2026-09-01T00:00:00Z',
        author: {
          '@type': 'Person',
          name: post.author.name,
        },
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
          url: CANONICAL_DOMAIN,
        },
        mainEntityOfPage: canonicalUrl,
      };

      let combinedJsonLd = `\n    <script type="application/ld+json">\n${JSON.stringify(blogSchema, null, 2)}\n    </script>`;

      if (post.faqItems && post.faqItems.length > 0) {
        const faqSchema = {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: post.faqItems.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        };
        combinedJsonLd += `\n    <script type="application/ld+json">\n${JSON.stringify(faqSchema, null, 2)}\n    </script>`;
      }
      extraJsonLd = combinedJsonLd;
    }
  }

  // 4. Specific Static Core Pages
  else if (cleanPath === '/blog') {
    pageTitle = 'Biblical Teaching Blog & Expository Articles | Living Word Embassy';
    metaDesc = 'Explore in-depth Bible study articles, scripture exegesis, healing promises, prayers for anxiety, and theological guides covering all covenant topics.';
  } else if (cleanPath === '/archive') {
    pageTitle = 'Devotionals Archive & Expository Studies | Living Word Embassy';
    metaDesc = 'Explore the complete archive of verse-by-verse Christian devotionals, Greek and Hebrew word studies, and audio prayers.';
  } else if (cleanPath === '/topics') {
    pageTitle = 'Theological Pillars & Scripture Topic Hub | Living Word Embassy';
    metaDesc = 'Browse in-depth biblical studies on Divine Protection, Supernatural Peace, Persistent Prayer, Faith, and Spiritual Growth.';
  } else if (cleanPath === '/videos') {
    pageTitle = 'Christian Video Exegesis & Devotionals | Living Word Embassy';
    metaDesc = 'Watch short-form video scriptures, cinematic devotional recaps, and biblical teachings from Living Word Embassy.';
  } else if (cleanPath === '/about') {
    pageTitle = 'About Living Word Embassy — Pastoral Mission & Faith Declaration';
    metaDesc = 'Discover the mission, editorial standards, and pastoral theology of Living Word Embassy Ministries.';
  } else if (cleanPath === '/subscribe') {
    pageTitle = 'Subscribe to Daily Devotionals & Exegesis | Living Word Embassy';
    metaDesc = 'Receive daily verse-by-verse scripture devotionals, audio narrations, and prayer declarations in your email inbox.';
  }

  // Replace Title
  let modifiedHtml = originalHtml.replace(
    /<title>.*?<\/title>/i,
    `<title>${escapeHtml(pageTitle)}</title>`
  );

  // Replace or add Meta Description
  modifiedHtml = modifiedHtml.replace(
    /<meta\s+name="description"\s+content=".*?"\s*\/?>/i,
    `<meta name="description" content="${escapeHtml(metaDesc)}" />`
  );

  // Replace Canonical Link
  modifiedHtml = modifiedHtml.replace(
    /<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i,
    `<link rel="canonical" href="${canonicalUrl}" />`
  );

  // Replace Open Graph Tags
  modifiedHtml = modifiedHtml
    .replace(/<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i, `<meta property="og:title" content="${escapeHtml(pageTitle)}" />`)
    .replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i, `<meta property="og:description" content="${escapeHtml(metaDesc)}" />`)
    .replace(/<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i, `<meta property="og:url" content="${canonicalUrl}" />`)
    .replace(/<meta\s+property="og:type"\s+content=".*?"\s*\/?>/i, `<meta property="og:type" content="${ogType}" />`)
    .replace(/<meta\s+property="og:image"\s+content=".*?"\s*\/?>/i, `<meta property="og:image" content="${ogImage}" />`);

  // Replace Twitter Card Tags
  modifiedHtml = modifiedHtml
    .replace(/<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/i, `<meta name="twitter:title" content="${escapeHtml(pageTitle)}" />`)
    .replace(/<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/i, `<meta name="twitter:description" content="${escapeHtml(metaDesc)}" />`)
    .replace(/<meta\s+name="twitter:image"\s+content=".*?"\s*\/?>/i, `<meta name="twitter:image" content="${ogImage}" />`);

  // Inject additional schema if available
  if (extraJsonLd) {
    modifiedHtml = modifiedHtml.replace('</head>', `${extraJsonLd}\n  </head>`);
  }

  return modifiedHtml;
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
