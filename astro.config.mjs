import { defineConfig } from 'astro/config';
import { readFileSync } from 'node:fs';

const settings = JSON.parse(readFileSync(new URL('./src/content/site.json', import.meta.url), 'utf8'));
const site = process.env.SITE_URL || settings.publicUrl || 'https://somosbrasilidade.com.br';
if (site && !/^https?:\/\//.test(site)) throw new Error('SITE_URL deve ser uma URL HTTP(S) absoluta.');
export default defineConfig({
  site, base: '/', output: 'static', trailingSlash: 'always',
  redirects: {
    '/sobre': { destination: '/', status: 302 },
    '/iniciativas': { destination: '/', status: 302 },
    '/publicacoes': { destination: '/', status: 302 },
    '/iniciativas/trama-legislativa': { destination: '/', status: 302 },
  },
});
