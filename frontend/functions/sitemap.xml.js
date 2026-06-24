export async function onRequest(context) {
  // API_BASE_URL is set as a Cloudflare Pages environment variable.
  // Falls back to the same-origin /api proxy (via _redirects) for local dev.
  const { request, env } = context;
  const origin = new URL(request.url).origin;
  const API_BASE = env.VITE_API_BASE_URL ? `${env.VITE_API_BASE_URL}/api` : `${origin}/api`;
  const SITE_URL = origin;

  try {
    const res = await fetch(`${API_BASE}/categories/`);
    if (!res.ok) throw new Error("Failed to fetch categories");
    const categories = await res.json();

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
`;

    if (Array.isArray(categories)) {
      for (const cat of categories) {
        if (cat.slug === 'day-fact') continue;

        // Use updated_at or published_at if available on the category model
        const lastmod = cat.updated_at || cat.published_at
          ? `\n    <lastmod>${(cat.updated_at || cat.published_at).split('T')[0]}</lastmod>`
          : '';

        xml += `  <url>
    <loc>${SITE_URL}/category/${cat.slug}</loc>${lastmod}
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>\n`;
      }
    }

    xml += `</urlset>`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=1800"
      }
    });
  } catch (error) {
    return new Response("Error generating sitemap", { status: 500 });
  }
}
