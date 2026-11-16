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

function distFiles(ext, dir = DIST) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return distFiles(ext, full);
    return name.endsWith(ext) ? [full] : [];
  });
}
const htmlFiles = () => distFiles('.html');

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

const count = (html, re) => (html.match(re) ?? []).length;

test('cada página tiene title, description, canonical y Open Graph', () => {
  for (const [url, file] of Object.entries(allPages)) {
    const html = read(file);
    assert.match(html, /<html lang="es"/, `${url}: lang`);
    assert.match(html, /<title>[^<]+<\/title>/, `${url}: <title>`);
    const description = meta(html, 'name', 'description');
    assert.ok(
      description && description.length >= 50 && description.length <= 160,
      `${url}: meta description de 50 a 160 caracteres (tiene ${description?.length})`,
    );
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    if (url in pages) {
      assert.equal(canonical, `${SITE}${url}`, `${url}: canonical`);
      assert.doesNotMatch(html, /noindex/, `${url}: no debe llevar noindex`);
    } else {
      assert.match(html, /<meta name="robots" content="noindex, follow"/, `${url}: noindex`);
      assert.equal(canonical, undefined, `${url}: sin canonical`);
      assert.equal(meta(html, 'property', 'og:url'), undefined, `${url}: sin og:url`);
    }
    assert.ok(meta(html, 'property', 'og:title'), `${url}: og:title`);
    assert.equal(count(html, /<h1[\s>]/g), 1, `${url}: un solo <h1>`);
    assert.equal(count(html, /property="og:image"/g), 1, `${url}: un og:image`);
    assert.equal(count(html, /name="twitter:image"/g), 1, `${url}: un twitter:image`);
    const preloads = html.match(/<link rel="preload"[^>]*as="font"[^>]*>/g) ?? [];
    assert.equal(preloads.length, 1, `${url}: una precarga de fuente`);
    const href = preloads[0].match(/href="([^"]+)"/)?.[1];
    assert.ok(href && existsSync(join(DIST, href)), `${url}: la fuente precargada ${href} existe`);
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
  assert.equal(locs.length, Object.keys(pages).length, 'el sitemap tiene URL de más');
});

test('imagen social de 1200×630 y menos de 300 KB', () => {
  const file = join(DIST, 'og.png');
  assert.ok(existsSync(file), 'falta og.png');
  const png = readFileSync(file);
  assert.ok(png.length < 300 * 1024, `og.png pesa ${png.length} bytes`);
  const [width, height] = [png.readUInt32BE(16), png.readUInt32BE(20)];
  assert.deepEqual([width, height], [1200, 630]);
  const html = read('index.html');
  assert.equal(meta(html, 'property', 'og:image:width'), String(width));
  assert.equal(meta(html, 'property', 'og:image:height'), String(height));
});

test('JSON-LD con Person, WebSite y SoftwareSourceCode en los proyectos', () => {
  const projectPages = ['/vigilia/', '/vigilia-edge/', '/episteme/', '/forge/'];
  for (const [url, file] of Object.entries(allPages)) {
    const raw = read(file).match(/<script type="application\/ld\+json">([^<]+)<\/script>/)?.[1];
    assert.ok(raw, `${url}: falta JSON-LD`);
    const types = JSON.parse(raw)['@graph'].map((node) => node['@type']);
    assert.ok(types.includes('Person'), `${url}: JSON-LD sin Person`);
    assert.ok(types.includes('WebSite'), `${url}: JSON-LD sin WebSite`);
    if (projectPages.includes(url)) {
      assert.ok(types.includes('SoftwareSourceCode'), `${url}: JSON-LD sin SoftwareSourceCode`);
    }
  }
});

test('llms.txt enlaza las páginas del sitio con sus descripciones', () => {
  assert.ok(existsSync(join(DIST, 'llms.txt')), 'falta llms.txt');
  const txt = read('llms.txt');
  assert.ok(!txt.includes('\\'), 'llms.txt contiene una barra invertida');
  const lines = txt.split('\n');
  assert.ok(lines[0].startsWith('# '), 'la primera línea debe ser el título');
  assert.ok(lines.some((line) => line.startsWith('> ')), 'falta el resumen «> »');
  const main = txt.split('## Optional')[0];
  const urls = [...main.matchAll(new RegExp(`${SITE}(/(?:[^)\\s]*/)?)\\)`, 'g'))].map((m) => m[1]);
  assert.deepEqual([...urls].sort(), Object.keys(pages).sort(), 'llms.txt debe listar las seis páginas');
  for (const [, url, text] of main.matchAll(/^- \[[^\]]+\]\(([^)]+)\): (.+)$/gm)) {
    const description = meta(read(pages[url.replace(SITE, '')]), 'name', 'description');
    assert.ok(
      description.toLowerCase().endsWith(text.toLowerCase()),
      `llms.txt: el texto de ${url} no coincide con su metadescripción`,
    );
  }
});

test('tipografía: ningún texto bajo 12 px', () => {
  const css = [
    ...distFiles('.css').map((file) => readFileSync(file, 'utf8')),
    ...htmlFiles().flatMap((file) =>
      [...readFileSync(file, 'utf8').matchAll(/<style[^>]*>([^<]*)<\/style>/g)].map((m) => m[1]),
    ),
  ].join('\n');
  let checked = 0;
  for (const [, selector, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    // Texto de los diagramas SVG, en unidades del viewBox: pendiente de redibujo
    if (selector.includes('.d-')) continue;
    for (const declaration of body.split(';')) {
      if (!/^\s*font(-size)?\s*:/.test(declaration)) continue;
      // Solo rem y px; pt (impresión del CV), em y vw no se evalúan
      for (const [, value, unit] of declaration.matchAll(/(\d*\.?\d+)(rem|px)/g)) {
        const px = unit === 'rem' ? Number(value) * 16 : Number(value);
        assert.ok(px >= 12, `${selector.trim()}: ${declaration.trim()} queda bajo 12 px`);
        checked++;
      }
    }
  }
  assert.ok(checked > 0, 'no se evaluó ningún tamaño de letra');
});

test('CNAME y robots.txt', () => {
  assert.equal(read('CNAME').trim(), 'benjamincriado.dev');
  assert.match(read('robots.txt'), /Sitemap: https:\/\/benjamincriado\.dev\/sitemap-index\.xml/);
});

test('privacidad: ningún HTML ni texto filtra datos que no deben publicarse', () => {
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
  for (const file of [...htmlFiles(), ...distFiles('.txt')]) {
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
