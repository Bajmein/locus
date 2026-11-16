// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://benjamincriado.dev',
  // Salida por directorio (por defecto): conserva las URL con barra final.
  build: { format: 'directory' },
  trailingSlash: 'always',
  // Compresión sin pérdida; la regla JSX de Astro 7 borraría espacios entre elementos en línea.
  compressHTML: true,
  integrations: [sitemap()],
  // Mermaid se carga con import() dinámico y solo en páginas con diagramas; sus chunks grandes son esperados.
  vite: { build: { chunkSizeWarningLimit: 2000 } },
});
