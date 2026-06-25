import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';

/**
 * Universal SEO component for Quads Fitness
 * Supports: Standard Meta, OG, Twitter, Canonical, JSON-LD schemas:
 *   LocalBusiness, FAQ, Article, Service, AggregateRating, BreadcrumbList, WebSite
 */
export default function SEO({
  title,
  description,
  keywords,
  type = 'website',
  image,
  url,
  // Schema overrides
  article,       // { author, datePublished, dateModified }
  faqItems,      // [{ question, answer }]
  service,       // { name, description, areaServed }
  aggregateRating, // { ratingValue, reviewCount }
  breadcrumbs,   // [{ name, url }]
  noLocalBusiness, // suppress LocalBusiness schema
}) {
  const { settings } = useSettings();
  const location = useLocation();

  const gymName    = settings?.gymName  || 'Quads Fitness';
  const gymPhone   = settings?.phone;
  const gymAddress = settings?.address;
  const gymEmail   = settings?.email;

  const siteUrl    = 'https://quadsfitness.com';
  const pageUrl    = `${siteUrl}${url || location.pathname}`;
  const ogImage    = image || `${siteUrl}/og-image.jpg`;

  // ── Schema builders ────────────────────────────────────────────────

  const localBusinessSchema = noLocalBusiness ? null : {
    '@context': 'https://schema.org',
    '@type': 'HealthClub',
    name: gymName,
    image: ogImage,
    url: siteUrl,
    ...(gymPhone && { telephone: gymPhone }),
    ...(gymEmail && { email: gymEmail }),
    ...(gymAddress && { address: {
      '@type': 'PostalAddress',
      streetAddress: gymAddress,
      addressLocality: 'Manimajra',
      addressRegion: 'Manimajra',
      addressCountry: 'IN',
    } }),
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], opens: '05:00', closes: '10:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], opens: '11:00', closes: '21:00' },
    ],
    priceRange: '₹₹',
    ...(aggregateRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: aggregateRating.ratingValue,
        reviewCount: aggregateRating.reviewCount,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: gymName,
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/blog?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const breadcrumbSchema = breadcrumbs && breadcrumbs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      ...breadcrumbs.map((bc, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: bc.name,
        item: `${siteUrl}${bc.url}`,
      })),
    ],
  } : null;

  const articleSchema = article ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: ogImage,
    author: { '@type': 'Organization', name: article.author || 'Quads Fitness Team' },
    publisher: { '@type': 'Organization', name: gymName, logo: { '@type': 'ImageObject', url: ogImage } },
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
  } : null;

  const faqSchema = faqItems && faqItems.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  } : null;

  const serviceSchema = service ? {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: { '@type': 'HealthClub', name: gymName, url: siteUrl },
    areaServed: service.areaServed || 'Manimajra, India',
    url: pageUrl,
  } : null;

  const schemas = [
    localBusinessSchema,
    websiteSchema,
    breadcrumbSchema,
    articleSchema,
    faqSchema,
    serviceSchema,
  ].filter(Boolean);

  return (
    <Helmet>
      {/* Basic */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={pageUrl} />

      {/* Open Graph */}
      <meta property="og:type"        content={type} />
      <meta property="og:url"         content={pageUrl} />
      <meta property="og:title"       content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image"       content={ogImage} />
      <meta property="og:site_name"   content={gymName} />
      <meta property="og:locale"      content="en_IN" />

      {/* Twitter */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:url"         content={pageUrl} />
      <meta name="twitter:title"       content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image"       content={ogImage} />

      {/* JSON-LD — one script per schema */}
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
