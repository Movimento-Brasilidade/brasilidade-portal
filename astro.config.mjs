import { defineConfig } from 'astro/config';
import { readFileSync } from 'node:fs';

const settings = JSON.parse(readFileSync(new URL('./src/content/site.json', import.meta.url), 'utf8'));
const site = process.env.SITE_URL || settings.publicUrl || 'https://movimento-brasilidade.github.io';
if (site && !/^https?:\/\//.test(site)) throw new Error('SITE_URL deve ser uma URL HTTP(S) absoluta.');
export default defineConfig({
  site, base: '/brasilidade-portal', output: 'static', trailingSlash: 'always',
  redirects: {
    '/sobre': { destination: '/brasilidade-portal/', status: 302 },
    '/iniciativas': { destination: '/brasilidade-portal/', status: 302 },
    '/publicacoes': { destination: '/brasilidade-portal/', status: 302 },
    '/iniciativas/trama-legislativa': { destination: '/brasilidade-portal/', status: 302 },
  },
});
