import type { APIRoute } from 'astro';
import { getPublications, entryUrl } from '../lib/content';
export const GET: APIRoute = async ({ site }) => {
  const routes = [import.meta.env.BASE_URL];
  const entries = await getPublications();
  if (entries.length > 0) routes.push(`${import.meta.env.BASE_URL}publicacoes/`, ...entries.map(entry => entryUrl('publicacoes', entry.id)));
  const escape = (s: string) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${site ? routes.map(r => `<url><loc>${escape(new URL(r, site).href)}</loc></url>`).join('') : ''}</urlset>`, { headers: { 'Content-Type': 'application/xml' } });
};
