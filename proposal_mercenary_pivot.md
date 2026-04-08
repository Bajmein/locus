# Propuesta: Mercenary Pivot — Textos de Reemplazo Exactos

Cambio **015-mercenary-pivot**. Todos los bloques `REEMPLAZAR CON` son el contenido
final listo para copiar. Los detalles técnicos se conservan íntegramente; solo cambia
el orden narrativo y el encuadre.

---

## 1. `docs/index.md` — Home

### Reemplazar el archivo completo con:

```markdown
---
title: Benjamín Criado - Software Engineer
description: >
  Software Engineer especializado en Backend y Sistemas. Arquitecturas pragmáticas
  para producción. Rust para latencia crítica, Python para orquestación.
---

# Benjamín Criado

Software Engineer especializado en Backend y Sistemas. Construyo arquitecturas
pragmáticas que funcionan en producción. Uso la herramienta adecuada para el
problema: Rust para latencia crítica y gestión de memoria, Python para orquestación
y SDD para automatizar el desarrollo.

---

<div class="grid cards" markdown>

-   **[Forge](/forge/)**

    ---

    Pipeline de Spec-Driven Development que convierte ideas en código verificado.
    Trazabilidad completa desde la propuesta hasta el archivo, con garantías formales.

-   **[Vigilia Reforged](/vigilia/)**

    ---

    Plataforma de monitoreo que detecta, decide y actúa antes de que ocurra el
    incidente. Respuesta automática en tiempo real sin intervención humana constante.

-   **[Vigilia Edge](/vigilia-edge/)**

    ---

    Vigilancia inteligente completamente local: inferencia en producción sin nube,
    sin latencia de red, con latencia frame-a-frame predecible y determinista.

</div>

_Work in Progress_

## Contacto

[kenno13@proton.me](mailto:kenno13@proton.me)
```

---

## 2. `docs/vigilia/index.md` — Vigilia Reforged

### Reemplazar SOLO la introducción (líneas 8–11 del archivo actual):

**TEXTO ACTUAL:**
```markdown
# Vigilia Reforged

**De la vigilancia pasiva al monitoreo inteligente y proactivo.**

Vigilia es una plataforma de seguridad que transforma flujos de video en
inteligencia operativa en tiempo real. En lugar de grabar para revisar después
de un incidente, Vigilia analiza, decide y actúa mientras los eventos ocurren.
```

**REEMPLAZAR CON:**
```markdown
# Vigilia Reforged

**Monitoreo inteligente que actúa antes de que ocurra el incidente.**

Los sistemas CCTV tradicionales almacenan video para que alguien lo revise después.
El coste operativo es alto, la tasa de respuesta es baja, y la mayoría de los
incidentes no se detectan a tiempo — no por falta de cámaras, sino por falta de
capacidad de procesamiento.

Vigilia elimina esa brecha: analiza video en tiempo real con aceleración hardware,
aplica reglas configurables por el operador y dispara respuestas automáticas sin
intervención humana constante. La elección de Rust para el pipeline de inferencia
no es preferencia tecnológica — es el único camino para mantener latencia
sub-frame mientras se procesan múltiples streams de cámara simultáneamente.
```

> El resto del archivo (`## El Problema`, `## La Solución`, arquitectura, stack,
> capacidades) se mantiene **sin cambios**.

---

## 3. `docs/vigilia-edge/index.md` — Vigilia Edge

### Reemplazar SOLO la introducción (líneas 8–11 del archivo actual):

**TEXTO ACTUAL:**
```markdown
# Vigilia Edge

**Sistema de vigilancia inteligente que corre completamente en local — sin nube, sin latencia de red.**
```

