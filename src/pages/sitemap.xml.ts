import type { APIRoute } from 'astro';
import { getPublications, entryUrl } from '../lib/content';
export const GET: APIRoute = async ({ site }) => {
  const routes = [import.meta.env.BASE_URL, `${import.meta.env.BASE_URL}publicacoes/`, `${import.meta.env.BASE_URL}parceiros/`];
  const entries = await getPublications();
  routes.push(...entries.map(entry => entryUrl('publicacoes', entry.id)));
  const escape = (s: string) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${site ? routes.map(r => `<url><loc>${escape(new URL(r, site).href)}</loc></url>`).join('') : ''}</urlset>`, { headers: { 'Content-Type': 'application/xml' } });
};
