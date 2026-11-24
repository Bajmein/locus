# DESIGN.md — Locus

Dirección «Vigilia nocturna»: el cielo de noche de La Serena y una lámpara ámbar encendida. El sitio
muestra a un ingeniero a cargo del área de TI de un grupo de empresas, con especialidad en agentes de IA
y visión por computador; el diseño toma su vocabulario de esos dos mundos (la caja de detección y el registro de
un agente) en vez de decorar con recursos genéricos.

Esta dirección no se basó en ejemplos de sitios reales (la biblioteca UXKIN no estaba conectada):
sale del contenido del sitio, de sus proyectos y de su lugar.

Además recupera la voz técnica del diseño anterior: rótulos en Geist Mono y en mayúsculas, un
antetítulo sobre cada título con una barra ámbar que crece, la grilla fina de sensor en el hero y
paneles glass translúcidos. La noche, el titular ancho, la caja de detección, la consola y el mosaico
de tarjetas se mantienen, y el mismo sistema se extiende a las páginas de proyecto, al CV y a la 404.

## Principios

1. **Un solo momento memorable.** El nombre del hero entra como un objeto detectado: una línea de
   barrido recorre el hero, el nombre aparece de izquierda a derecha y una caja de detección se fija
   sobre él con su etiqueta. La misma caja marca el título de cada proyecto y, sin detección, el de la
   404. Todo lo demás es sobrio.
2. **El movimiento responde a algo.** Fuera de la secuencia de carga solo se anima lo que responde a
   la persona: el scroll (aparición de tarjetas, barra bajo el título, riel, cierre de contacto) o el
   cursor (tarjetas). El punto «Ahora» es el único bucle, porque indica algo vivo.
3. **La voz técnica.** Rótulos en mono y en mayúsculas: fechas, estados y la clase de cada proyecto
   (son datos) y un antetítulo sobre cada título de sección. Sin numeración decorativa. Cifras, stack y
   código en mono sin mayúsculas; el resto, en tipo de oración.
4. **Cerrar como se abre.** «Conversemos» usa el mismo tipo ancho que el nombre, entra con el mismo
   barrido y termina con el cursor del logo (`bc_`): el contacto es el final deliberado de la página.

## Color

| Token | Valor | Rol |
| --- | --- | --- |
| `--bg` | `#0c1220` | Noche: fondo de todas las páginas |
| `--surface` | `#131b2c` | Paneles, tarjetas y consola |
| `--border` | `#26324b` | Líneas de 1 px y bordes |
| `--text` | `#eaedf3` | Texto principal (15,9:1 sobre `--bg`) |
| `--muted` | `#9ba7bd` | Texto secundario (7,7:1 sobre `--bg`) |
| `--accent` | `#f0a93b` | Lámpara: acciones, enlaces, caja de detección (9,3:1) |
| `--accent-ink` | `#0c1220` | Texto sobre el ámbar |
| `--tone-<slug>` | ver `global.css` | Un tono por proyecto; reemplaza a `--accent` en su tarjeta y su página |

`--tone-vigilia` (verde) se usa también como color de estado correcto (`ok`, punto «Ahora»).
No se añaden otros colores. Fondo: un resplandor ámbar arriba a la derecha, un velo azul muy tenue a
la izquierda y grano fino al 7 %. Solo en el hero, una grilla de 56 px (`--grid-line`, 4 % del texto)
con máscara radial hacia la lámpara, como el campo de un sensor.

## Tipografía

- **Archivo Variable** (`--font-display`; eje de ancho 62–125 % y peso 100–900): solo display y
  títulos. Es la única fuente precargada.
  - Display (nombre, «Conversemos»): 800, ancho 112 %, interletra −0,035em, interlínea 0,92.
  - Títulos de sección: 700, ancho 118 %, `clamp(2rem, 4.2vw, 3.25rem)`; nombres de proyecto, pasos
    del riel y `h2` de las páginas de proyecto: 700, ancho 112 %.
- **Geist Variable** (`--font-sans`): cuerpo e interfaz. 400, 17 px, interlínea 1,65, columna de prosa
  de 46rem (`--w-prose`, en rem para que no dependa de la fuente y los diagramas quepan en su
  composición ancha).
- **Geist Mono** (`--font-mono`): rótulos (`.label`: 13 px, mayúsculas, interletra 0,08em, `--muted`)
  y, sin mayúsculas, cifras, stack, código y la consola (`.mono`, 14 px).
