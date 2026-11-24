import { getStep } from './trail';

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
  /** Etiqueta técnica de la caja de detección en la cabecera de su página */
  detected: string;
  /** Insignia destacada opcional en la tarjeta de la portada */
  badge?: string;
  /** Indicadores verificables para la banda superior de su página */
  metrics: { value: string; label: string }[];
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
      'episteme: una memoria de proyecto curada que comparten tus agentes de IA (Claude Code y Gemini), servida por MCP desde notas Markdown locales.',
    tagline: 'Una sola memoria de proyecto, curada, que comparten tus agentes: lo que decide Claude lo sabe Gemini en la sesión siguiente.',
    status: 'En uso diario — v0.21 (noviembre de 2026). Linux, macOS y Windows. Código abierto con licencia MIT.',
    stack: ['Python', 'MCP', 'SQLite FTS5', 'Markdown'],
    sourceUrl: 'https://github.com/Bajmein/episteme',
    group: 'agentes',
    detected: 'mcp · memoria local',
    badge: 'MIT · Código abierto',
    metrics: [
      { value: `${getStep('episteme').commits} commits`, label: 'Desarrollo activo desde oct. 2026' },
      { value: `${getStep('episteme').prs} PR`, label: 'Fusionados en la historia del proyecto' },
      { value: 'SQLite FTS5', label: 'Búsqueda por palabras, sin embeddings ni nube' },
    ],
    period: 'Octubre de 2026 – actualidad',
    card: {
      text: 'Una memoria de proyecto curada que comparten Claude Code y Gemini: decisiones, normas y estado del trabajo entre sesiones, en Markdown local.',
      stack: ['Python', 'MCP', 'SQLite FTS5'],
      proof: `Código abierto · Claude Code y Gemini · ${getStep('episteme').commits} commits`,
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
    detected: 'fsm · 8 fases',
    metrics: [
      { value: '8 fases', label: 'Compuertas declarativas por cambio' },
      { value: '244 pruebas', label: 'Incluidas propiedades del dominio' },
      { value: '6 chequeos', label: 'Revisión automática antes de cerrar' },
    ],
    period: 'Mayo – julio de 2026',
    card: {
      text: 'Un motor que no deja al agente saltarse fases: cada cambio avanza solo con su especificación, su diseño aprobado y sus pruebas.',
      stack: ['Python', 'FastMCP', 'Pydantic'],
      proof: '244 pruebas · ocho fases con compuertas',
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
    detected: 'gpu · tiempo real',
    metrics: [
      { value: '0 copias en CPU', label: 'Decodificación NVDEC y PTX en GPU' },
      { value: '192 bytes', label: 'Mensajes de ABI fija en Iceoryx2' },
      { value: 'Tiempo real', label: 'Eventos ONVIF Profile M y WebRTC' },
    ],
    period: '2025',
    card: {
      text: 'Análisis de video en tiempo real que detecta y responde a incidentes mientras ocurren.',
      stack: ['Rust', 'Python', 'NVDEC'],
      context: 'Segunda generación de Vigilia, 2025',
      proof: 'Proyecto de título · 0 copias en CPU (NVDEC + Iceoryx2)',
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
    detected: 'edge · < 80 ms',
    metrics: [
      { value: '< 80 ms', label: 'Menos de dos cuadros a 25 fps' },
      { value: '4 capas', label: 'Una contra cada límite de Python' },
      { value: '3 algoritmos', label: 'De seguimiento, elegibles, en Rust' },
    ],
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