**REEMPLAZAR CON:**
```markdown
# Vigilia Edge

**Vigilancia inteligente local: el problema era mover 6 MB por frame entre procesos
sin copiarlo, sin congelar la UI y sin depender de nube.**

Hacer inferencia de video en tiempo real en una estación de trabajo local tiene
tres constraints no negociables: el GIL de Python bloquea el paralelismo real entre
hilos, hacer inferencia en el hilo de UI congela la pantalla, y serializar tensores
de video entre procesos destruye el rendimiento. Vigilia Edge resuelve los tres con
una arquitectura híbrida Python/Rust: Multiprocessing para romper el GIL,
Shared Memory para eliminar copias, y un núcleo Rust que opera completamente fuera
del intérprete. El resultado es un pipeline determinista de cámara a UI con latencia
predecible frame a frame (~80ms a 25fps) — operativo en producción desde v1.0.
```

> El resto del archivo (arquitectura de cuatro capas, stack técnico, tabla de
> Multiprocessing/Shared Memory, sistema de respuesta activa) se mantiene
> **sin cambios**.

---

## 4. `docs/forge/index.md` — Forge

### Reemplazar SOLO la introducción (líneas 8–11 del archivo actual):

**TEXTO ACTUAL:**
```markdown
# Forge

**Arquitectura industrial de Spec-Driven Development para desarrollo autónomo con agentes de IA.**

Forge resuelve un problema específico: el desarrollo con agentes de IA es potente pero caótico. Sin estructura, los cambios son difíciles de rastrear, reproducir o revisar. Forge no es un framework genérico de agentes, sino una arquitectura industrial que introduce un pipeline schema-driven con garantías formales, convirtiendo ideas en código verificado de forma sistemática.
```

**REEMPLAZAR CON:**
```markdown
# Forge

**Pipeline que convierte el desarrollo con IA de caótico a trazable — sin perder velocidad.**

Desarrollar con agentes de IA es potente pero ad-hoc: instrucciones informales,
contexto implícito, cambios sin trazabilidad. Para tareas aisladas funciona. En
proyectos reales con múltiples cambios en paralelo, múltiples agentes y necesidad
de reproducibilidad, el enfoque informal acumula deuda invisible.

Forge no añade burocracia: formaliza el flujo que ya existe (proponer → aprobar →
implementar → verificar) con artefactos validados en cada etapa. El pipeline es
pura orquestación sobre Markdown y YAML — sin servidor, sin runtime propio, sin
lock-in a ningún agente específico. Claude Code, Gemini CLI o cualquier cliente
compatible ejecutan las mismas fases con los mismos artefactos.
```

> El resto del archivo (`## El Problema`, `## La Solución`, mecanismo de delta specs,
> garantías, trazabilidad, jerarquía de conocimiento, capacidades, stack) se mantiene
> **sin cambios**.

---

## 5. `docs/cv.md` — CV

### Reemplazar párrafo introductorio y frontmatter description:

**TEXTO ACTUAL (frontmatter):**
```yaml
description: CV profesional de Benjamín Criado, Ingeniero Informático especializado en diseño de sistemas, automatización y orquestación de flujos de trabajo.
```

**REEMPLAZAR CON:**
```yaml
description: CV de Benjamín Criado — Software Engineer especializado en Backend y Sistemas. Arquitecturas pragmáticas, Rust para rendimiento crítico, Python para orquestación.
```

**TEXTO ACTUAL (párrafo introductorio, línea 8):**
```markdown
Ingeniero Informático enfocado en diseño de sistemas, automatización y orquestación de flujos de trabajo.
```

**REEMPLAZAR CON:**
```markdown
Software Engineer | Backend & Systems Architecture | Pragmatic Execution
```

---

## Comandos de aplicación

```bash
# Aplicar todos los cambios (después de editar los archivos manualmente o vía apply)
git add docs/index.md docs/vigilia/index.md docs/vigilia-edge/index.md docs/forge/index.md docs/cv.md
git commit -m "refactor: update narrative to pragmatic software engineer profile"
```

> Para aplicar vía pipeline: `/approve` → `/apply` sobre el cambio **015-mercenary-pivot**.
