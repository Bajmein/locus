export interface Project {
  slug: string;
  title: string;
  /** Metadescripción de la página: entre 50 y 160 caracteres */
  description: string;
  tagline: string;
  status: string;
  /** Stack completo, para la ficha de la página */
  stack: string[];
  /** Repositorio vitrina: documentación pública de un proyecto de código privado */
  repoUrl?: string;
  /** Repositorio con el código fuente, cuando el proyecto es de código abierto */
  sourceUrl?: string;
  /** Grupo de la portada: agentes de IA o visión por computador */
  group: 'agentes' | 'vision';
  /** Período de trabajo, para la tarjeta */
  period: string;
  /** Tarjeta de la portada; context aclara la línea de tiempo cuando hace falta (Vigilia) */
  card: {
    text: string;
    stack: string[];
    context?: string;
    /** Prueba breve con fuente: cifra o hecho verificable */
    proof: string;
  };
}

// Orden de la portada: agentes primero
export const projects: Project[] = [
  {
    slug: 'episteme',
    title: 'episteme',
    description:
      'episteme: memoria y documentación persistentes para agentes de IA, servidas por MCP desde un vault de notas Markdown que el usuario controla.',
    tagline: 'Documentación y memoria de proyectos para agentes, servida por MCP desde un vault Markdown.',
    status: 'En uso diario — v0.21 (noviembre de 2026). Linux, macOS y Windows. Código abierto con licencia MIT.',
    stack: ['Python', 'MCP', 'SQLite FTS5', 'Markdown'],
    sourceUrl: 'https://github.com/Bajmein/episteme',
    group: 'agentes',
    period: 'Octubre de 2026 – actualidad',
    card: {
      text: 'Los agentes de código recuerdan decisiones y lecciones entre sesiones, en notas Markdown del usuario.',
      stack: ['Python', 'MCP', 'SQLite FTS5'],
      proof: 'Código abierto · en uso diario · 390 commits',
    },
  },
  {
    slug: 'pulse',
    title: 'pulse',
    description:
      'pulse: motor en Python que lleva cada cambio de software por ocho fases con compuertas verificables y lo expone a los agentes de IA por MCP.',
    tagline: 'Motor de estados para desarrollo guiado por especificaciones (SDD), servido por MCP a varios agentes de código.',
    status: 'Ciclo cerrado — v0.13.6 (julio de 2026). Código privado.',
    stack: ['Python', 'FastMCP', 'Pydantic', 'SQLite', 'Docker'],
    repoUrl: 'https://github.com/Bajmein/pulse-showcase',
    group: 'agentes',
    period: 'Mayo – julio de 2026',
    card: {
      text: 'Un motor que no deja al agente saltarse fases: cada cambio avanza solo con su especificación, su diseño aprobado y sus pruebas.',
      stack: ['Python', 'FastMCP', 'Pydantic'],
      proof: '244 tests · ocho fases con compuertas',
    },
  },
  {
    slug: 'vigilia',
    title: 'Vigilia Reforged',
    description:
      'Vigilia Reforged: plataforma de monitoreo con análisis de video en tiempo real, zonas de seguridad configurables y alertas multicanal.',
    tagline: 'Análisis de video en tiempo real con respuesta automática a los eventos.',
    status: 'Versión de titulación — v0.8.1',
    stack: ['Rust', 'Python', 'ONNX Runtime', 'NVDEC', 'PySide6'],
    repoUrl: 'https://github.com/Bajmein/vigilia-reforged-showcase',
    group: 'vision',
    period: '2025',
    card: {
      text: 'Análisis de video en tiempo real que detecta y responde a incidentes mientras ocurren.',
      stack: ['Rust', 'Python', 'NVDEC'],
      context: 'Segunda generación de Vigilia, 2025',
      proof: 'Proyecto de título · decodificación por GPU en Rust',
    },
  },
  {
    slug: 'vigilia-edge',
    title: 'Vigilia Edge',
    description:
      'Vigilia Edge: videovigilancia local en un PC de escritorio, con inferencia por GPU, núcleo en Rust y unos 80 ms de la cámara a la pantalla.',
    tagline: 'Videovigilancia que se ejecuta por completo en el equipo local, sin nube ni latencia de red.',
    status: 'v1.1.0 — operativa en estaciones de trabajo locales',
    stack: ['YOLO', 'TensorRT', 'Rust', 'PySide6'],
    repoUrl: 'https://github.com/Bajmein/vigilia-edge-showcase',
    group: 'vision',
    period: '2025',
    card: {
      text: 'Detección y seguimiento de objetos en tiempo real en un PC de escritorio, sin nube.',
      stack: ['YOLO', 'TensorRT', 'PySide6'],
      context: 'Primera generación de Vigilia, 2025',
      proof: 'Menos de dos cuadros (≈ 80 ms) de la cámara a la pantalla',
    },
  },
];

export function getProject(slug: string): Project {
  const project = projects.find((p) => p.slug === slug);
  if (!project) throw new Error(`Proyecto desconocido: ${slug}`);
  return project;
}
