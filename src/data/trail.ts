/**
 * Trabajo con agentes de IA: las cuatro herramientas de la línea de tiempo de `#agentes`, con sus cifras de GitHub
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
    name: 'Forge',
    period: 'Abril – julio de 2026',
    text: 'Pipeline guiado por especificaciones: cada cambio avanza por fases con artefactos validados por esquemas, compatible con cualquier agente.',
    commits: 304,
    prs: 38,
  },
  {
    slug: 'pulse',
    name: 'pulse',
    period: 'Mayo – julio de 2026',
    text: 'Motor de estados servido por MCP: compuertas entre fases, revisión automática y escenarios Dado/Cuando/Entonces, para varios agentes de código.',
    commits: 270,
    prs: 50,
    href: '/pulse/',
  },
  {
    name: 'fabrik',
    period: 'Octubre de 2026 – actualidad',
    text: 'Plugin de Claude Code: un orquestador con cinco subagentes acotados; los hooks impiden editar sin especificación y cada verificación se ejecuta como un comando.',
    commits: 72,
    prs: 46,
  },
  {
    slug: 'episteme',
    name: 'episteme',
    period: 'Octubre de 2026 – actualidad',
    text: 'Memoria persistente servida por MCP: decisiones y lecciones que el agente consulta y completa en cada sesión.',
    commits: 390,
    prs: epistemePrs.before + epistemePrs.public,
    href: '/episteme/',
  },
];

export const totalCommits = trail.reduce((n, t) => n + t.commits, 0);
export const totalPrs = trail.reduce((n, t) => n + t.prs, 0);

export function getStep(name: string): TrailStep {
  const step = trail.find((t) => t.name === name);
  if (!step) throw new Error(`Paso de la línea de tiempo desconocido: ${name}`);
  return step;
}
