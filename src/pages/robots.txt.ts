import type { APIRoute } from 'astro';
export const GET: APIRoute = ({ site }) => new Response(site ? `User-agent: *\nAllow: /\nSitemap: ${new URL(`${import.meta.env.BASE_URL}sitemap.xml`, site)}\n` : 'User-agent: *\nDisallow: /\n');
