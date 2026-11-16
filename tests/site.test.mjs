// Tests del sitio compilado: se corren con `npm test` después de `npm run build`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const SITE = 'https://benjamincriado.dev';

const pages = {
  '/': 'index.html',
  '/vigilia/': 'vigilia/index.html',
  '/vigilia-edge/': 'vigilia-edge/index.html',
  '/forge/': 'forge/index.html',
  '/episteme/': 'episteme/index.html',
  '/cv/': 'cv/index.html',
};
const allPages = { ...pages, '/404': '404.html' };

const read = (rel) => readFileSync(join(DIST, rel), 'utf8');

function htmlFiles(dir = DIST) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return htmlFiles(full);
    return name.endsWith('.html') ? [full] : [];
  });
}

function meta(html, attr, value) {
  const re = new RegExp(`<meta[^>]*${attr}="${value}"[^>]*content="([^"]*)"`, 'i');
  return html.match(re)?.[1];
}

test('existen todas las páginas', () => {
  assert.ok(existsSync(DIST), 'falta dist/: corre `npm run build` antes de los tests');
  for (const file of Object.values(allPages)) {
    assert.ok(existsSync(join(DIST, file)), `falta ${file}`);
  }
});

test('cada página tiene title, description, canonical y Open Graph', () => {
  for (const [url, file] of Object.entries(allPages)) {
    const html = read(file);
    assert.match(html, /<html lang="es"/, `${url}: lang`);
    assert.match(html, /<title>[^<]+<\/title>/, `${url}: <title>`);
    const description = meta(html, 'name', 'description');
    assert.ok(description && description.length >= 50, `${url}: meta description de 50+ caracteres`);
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    if (url === '/404') assert.match(html, /noindex/, `${url}: noindex`);
    else assert.ok(canonical?.startsWith(`${SITE}/`), `${url}: canonical`);
    assert.ok(meta(html, 'property', 'og:title'), `${url}: og:title`);
    assert.ok(meta(html, 'property', 'og:image'), `${url}: og:image`);
  }
});

test('el sitemap lista las seis URL', () => {
  assert.ok(existsSync(join(DIST, 'sitemap-index.xml')), 'falta sitemap-index.xml');
  const index = read('sitemap-index.xml');
  const sitemaps = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE, ''));
  const locs = sitemaps.flatMap((path) =>
    [...read(path.replace(/^\//, '')).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]),
  );
  for (const url of Object.keys(pages)) {
    assert.ok(locs.includes(`${SITE}${url}`), `sitemap sin ${url}`);
  }
});

test('CNAME y robots.txt', () => {
  assert.equal(read('CNAME').trim(), 'benjamincriado.dev');
  assert.match(read('robots.txt'), /Sitemap: https:\/\/benjamincriado\.dev\/sitemap-index\.xml/);
});

test('privacidad: ningún HTML filtra datos que no deben publicarse', () => {
  const forbidden = [
    '9211',
    'Grupo Palm',
    'grupopalm',
    '/home/',
    'recién egresado',
    'vigilia-security.tech',
    'Material for MkDocs',
  ];
  const ipv4 = /\b\d{1,3}(\.\d{1,3}){3}\b/;
  for (const file of htmlFiles()) {
    const html = readFileSync(file, 'utf8');
    for (const word of forbidden) {
      assert.ok(!html.includes(word), `${file} contiene «${word}»`);
    }
    assert.doesNotMatch(html, ipv4, `${file} contiene una IPv4`);
  }
});

test('enlaces a vitrinas y enlaces internos válidos', () => {
  const showcases = {
    'vigilia/index.html': 'vigilia-reforged-showcase',
    'vigilia-edge/index.html': 'vigilia-edge-showcase',
    'forge/index.html': 'forge-showcase',
  };
  for (const [file, repo] of Object.entries(showcases)) {
    assert.ok(read(file).includes(`https://github.com/Bajmein/${repo}`), `${file} no enlaza ${repo}`);
  }

  for (const file of htmlFiles()) {
    const html = readFileSync(file, 'utf8');
    for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
      if (!href.startsWith('/') || href.startsWith('//')) continue;
      const path = href.split('#')[0].split('?')[0];
      const target = path.endsWith('/') ? join(DIST, path, 'index.html') : join(DIST, path);
      assert.ok(existsSync(target), `${file}: enlace roto ${href}`);
    }
  }
});

test('existe el PDF del CV', () => {
  assert.ok(existsSync(join(DIST, 'assets/pdf/cv_benjamin_criado.pdf')));
});
