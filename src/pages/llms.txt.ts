import type { APIRoute } from 'astro';
import { site, cv } from '../data/site';
import { projects } from '../data/projects';

// Índice para modelos de lenguaje (llmstxt.org). Sale de los mismos datos que el SEO de cada página.
export const GET: APIRoute = ({ site: base }) => {
  const url = (path: string) => new URL(path, base).href;
  // La metadescripción empieza con «Nombre: »; aquí el nombre ya está en el enlace
  const summary = (p: (typeof projects)[number]) => {
    const text = p.description.replace(`${p.title}: `, '');
    return text.charAt(0).toUpperCase() + text.slice(1);
  };
  const lines = [
    `# ${site.name}: ${site.jobTitle}`,
    '',
    `> ${site.description}`,
    '',
    '## Páginas',
    '',
    `- [Inicio](${url('/')})`,
    `- [Currículum](${url('/cv/')}): ${cv.description}`,
    '',
    '## Proyectos',
    '',
    ...projects.map((p) => `- [${p.title}](${url(`/${p.slug}/`)}): ${summary(p)}`),
    '',
    '## Optional',
    '',
    `- [Sitemap](${url('/sitemap-index.xml')})`,
    `- [Currículum en PDF](${url('/assets/pdf/cv_benjamin_criado.pdf')})`,
    ...projects.filter((p) => p.sourceUrl).map((p) => `- [Código fuente de ${p.title}](${p.sourceUrl})`),
    ...projects.filter((p) => p.repoUrl).map((p) => `- [Repositorio vitrina de ${p.title}](${p.repoUrl})`),
    `- [GitHub](${site.github})`,
    `- [LinkedIn](${site.linkedin})`,
  ];
  return new Response(`${lines.join('\n')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
