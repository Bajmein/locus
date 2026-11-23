# DESIGN.md — Locus

Dirección «Vigilia nocturna»: el cielo de noche de La Serena y una lámpara ámbar encendida. El sitio
muestra a un ingeniero que construye herramientas para agentes de IA y sistemas de visión por
computador; el diseño toma su vocabulario de esos dos mundos (la caja de detección y el registro de
un agente) en vez de decorar con recursos genéricos.

Esta dirección no se basó en ejemplos de sitios reales (la biblioteca UXKIN no estaba conectada):
sale del contenido del sitio, de sus proyectos y de su lugar.

## Principios

1. **Un solo momento memorable.** El nombre del hero entra como un objeto detectado: una línea de
   barrido recorre el hero, el nombre aparece de izquierda a derecha y una caja de detección se fija
   sobre él con su etiqueta. Todo lo demás es sobrio.
2. **El movimiento responde a algo.** Fuera de la secuencia de carga solo se anima lo que responde a
   la persona: el scroll (riel del trabajo con agentes) o el cursor (tarjetas). El punto «Ahora» es el
   único bucle, porque indica algo vivo.
3. **La estructura informa.** Sin rótulos en mayúsculas sobre cada título, sin numeración decorativa.
   Las fechas, cifras y el código van en mono porque son datos; el resto, en tipo de oración.
4. **Cerrar como se abre.** «Conversemos» usa el mismo tipo ancho que el nombre: el contacto es el
   final deliberado de la página.

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
la izquierda y grano fino al 7 %.

## Tipografía

- **Archivo Variable** (eje de ancho 62–125 % y peso 100–900), autoalojada. Una sola familia: el ancho
  es la personalidad.
  - Display (nombre, «Conversemos»): 800, ancho 112 %, interletra −0,035em, interlínea 0,92.
  - Títulos de sección: 700, ancho 118 %, `clamp(2rem, 4.2vw, 3.25rem)`.
  - Cuerpo: 400, ancho 100 %, 17 px, interlínea 1,65, líneas de 68 caracteres como máximo.
  - Rótulos: 500, 14 px, tipo de oración, `--muted`.
- **Geist Mono**: solo cifras, stack, código y la consola (14 px).
- Ningún texto bajo 12 px (lo verifica `npm test`).

Escala: 13 · 14 · 15,5 · 17 · 20–24 (lead) · 28–44 (tarjetas) · 32–52 (secciones) · 56–112 (display).

## Espaciado y forma

- Ancho de contenido 1200 px; gutter `clamp(1rem, 4vw, 2rem)`.
- Secciones separadas por una línea de 1 px y `clamp(3rem, 8vw, 5.5rem)` de aire.
- Radio: 6 px en botones, 10 px en paneles y tarjetas, 999 px en chips. Sin sombras exteriores.

## Componentes

- **Cabecera**: opaca (`--bg`), borde inferior de 1 px y línea de progreso de lectura en el acento.
- **Botón primario**: fondo ámbar, texto `--accent-ink`; hover más claro; `:active` escala 0,98.
  Secundario: borde `--border`. Foco: contorno de 2 px en el acento.
- **Caja de detección** (`.bbox`): cuatro esquinas de 2 px, contorno de 1 px al 22 % y etiqueta mono
  sobre fondo ámbar.
- **Consola** (`.console`): panel con el ciclo de un cambio; verbo en ámbar, estado en verde.
- **Tarjeta de proyecto**: superficie sólida, tono del proyecto, ícono, marca de agua del ícono en
  grande (7 %, 22 % al pasar el cursor), filo superior que crece al seleccionarla y enlace «Ver
  proyecto» siempre visible. Mosaico 7/5 para agentes y 6/6 para visión.
- **Riel** del trabajo con agentes: subgrid para alinear período, nombre, texto y cifras; el relleno y
  la ficha avanzan con el scroll.

## Movimiento

| Momento | Disparo | Duración |
| --- | --- | --- |
| Barrido, nombre, caja de detección, consola | Carga (una vez) | 0,1–3,6 s en total |
| Riel y ficha | Scroll (`animation-timeline: view()`) | Ligado al scroll |
| Filo, marca de agua e ícono de la tarjeta | Cursor o foco | 0,25–0,45 s |
| Punto «Ahora» | Bucle | 2,4 s |

Curva: `--ease-out` (`cubic-bezier(0.16, 1, 0.3, 1)`). Con `prefers-reduced-motion: reduce` no hay
ninguna animación y todo se ve en su estado final.

## Íconos e imágenes

Íconos SVG en línea propios por proyecto (`ProjectIcon`) y de contacto (`Icon`); diagramas SVG en las
páginas de proyecto. Sin fotos ni emojis.
