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
  for (const path of ['index.html', 'publicacoes/index.html', 'sitemap.xml']) {
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
      assert.ok(!match[1].startsWith('/brasilidade-portal/'), `${path}: prefixo antigo: ${match[1]}`);
      const target = decodeURIComponent(match[1]);
      const file = target.endsWith('/') ? `${target}index.html` : target;
      await assert.doesNotReject(access(new URL(`../dist${file}`, import.meta.url)), `${path}: ${target}`);
    }
  }
});

test('beta apresenta seções reais, estados em preparação e canais oficiais', async () => {
  const config = JSON.parse(await read('src/content/site.json'));
  const html = await read('dist/index.html');
  assert.ok(html.includes(config.heroText));
  assert.ok(html.includes(config.heroTitle));
  assert.ok(html.includes(config.heroAccent));
  assert.ok(html.includes(`name="description" content="${config.heroText}"`));
  assert.ok(html.includes(`property="og:description" content="${config.heroText}"`));
  assert.ok(html.includes(`href="${config.instagramUrl}"`));
  assert.ok(html.includes(`href="${config.whatsappUrl}"`));
  assert.ok(html.includes(`href="mailto:${config.contactEmail}"`));
  assert.ok(html.includes(`href="${config.tramaUrl}"`));
  assert.ok(html.includes(config.instagramCta));
  assert.ok(html.includes(config.instagramLabel));
  assert.ok(html.includes(config.aboutTitle));
  assert.ok(html.includes(config.aboutText));
  for (const id of ['sobre', 'projetos-e-ideias', 'loja', 'participe']) assert.ok(html.includes(`id="${id}"`));
  assert.match(html, /href="\/#loja">Loja<\/a>/);
  assert.match(html, /Loja Brasilidade\./);
  assert.match(html, /A loja está em preparação/);
  assert.doesNotMatch(html, /em revisão|trabalhistas|desenvolvimentistas|<form/);
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
});
test('rotas institucionais antigas redirecionam sem conteúdo editorial', async () => {
  for (const route of ['sobre', 'iniciativas', 'iniciativas/trama-legislativa']) {
    const html = await read(`dist/${route}/index.html`);
    assert.match(html, /http-equiv="refresh"/i);
    assert.match(html, /content="2;url=\/"/i);
    assert.doesNotMatch(html, /<article|Apresentação provisória/);
  }
  const redirects = await read('dist/_redirects');
  for (const route of ['sobre','iniciativas']) {
    assert.ok(redirects.includes(`/${route}/* / 302`));
    assert.ok(redirects.includes(`/${route}/ / 302`));
  }
  assert.doesNotMatch(redirects, /\/publicacoes/);
  const sitemap = await read('dist/sitemap.xml');
  assert.doesNotMatch(sitemap, /sobre|iniciativas/);
  assert.ok(sitemap.includes('https://somosbrasilidade.com.br/'));
  assert.ok((await read('dist/robots.txt')).includes('https://somosbrasilidade.com.br/sitemap.xml'));
  const home = await read('dist/index.html');
  assert.ok(home.includes('rel="canonical" href="https://somosbrasilidade.com.br/"'));
  assert.doesNotMatch(home, /noindex/);
});

test('publicações só abrem quando há artigo aprovado', async () => {
  const files = await readdir(new URL('../src/content/publicacoes/', import.meta.url), { recursive: true });
  const published = [];
  for (const file of files.filter(name => name.endsWith('.md'))) {
    const source = await read(`src/content/publicacoes/${file.replaceAll('\\', '/')}`);
    const frontmatter = parse(source.split('---', 3)[1]);
    if (frontmatter.draft === false) published.push(file.replaceAll('\\', '/').slice(0, -3));
  }
  const home = await read('dist/index.html');
  const listing = await read('dist/publicacoes/index.html');
  const sitemap = await read('dist/sitemap.xml');
  if (published.length === 0) {
    assert.match(listing, /http-equiv="refresh"/i);
    assert.match(home, /Conteúdo em preparação/);
    assert.doesNotMatch(home, /href="\/publicacoes\/"/);
    assert.doesNotMatch(sitemap, /publicacoes/);
    return;
  }
  assert.doesNotMatch(listing, /http-equiv="refresh"/i);
  assert.match(listing, /<h1>Publicações\.<\/h1>/);
  assert.match(home, /href="\/publicacoes\/"/);
  assert.doesNotMatch(home, /Conteúdo em preparação/);
  assert.match(sitemap, /<loc>https:\/\/somosbrasilidade\.com\.br\/publicacoes\/<\/loc>/);
  for (const id of published) {
    const path = `publicacoes/${id.split('/').map(encodeURIComponent).join('/')}/`;
    const article = await read(`dist/${path}index.html`);
    assert.ok(listing.includes(`href="/${path}"`));
    assert.ok(sitemap.includes(`https://somosbrasilidade.com.br/${path}`));
    assert.match(article, /<meta property="og:type" content="article"/);
    assert.match(article, /<meta property="article:published_time"/);
    assert.match(article, /<meta name="author"/);
    assert.match(article, /<link rel="canonical"/);
    assert.match(article, /← Todas as publicações/);
  }
});


test('assets referenciados pelo CSS existem na raiz do domínio próprio', async () => {
  const files = await readdir(new URL('../dist/_astro/', import.meta.url));
  for (const file of files.filter(f => f.endsWith('.css'))) {
    const css = await read(`dist/_astro/${file}`);
    assert.doesNotMatch(css, /brasilidade-portal/);
    for (const match of css.matchAll(/url\(["']?(\/[^)"']+)["']?\)/g)) {
      await assert.doesNotReject(access(new URL(`../dist${match[1]}`, import.meta.url)));
    }
  }
});
