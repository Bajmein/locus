# Skill: CodeRabbit CLI Integration

Guía para utilizar CodeRabbit CLI como herramienta de revisión profunda asistida por IA, optimizada para usuarios Pro.

## Contexto
CodeRabbit proporciona revisiones de código contextuales y profundas. En su modo Pro, permite análisis avanzados que los agentes pueden consumir para corregir errores complejos.

## Instrucciones para el Agente

### 1. Preparación del Entorno
Antes de ejecutar CodeRabbit, especialmente en proyectos Rust:
- Ejecutar `cargo clean` o asegurar que los directorios `target/` están excluidos en `.coderabbit.yaml`.
- Si se trabaja en un **Git Worktree**, es mandatorio especificar la base (ej. `--base main`) para evitar errores de detección de archivos.

### 2. Revisión de Cambios Locales
Para validar la calidad antes de cerrar una tarea:
- Usar `coderabbit --type uncommitted` para cambios frescos.
- Si hay errores de "Out of memory", realizar un commit temporal y usar `coderabbit --type committed --base HEAD~1`.

### 3. Resolución Automática de Hallazgos
Para extraer sugerencias accionables:
- Ejecutar `coderabbit --prompt-only --type all`.
- CodeRabbit generará bloques "Prompt for AI Agent" que pueden ser copiados y ejecutados para corregir bugs detectados.

### 4. Workflow en Pipeline (Verify)
Integrar en la fase de `verify`:
1. `mise run check`.
2. `coderabbit --type all --base main`.
3. Analizar y aplicar correcciones críticas.

## Solución de Problemas
- **Error: Out of memory**: Demasiados archivos en el diff. Verificar `path_filters` en `.coderabbit.yaml` y limpiar artefactos de compilación.
- **Error: No files found**: En worktrees, CodeRabbit a veces no detecta el índice. Hacer commit temporal y usar `--type committed`.

## Comandos Rápidos
- `/coderabbit`: Ejecuta una revisión completa del estado actual.
- `/coderabbit-fix`: Obtiene sugerencias en formato `prompt-only`.
