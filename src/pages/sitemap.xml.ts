import type { APIRoute } from 'astro';
export const GET: APIRoute = async ({ site }) => {
  const routes = ['/'];
  const escape = (s: string) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${site ? routes.map(r => `<url><loc>${escape(new URL(r, site).href)}</loc></url>`).join('') : ''}</urlset>`, { headers: { 'Content-Type': 'application/xml' } });
};
