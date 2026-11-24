export const site = {
  name: 'Benjamín Criado',
  fullName: 'Benjamín Ignacio Criado Rossa',
  /** Nombre con que firmo la autoría: pie, JSON-LD (`Person.name`) y llms.txt. El hero y el CV usan `name`/`fullName` */
  alias: 'Kenno',
  /** Usuario de GitHub */
  handle: 'Bajmein',
  /** Otras formas del nombre del autor, para el JSON-LD (`alternateName`) */
  alternateNames: ['Bajmein'],
  jobTitle: 'Ingeniero informático',
  location: 'La Serena, Chile',
  description:
    'Ingeniero informático en La Serena, Chile: software en Python y agentes de IA, automatización e integraciones. Trabajo remoto en español e inglés.',
  email: 'kenno13@proton.me',
  github: 'https://github.com/Bajmein',
  linkedin: 'https://www.linkedin.com/in/benjamin-criado-rossa/',
} as const;

export const nav = [
  { label: 'Qué hago', href: '/#areas' },
  { label: 'Proyectos', href: '/#proyectos' },
  { label: 'CV', href: '/cv/' },
  { label: 'Contacto', href: '/#contacto' },
] as const;

export const cv = {
  title: 'Currículum — Benjamín Criado',
  description:
    'Currículum de Benjamín Criado, ingeniero informático en La Serena, Chile: experiencia, proyectos, stack técnico, formación e idiomas.',
};
