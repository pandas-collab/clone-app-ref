import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get all published content
    const [pages, news, resources, services, portfolio] = await Promise.all([
      prisma.content.findMany({
        where: { type: 'page', status: 'published' },
        select: { slug: true, updatedAt: true }
      }),
      prisma.content.findMany({
        where: { type: 'news', status: 'published' },
        select: { slug: true, updatedAt: true, publishedAt: true }
      }),
      prisma.content.findMany({
        where: { type: 'resource', status: 'published' },
        select: { slug: true, updatedAt: true }
      }),
      prisma.service.findMany({
        where: { active: true },
        select: { slug: true, updatedAt: true }
      }),
      prisma.portfolioItem.findMany({
        where: { active: true },
        select: { slug: true, updatedAt: true }
      })
    ]);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com';

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/services</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/portfolio</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/careers</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`;

    // Add dynamic pages
    pages.forEach(page => {
      sitemap += `  <url>
    <loc>${baseUrl}/pages/${page.slug}</loc>
    <lastmod>${page.updatedAt.toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
    });

    // Add news articles
    news.forEach(article => {
      sitemap += `  <url>
    <loc>${baseUrl}/news/${article.slug}</loc>
    <lastmod>${(article.publishedAt || article.updatedAt).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`;
    });

    // Add resources
    resources.forEach(resource => {
      sitemap += `  <url>
    <loc>${baseUrl}/resources/${resource.slug}</loc>
    <lastmod>${resource.updatedAt.toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
`;
    });

    // Add services
    services.forEach(service => {
      sitemap += `  <url>
    <loc>${baseUrl}/services/${service.slug}</loc>
    <lastmod>${service.updatedAt.toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    });

    // Add portfolio items
    portfolio.forEach(item => {
      sitemap += `  <url>
    <loc>${baseUrl}/portfolio/${item.slug}</loc>
    <lastmod>${item.updatedAt.toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
    });

    sitemap += '</urlset>';

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=86400' // Cache for 24 hours
      }
    });
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate sitemap' },
      { status: 500 }
    );
  }
}