- Las tres van autoalojadas con `@fontsource-variable`.
- Ningún texto bajo 12 px (lo verifica `npm test`).

Escala: 13 · 14 · 15,5 · 17 · 20–24 (lead) · 28–44 (tarjetas) · 32–52 (secciones) · 56–112 (display).

## Espaciado y forma

- Ancho de contenido 1200 px; gutter `clamp(1rem, 4vw, 2rem)`.
- Secciones separadas por una línea de 1 px y `clamp(3rem, 8vw, 5.5rem)` de aire.
- Radio: 6 px en botones, 10 px en paneles y tarjetas, 999 px en chips. Sin sombras exteriores.

## Componentes

- **Paneles glass** (`.glass`): superficie al 78 %, borde de 1 px, desenfoque de 16 px (10 en móvil);
  sólidos (`--surface`) sin `backdrop-filter` o con `prefers-reduced-transparency`. Los usan la
  consola, «Ahora», la ficha y «Siguiente proyecto» de cada proyecto, los diagramas y la 404.
- **Cabecera**: glass sobre `--bg` al 85 % (opaca con transparencia reducida), borde inferior de 1 px y
  línea de progreso de lectura en el acento.
- **Título de sección**: antetítulo `.label` en el acento, título en display y una barra del acento de
  3rem × 2 px debajo, que crece al entrar en pantalla.
- **Botón primario**: fondo ámbar, texto `--accent-ink`; hover más claro; `:active` escala 0,98.
  Secundario: borde `--border`. Foco: contorno de 2 px en el acento.
- **Caja de detección** (`.target` + `.bbox`, en `global.css`): cuatro esquinas de 2 px, contorno de
  1 px al 22 % y etiqueta mono sobre el acento; se fija al cargar. En móvil sobresale menos para no
  salirse del gutter. Variante `.is-miss` (404, «sin detección»): contorno discontinuo y todo en
  `--muted`.
- **Consola** (`.console`): panel con el ciclo de un cambio; verbo en ámbar, estado en verde.
- **Qué hago** (`#areas`): tres áreas en la lista `.method` (tres columnas con líneas de 1 px, `h3`); cada
  una cierra con `.evidence`: rótulo «Evidencia» y enlaces en el acento, a 13 px.
- **Pruebas** (`.proof`, mono a 13 px): en el hero, bajo los botones, la cifra del trabajo con agentes
  (atenuada, con las cifras en `--text`); en cada tarjeta de proyecto, una línea en el tono del
  proyecto. En el hero, `.facts` lista la disponibilidad en mono atenuado, separada por puntos medios
  (en móvil, solo con espacio).
- **Tarjeta de proyecto**: superficie sólida (no glass: la marca de agua necesita un fondo parejo),
  tono del proyecto, ícono, marca de agua del ícono en la esquina (12rem, 15rem en agentes; 6 %, 14 %
  al pasar el cursor) con el texto fuera de ella, filo superior que crece, elevación de 3 px y «Ver
  proyecto →» con la flecha que avanza. Mosaico 7/5 para agentes y 6/6 para visión.
- **Riel** del trabajo con agentes: subgrid para alinear período, nombre, texto y cifras en escritorio;
  en móvil, una columna sin subgrid. El relleno (horizontal o vertical) y la ficha avanzan con el
  scroll.

## Movimiento

| Momento | Disparo | Duración |
| --- | --- | --- |
| Barrido, nombre, caja de detección, consola | Carga (una vez) | 0,1–3,6 s en total |
| Caja de detección en proyectos y 404 | Carga (una vez) | 0,3–1,05 s |
| Aparición de tarjetas, pasos del riel y principios | Scroll (`animation-timeline: view()`) | Ligado al scroll |
| Barra bajo el título | Scroll | Ligado al scroll |
| Riel y ficha (relleno vertical en móvil, sin ficha) | Scroll | Ligado al scroll |
| Cierre de «Conversemos» (barrido) | Scroll | Ligado al scroll |
| Filo, elevación, marca de agua, flecha e ícono de la tarjeta | Cursor o foco | 0,2–0,45 s |
| Punto «Ahora» | Bucle | 2,4 s |

Curva: `--ease-out` (`cubic-bezier(0.16, 1, 0.3, 1)`). Con `prefers-reduced-motion: reduce` no hay
ninguna animación y todo se ve en su estado final.

## Íconos e imágenes

Íconos SVG en línea propios por proyecto (`ProjectIcon`) y de contacto (`Icon`); diagramas SVG en las
páginas de proyecto. Sin fotos ni emojis.
