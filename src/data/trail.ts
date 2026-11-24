/**
 * Trabajo con agentes de IA: las tres herramientas de la línea de tiempo de `#agentes`, con sus cifras de GitHub
 * (commits y pull requests fusionados). Fuente única para la portada, el CV, la página de episteme y su tarjeta: al
 * actualizar las cifras, cambia `figuresDate` y los números de aquí.
 */
export interface TrailStep {
  /** Slug de la página del proyecto, si la tiene (tono e ícono) */
  slug?: string;
  name: string;
  period: string;
  text: string;
  commits: number;
  prs: number;
  href?: string;
  /** Estado breve cuando el hito no enlaza a página propia */
  note?: string;
}

/** Fecha de las cifras, tal como se cita en el sitio */
export const figuresDate = '24 de noviembre de 2026';

/**
 * episteme abrió su código en un repositorio nuevo: sus PR suman los del repositorio anterior (privado) y los del
 * público; sus commits son los del público, que conserva la historia.
 */
export const epistemePrs = { before: 124, public: 52 };

export const trail: TrailStep[] = [
  {
    slug: 'pulse',
    name: 'pulse',
    period: 'Mayo – julio de 2026',
    text: 'Punto de partida: un motor MCP con compuertas estrictas entre ocho fases y revisión automática, para que ningún agente pudiera saltarse un paso.',
    commits: 270,
    prs: 50,
    href: '/pulse/',
    note: 'Ciclo cerrado',
  },
  {
    name: 'fabrik',
    period: 'Octubre de 2026 – actualidad',
    text: 'Destiló esa disciplina sin servidor intermedio: cinco subagentes acotados y hooks en Claude Code que bloquean ediciones sin especificación.',
    commits: 72,
    prs: 46,
    note: 'En uso diario',
  },
  {
    slug: 'episteme',
    name: 'episteme',
    period: 'Octubre de 2026 – actualidad',
    text: 'Resolvió lo que seguía faltando entre cambios: memoria persistente y normas por archivo servidas por MCP desde notas Markdown locales.',
    commits: 390,
    prs: epistemePrs.before + epistemePrs.public,
    href: '/episteme/',
    note: 'En uso diario',
  },
];

export const totalCommits = trail.reduce((n, t) => n + t.commits, 0);
export const totalPrs = trail.reduce((n, t) => n + t.prs, 0);

export function getStep(name: string): TrailStep {
  const step = trail.find((t) => t.name === name);
  if (!step) throw new Error(`Paso de la línea de tiempo desconocido: ${name}`);
  return step;
}
