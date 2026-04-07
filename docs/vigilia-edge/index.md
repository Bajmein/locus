---
title: "Vigilia Edge — Desktop v1.0"
description: >
  Vigilia Edge es la versión Desktop de producción del sistema de vigilancia inteligente.
  Inferencia local con núcleo Rust, UI PySide6 y pipeline de video zero-copy.
---

# Vigilia Edge

**Sistema de vigilancia inteligente que corre completamente en local — sin nube, sin latencia de red.**

---

## ¿Qué hace?

- Detecta y rastrea objetos en video en tiempo real mediante inferencia local con ONNX Runtime GPU
- Renderiza overlays de detección en una UI nativa de escritorio PySide6 (Qt 6)
- Mueve frames de cámara a pantalla en menos de 2 frames (~80ms a 25fps) mediante un pipeline zero-copy
- Gestiona todo el procesamiento a través de un núcleo Rust compilado como extensión nativa (PyO3)

---

## Stack Técnico

| Capa         | Tecnología                                          |
| ------------ | --------------------------------------------------- |
| Interfaz     | PySide6 (Qt 6) — UI nativa de escritorio            |
| Inferencia   | ONNX Runtime (GPU) — detección en tiempo real       |
| Núcleo       | Rust (PyO3) — decodificación de frames y scheduling |
| IPC          | Iceoryx + Shared Memory — transporte zero-copy      |
| Orquestación | Hydra + Pydantic — configuración jerárquica         |

---

## El reto de arquitectura

El desafío central es mover un tensor de video de ~6 MB por frame a través de múltiples procesos
de inferencia sin copiarlo. El GIL de Python bloquea el paralelismo real entre hilos, y hacer
inferencia en el hilo de UI de Qt lo congelaría.

La solución combina Multiprocessing (para romper el GIL), Shared Memory (para eliminar copias),
Iceoryx (para metadatos de ultra-baja latencia) y un núcleo Rust que opera completamente fuera
del GIL. El resultado: pipeline determinista de cámara a UI en producción.

[Leer architecture_overview en el showcase](https://github.com/Bajmein/vigilia-edge-showcase/blob/main/architecture_overview.md){ .md-button }
[Ver repositorio vitrina en GitHub](https://github.com/Bajmein/vigilia-edge-showcase){ .md-button .md-button--primary }
