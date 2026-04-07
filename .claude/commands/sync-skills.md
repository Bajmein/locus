Sincroniza los índices de skills de Claude y Gemini reconstruyendo los symlinks en
`.claude/skills/` y `.gemini/skills/` desde la fuente de verdad en `.agents/skills/`.

Usage: `/sync-skills`

No modifica archivos SKILL.md. Solo reconstruye los directorios de índice.

## Execute

### Step 1 — Escanear fuente de verdad

Recorre `.agents/skills/` y construye el mapa `{skill_name: categoria}`:

```bash
find .agents/skills -maxdepth 2 -name "SKILL.md" | sed 's|.agents/skills/||;s|/SKILL.md||'
```

Esto lista todas las skills disponibles con su ruta relativa (`{cat}/{skill}`).

### Step 2 — Verificar symlinks en external/

Para cada entrada en `.agents/skills/external/`:

```bash
ls -la .agents/skills/external/
```

Confirmar que todos los symlinks apuntan a `/home/kenno/BenjaLabs/skills/` (no a locus ni rutas rotas).
Reportar cualquier symlink roto como advertencia.

### Step 3 — Reconstruir `.claude/skills/`

```bash
rm -rf .claude/skills/*
```

Para cada skill encontrada en Step 1 con ruta `{cat}/{skill}`:

```bash
ln -sf "../../.agents/skills/{cat}/{skill}" ".claude/skills/{skill}"
```

### Step 4 — Reconstruir `.gemini/skills/`

```bash
rm -rf .gemini/skills/*
```

Para cada skill encontrada en Step 1 con ruta `{cat}/{skill}`:

```bash
ln -sf "../../.agents/skills/{cat}/{skill}" ".gemini/skills/{skill}"
```

### Step 5 — Reportar

Emitir resumen:

```
## sync-skills — Resultado

Fuente: .agents/skills/
Skills encontradas: N
  - development: N
  - pipeline: N
  - maintenance: N
  - external: N (symlinks a /home/kenno/BenjaLabs/skills/)
  - utility: N
  - shared: N

.claude/skills/: M symlinks creados ✓
.gemini/skills/: M symlinks creados ✓

Advertencias:
  - (si hay symlinks rotos en external/)
  - (si hay skills sin comando .md en .claude/commands/)
```

## Tools

- **File discovery**: Glob, Bash (`find`, `ls -la`)
- **CLI**: Bash para `rm`, `ln -sf`
- **Read**: solo para verificar destinos de symlinks si hay advertencias
