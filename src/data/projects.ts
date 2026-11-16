export interface Project {
  slug: string;
  title: string;
  /** Metadescripción de la página: entre 50 y 160 caracteres */
  description: string;
  tagline: string;
  status: string;
  /** Stack completo, para la ficha de la página */
  stack: string[];
  repoUrl?: string;
  /** Grupo de la portada: agentes de IA o visión por computador */
  group: 'agentes' | 'vision';
  /** Período de trabajo, para la tarjeta */
  period: string;
  /** Tarjeta de la portada */
  card: { text: string; stack: string[] };
}

// Orden de la portada: agentes primero
export const projects: Project[] = [
  {
    slug: 'episteme',
    title: 'episteme',
    description:
      'episteme: memoria y documentación persistente para agentes de IA, servida por MCP desde un vault de notas Markdown que el usuario controla.',
    tagline: 'Documentación y memoria de proyectos para agentes, servida por MCP desde un vault Markdown.',
    status: 'En uso diario — v0.13 (noviembre de 2026). Linux, macOS y Windows. Código privado.',
    stack: ['Python', 'MCP', 'SQLite FTS5', 'Markdown'],
    group: 'agentes',
    period: 'Octubre de 2026 — hoy',
    card: {
      text: 'Memoria y documentación persistente para agentes de IA, servida por MCP.',
      stack: ['Python', 'MCP', 'SQLite FTS5'],
    },
  },
  {
    slug: 'forge',
    title: 'Forge',
    description:
      'Forge: desarrollo guiado por especificaciones para agentes de IA, con un pipeline de artefactos validados que convierte ideas en código verificado.',
    tagline: 'Herramienta personal de desarrollo guiado por especificaciones (SDD) para trabajar con agentes de IA.',
    status: 'Ciclo cerrado — v0.1.0',
    stack: ['SDD', 'YAML', 'Markdown', 'Python'],
    repoUrl: 'https://github.com/Bajmein/forge-showcase',
    group: 'agentes',
    period: 'Abril — julio de 2026',
    card: {
      text: 'Pipeline de desarrollo guiado por especificaciones para agentes de código.',
      stack: ['SDD', 'YAML', 'Python'],
    },
  },
  {
    slug: 'vigilia',
    title: 'Vigilia Reforged',
    description:
      'Vigilia Reforged: plataforma de monitoreo inteligente con análisis de video en tiempo real, zonas de seguridad configurables y alertas multicanal.',
    tagline: 'De la vigilancia pasiva al monitoreo inteligente y proactivo.',
    status: 'Versión de titulación — v0.8.1',
    stack: ['Rust', 'Python', 'ONNX Runtime', 'NVDEC', 'PySide6'],
    repoUrl: 'https://github.com/Bajmein/vigilia-reforged-showcase',
    group: 'vision',
    period: '2026',
    card: {
      text: 'Análisis de video en tiempo real que detecta y responde a incidentes mientras ocurren.',
      stack: ['Rust', 'Python', 'NVDEC'],
    },
  },
  {
    slug: 'vigilia-edge',
    title: 'Vigilia Edge',
    description:
      'Vigilia Edge: vigilancia inteligente de escritorio con inferencia local, núcleo en Rust, interfaz PySide6 y pipeline de video de alto rendimiento.',
    tagline: 'Sistema de vigilancia inteligente que corre completamente en local: sin nube y sin latencia de red.',
    status: 'v1.0 — operativa en estaciones de trabajo locales',
    stack: ['YOLO', 'TensorRT', 'Rust', 'PySide6'],
    repoUrl: 'https://github.com/Bajmein/vigilia-edge-showcase',
    group: 'vision',
    period: '2025',
    card: {
      text: 'Vigilancia inteligente de escritorio con inferencia local, sin nube.',
      stack: ['YOLO', 'TensorRT', 'PySide6'],
    },
  },
];

export function getProject(slug: string): Project {
  const project = projects.find((p) => p.slug === slug);
  if (!project) throw new Error(`Proyecto desconocido: ${slug}`);
  return project;
}
