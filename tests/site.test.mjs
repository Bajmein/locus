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
  '/pulse/': 'pulse/index.html',
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

// Todo el CSS del build: hojas de dist/_astro y los <style> incrustados en cada página
const builtCss = () =>
  [
    ...distFiles('.css').map((file) => readFileSync(file, 'utf8')),
    ...htmlFiles().flatMap((file) =>
      [...readFileSync(file, 'utf8').matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]),
    ),
  ].join('\n');

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
  const projectPages = ['/vigilia/', '/vigilia-edge/', '/episteme/', '/pulse/'];
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
  let checked = 0;
  for (const [, selector, body] of builtCss().matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
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

test('diagramas: dos composiciones que nunca se dibujan por debajo de 1:1', () => {
  const limits = { wide: 640, narrow: 280 };
  for (const file of ['vigilia/index.html', 'pulse/index.html', 'episteme/index.html']) {
    const html = read(file);
    const layouts = [...html.matchAll(/<svg class="layout is-(wide|narrow)"[^>]*>/g)];
    assert.deepEqual(layouts.map((m) => m[1]), ['wide', 'narrow'], `${file}: composiciones ancha y angosta`);
    for (const [tag, key] of layouts) {
      const width = Number(tag.match(/viewBox="0 0 (\d+) \d+"/)?.[1]);
      assert.ok(width > 0 && width <= limits[key], `${file}: la composición ${key} mide ${width}`);
      // El texto de 12 unidades mide 12 px solo si el SVG no baja de su ancho: min-width: var(--w)
      assert.match(tag, new RegExp(`style="--w: ?${width}px"`), `${file}: --w de la composición ${key}`);
    }
    assert.match(html, /<circle class="d-token"[^>]*offset-path/, `${file}: falta el punto animado`);
  }
  assert.match(builtCss(), /\.layout[^{]*\{[^}]*min-width:\s*var\(--w\)/, 'la composición debe fijar min-width: var(--w)');
  assert.match(builtCss(), /@container \(width\s*<\s*640px\)/, 'el cambio de composición debe ocurrir a 640 px');
});

test('títulos en español: sin mayúsculas al estilo inglés', () => {
  const english = ['El Problema', 'La Solución', 'El Ciclo de Vida', 'Estado del Proyecto', 'Stack Técnico'];
  for (const file of htmlFiles()) {
    const html = readFileSync(file, 'utf8');
    for (const title of english) {
      assert.ok(!html.includes(title), `${file} contiene «${title}»`);
    }
  }
});

test('portada: agentes primero, con ícono y tono', () => {
  const html = read('index.html');
  const cards = [...html.matchAll(/<a[^>]*class="project-card[^"]*"[^>]*>[\s\S]*?<\/a>/g)].map((m) => m[0]);
  const hrefs = cards.map((card) => card.match(/^<a[^>]*>/)[0].match(/href="([^"]+)"/)?.[1]);
  assert.deepEqual(hrefs, ['/episteme/', '/pulse/', '/vigilia/', '/vigilia-edge/'], 'orden de las tarjetas');
  for (const [i, card] of cards.entries()) {
    const slug = hrefs[i].replaceAll('/', '');
    assert.ok(card.includes('class="project-icon'), `${hrefs[i]}: falta el ícono`);
    assert.match(card, new RegExp(`--accent:\\s?var\\(--tone-${slug}\\)`), `${hrefs[i]}: falta su tono`);
    assert.ok(card.includes('class="mono proof"'), `${hrefs[i]}: falta su prueba`);
  }
});

test('trabajo con agentes: línea de tiempo en orden', () => {
  const html = read('index.html');
  const start = html.indexOf('id="agentes"');
  assert.ok(start >= 0, 'falta id="agentes"');
  const section = html.slice(start, html.indexOf('</section>', start));
  assert.equal(count(section, /class="step[\s"]/g), 4, 'la línea de tiempo tiene cuatro pasos');
  const trail = section.slice(section.indexOf('class="trail'), section.indexOf('</ol>'));
  const names = [...trail.matchAll(/<h3[^>]*>(?:<a[^>]*>)?([^<]+)/g)].map((m) => m[1].trim());
  assert.deepEqual(names, ['Forge', 'pulse', 'fabrik', 'episteme'], 'orden de los pasos');
  assert.ok(section.includes('href="/pulse/"'), 'falta el enlace a /pulse/');
  assert.ok(!section.includes('href="/forge/"'), 'Forge ya no tiene página');
  assert.ok(section.includes('href="/episteme/"'), 'falta el enlace a /episteme/');
});

test('portada: método en #agentes y sin sección Enfoque', () => {
  const html = read('index.html');
  const start = html.indexOf('id="agentes"');
  assert.ok(start >= 0, 'falta id="agentes"');
  const section = html.slice(start, html.indexOf('</section>', start));
  const method = section.slice(section.indexOf('class="method'), section.indexOf('</ul>', section.indexOf('class="method')));
  assert.equal(count(method, /<li/g), 6, 'el método tiene seis ítems');
  assert.ok(!html.includes('Cómo decido'), 'sobra «Cómo decido»');
  assert.ok(!html.includes('id="enfoque"'), 'sobra la sección #enfoque');
});

test('tono por proyecto en su página', () => {
  for (const slug of ['vigilia', 'vigilia-edge', 'pulse', 'episteme']) {
    const html = read(`${slug}/index.html`);
    assert.match(
      html,
      new RegExp(`<html lang="es"[^>]*style="--accent:\\s?var\\(--tone-${slug}\\)"`),
      `/${slug}/: tono en <html>`,
    );
  }
  for (const file of ['index.html', 'cv/index.html', '404.html']) {
    const tag = read(file).match(/<html[^>]*>/)[0];
    assert.ok(!tag.includes('--tone-'), `${file}: no debe fijar un tono`);
  }
  const css = builtCss();
  for (const slug of ['pulse', 'episteme', 'vigilia', 'vigilia-edge']) {
    assert.match(css, new RegExp(`--tone-${slug}:\\s*#`), `falta --tone-${slug}`);
  }
});

test('página de proyecto: enlaza al proyecto siguiente', () => {
  const pares = [
    ['episteme', 'pulse'],
    ['pulse', 'vigilia'],
    ['vigilia', 'vigilia-edge'],
    ['vigilia-edge', 'episteme'],
  ];
  for (const [slug, siguiente] of pares) {
    const html = read(`${slug}/index.html`);
    const inicio = html.indexOf('aria-label="Proyecto siguiente"');
    assert.ok(inicio >= 0, `/${slug}/: falta el nav del proyecto siguiente`);
    const nav = html.slice(inicio, html.indexOf('</nav>', inicio));
    assert.ok(nav.includes(`href="/${siguiente}/"`), `/${slug}/: debe enlazar a /${siguiente}/`);
  }
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
    'masqueuf',
    'financiak',
    'gpalm',
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

test('privacidad: sin procesos internos de la empresa', () => {
  const internal = ['ticket', 'gerencia', 'prospecto', 'clientes internos', 'teletrabajo', 'conversiones'];
  for (const file of [...htmlFiles(), ...distFiles('.txt')]) {
    const text = readFileSync(file, 'utf8').toLowerCase();
    for (const word of internal) {
      assert.ok(!text.includes(word), `${file} contiene «${word}»`);
    }
  }
});

test('cabecera: sección activa y logo con nombre accesible', () => {
  assert.match(
    read('episteme/index.html'),
    /<a href="\/#proyectos"[^>]*aria-current="true"/,
    'en una página de proyecto «Proyectos» queda activo',
  );
  assert.doesNotMatch(read('index.html'), /aria-current="true"/);
  assert.match(read('cv/index.html'), /aria-current="page"/);
  for (const rel of Object.values(pages)) {
    const brand = read(rel).match(/<a class="brand"[^>]*>/)?.[0];
    assert.ok(brand, `${rel}: falta el logo`);
    assert.doesNotMatch(brand, /aria-label/, `${rel}: el logo no usa aria-label`);
  }
});

test('enlaces a vitrinas, al código de episteme y enlaces internos válidos', () => {
  const showcases = {
    'vigilia/index.html': 'vigilia-reforged-showcase',
    'vigilia-edge/index.html': 'vigilia-edge-showcase',
    'pulse/index.html': 'pulse-showcase',
  };
  for (const [file, repo] of Object.entries(showcases)) {
    assert.ok(read(file).includes(`https://github.com/Bajmein/${repo}`), `${file} no enlaza ${repo}`);
  }
  // episteme es de código abierto: enlaza su repositorio en la ficha y lo declara en el JSON-LD
  const episteme = read('episteme/index.html');
  assert.ok(episteme.includes('class="repo mono'), 'episteme sin enlace a su repositorio en la ficha');
  assert.ok(episteme.includes('"codeRepository":"https://github.com/Bajmein/episteme"'), 'episteme sin codeRepository');
  assert.ok(!episteme.includes('Código privado'), 'episteme dice que su código es privado');

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

test('episteme: video del grafo silenciado, con póster y sin autoplay', () => {
  const html = read('episteme/index.html');
  const video = html.match(/<video[^>]*>/)?.[0];
  assert.ok(video, 'episteme sin el video del grafo');
  for (const attr of ['muted', 'loop', 'playsinline', 'controls', 'preload="none"', 'aria-label="']) {
    assert.ok(video.includes(attr), `el video debe llevar ${attr}`);
  }
  // sin autoplay: lo reproduce el script solo si no hay prefers-reduced-motion
  assert.ok(!video.includes('autoplay'), 'el video no debe llevar autoplay');
  for (const key of ['src', 'poster']) {
    const path = video.match(new RegExp(`${key}="(/[^"]+)"`))?.[1];
    assert.ok(path && existsSync(join(DIST, path)), `${key} del video no existe en dist/: ${path}`);
  }
  assert.ok(statSync(join(DIST, 'assets/video/episteme-grafo.mp4')).size < 4_000_000, 'el video pesa 4 MB o más');
});

test('existe el PDF del CV', () => {
  assert.ok(existsSync(join(DIST, 'assets/pdf/cv_benjamin_criado.pdf')));
});

test('portada: contacto con copiar correo y CV, sin redes repetidas', () => {
  const html = read('index.html');
  const start = html.indexOf('id="contacto"');
  assert.ok(start > -1, 'falta la sección de contacto');
  const section = html.slice(start, html.indexOf('</section>', start));
  assert.match(section, /data-copy="[^"@]+@[^"]+"/, 'falta el botón de copiar con el correo');
  assert.match(section, /<button[^>]*\bhidden\b/, 'el botón debe partir oculto');
  assert.match(section, /href="\/assets\/pdf\/cv_benjamin_criado\.pdf"/, 'falta el enlace al CV');
  assert.ok(!section.includes('class="social"'), 'las redes se repiten en el contacto');
  assert.ok(html.includes('rel="me"'), 'las redes deben seguir en el pie');
});

test('portada: antetítulos en las secciones', () => {
  const html = read('index.html');
  for (const id of ['areas', 'proyectos', 'agentes', 'experiencia', 'contacto']) {
    const start = html.indexOf(`id="${id}"`);
    assert.ok(start > -1, `falta la sección #${id}`);
    const head = html.slice(start, html.indexOf('<h2', start));
    assert.ok(head.includes('class="label'), `#${id}: falta el antetítulo antes del h2`);
  }
});

test('portada: qué hago con evidencia y sin sección de TI', () => {
  const html = read('index.html');
  const section = (id) => {
    const start = html.indexOf(`id="${id}"`);
    assert.ok(start > -1, `falta la sección #${id}`);
    return html.slice(start, html.indexOf('</section>', start));
  };
  const areas = section('areas');
  assert.ok(areas.includes('class="method'), '#areas debe usar la lista method');
  assert.equal(areas.match(/<li/g)?.length, 3, '#areas debe tener tres áreas');
  assert.equal(areas.match(/class="evidence"/g)?.length, 3, 'cada área debe traer su evidencia');
  assert.ok(!html.includes('id="ti"'), 'la sección #ti ya no va en la portada');
  const pos = (id) => html.indexOf(`id="${id}"`);
  assert.ok(pos('areas') < pos('proyectos'), 'orden: #areas, #proyectos');
  const header = html.slice(html.indexOf('<header'), html.indexOf('</header>'));
  assert.ok(header.includes('href="/#areas"'), 'la cabecera debe enlazar a #areas');
  assert.ok(!header.includes('href="/#agentes"'), '#agentes ya no va en la cabecera');
});

test('caja de detección en portada, proyectos y 404', () => {
  const files = ['index.html', 'vigilia/index.html', 'vigilia-edge/index.html', 'pulse/index.html', 'episteme/index.html', '404.html'];
  for (const file of files) {
    assert.ok(read(file).includes('class="bbox'), `${file}: falta la caja de detección`);
  }
  assert.match(read('404.html'), /class="bbox[^"]*\bis-miss\b/, '404: la caja debe ser .is-miss');
});
