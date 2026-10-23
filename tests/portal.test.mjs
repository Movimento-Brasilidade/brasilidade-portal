import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access, readdir } from 'node:fs/promises';
import { parse } from 'yaml';
const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('rotas principais geradas com idioma, título e navegação acessível', async () => {
  for (const path of ['index.html', '404.html']) {
    const html = await read(`dist/${path}`);
    assert.match(html, /lang="pt-BR"/);
    assert.match(html, /<h1[\s>]/);
    assert.match(html, /id="conteudo"/);
    assert.match(html, /name="description"/);
  }
});
test('rascunho de exemplo não gera página nem aparece no site', async () => {
  await assert.rejects(access(new URL('../dist/publicacoes/exemplo-editorial/index.html', import.meta.url)));
  for (const path of ['index.html', 'sitemap.xml']) {
    assert.doesNotMatch(await read(`dist/${path}`), /exemplo-editorial|Exemplo de publicação/);
  }
});
test('CMS aponta para conteúdo existente e para uploads públicos', async () => {
  const cms = parse(await read('.pages.yml'));
  assert.equal(cms.media.input, 'public/uploads');
  assert.equal(cms.media.output, '/uploads');
  for (const entry of cms.content) {
    await access(new URL(`../${entry.path}`, import.meta.url));
    if (entry.type === 'collection') assert.ok(entry.fields.some(f => f.name === 'draft' && f.default === true));
  }
  const config = JSON.parse(await read('src/content/site.json'));
  const fields = cms.content.find(c => c.name === 'site').fields.map(f => f.name);
  assert.deepEqual(Object.keys(config).sort(), fields.sort());
});
test('links internos de todas as páginas resolvem na saída estática', async () => {
  const files = await readdir(new URL('../dist/', import.meta.url), { recursive: true });
  for (const path of files.filter(f => f.endsWith('.html'))) {
    const html = await read(`dist/${path.replaceAll('\\', '/')}`);
    for (const match of html.matchAll(/(?:href|src)="(\/[^"#?]*)(?:[?#][^"]*)?"/g)) {
      assert.ok(match[1].startsWith('/brasilidade-portal/'), `${path}: caminho fora da base: ${match[1]}`);
      const target = decodeURIComponent(match[1]).slice('/brasilidade-portal'.length);
      const file = target.endsWith('/') ? `${target}index.html` : target;
      await assert.doesNotReject(access(new URL(`../dist${file}`, import.meta.url)), `${path}: ${target}`);
    }
  }
});

test('landing usa apresentação aprovada e apenas o Instagram como destino externo', async () => {
  const config = JSON.parse(await read('src/content/site.json'));
  const html = await read('dist/index.html');
  assert.ok(html.includes(config.heroText));
  assert.ok(html.includes(config.heroTitle));
  assert.ok(html.includes(config.heroAccent));
  assert.ok(html.includes(`name="description" content="${config.heroText}"`));
  assert.ok(html.includes(`property="og:description" content="${config.heroText}"`));
  assert.ok(html.includes(`href="${config.instagramUrl}"`));
  assert.ok(html.includes(config.instagramCta));
  assert.ok(html.includes(config.instagramLabel));
  assert.doesNotMatch(html, /<nav|Trama Legislativa|em revisão|trabalhistas|desenvolvimentistas|<form/);
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
});
test('rotas antigas redirecionam sem conteúdo editorial e não entram no sitemap', async () => {
  for (const route of ['sobre', 'iniciativas', 'publicacoes', 'iniciativas/trama-legislativa']) {
    const html = await read(`dist/${route}/index.html`);
    assert.match(html, /http-equiv="refresh"/i);
    assert.match(html, /url=\/brasilidade-portal\//i);
    assert.doesNotMatch(html, /<article|Apresentação provisória/);
  }
  const redirects = await read('dist/_redirects');
  for (const route of ['sobre','iniciativas','publicacoes']) {
    assert.ok(redirects.includes(`/${route}/* / 302`));
    assert.ok(redirects.includes(`/${route}/ / 302`));
  }
  const sitemap = await read('dist/sitemap.xml');
  assert.doesNotMatch(sitemap, /sobre|iniciativas|publicacoes/);
  assert.equal((sitemap.match(/<loc>/g) || []).length, 1);
  assert.ok(sitemap.includes('https://movimento-brasilidade.github.io/brasilidade-portal/'));
  assert.ok((await read('dist/robots.txt')).includes('https://movimento-brasilidade.github.io/brasilidade-portal/sitemap.xml'));
  const home = await read('dist/index.html');
  assert.ok(home.includes('rel="canonical" href="https://movimento-brasilidade.github.io/brasilidade-portal/"'));
  assert.doesNotMatch(home, /noindex/);
});
