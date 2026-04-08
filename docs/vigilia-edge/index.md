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

- Detecta y rastrea objetos en video en tiempo real mediante inferencia local (YOLOv11/v12)
  con backend acelerado seleccionable: TensorRT para máximo rendimiento o ONNX Runtime GPU
  como alternativa portable
- Renderiza overlays de detección en una UI nativa de escritorio PySide6 (Qt 6)
- Mueve frames de cámara a pantalla en menos de 2 frames (~80ms a 25fps) mediante un pipeline zero-copy
- Gestiona todo el procesamiento a través de un núcleo Rust compilado como extensión nativa (PyO3)

---

## Arquitectura de Cuatro Capas

```text
┌─────────────────────────────────────────────────────────────┐
│  INTERACCIÓN — src/ui · src/audio · src/notifications       │
│  PySide6 + OpenGL · Audio disuasorio · Alertas Email/SMS   │
├─────────────────────────────────────────────────────────────┤
│  COGNICIÓN — vigilia_core (Rust / PyO3)                     │
│  Multi-tracker: BoT-SORT · Hybrid-SORT · ByteTrack          │
│  Kalman (nalgebra) · Geometría computacional · SAHI         │
├─────────────────────────────────────────────────────────────┤
│  PERCEPCIÓN — src/vision                                    │
│  YOLOv11/v12 · TensorRT + ONNX Runtime GPU · VPF · SAHI    │
├─────────────────────────────────────────────────────────────┤
│  INFRAESTRUCTURA — src/core                                 │
│  Shared Memory · Iceoryx IPC · Ring Buffers · Prometheus    │
│  Hydra + Pydantic V2 · Patrones RAII                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Stack Técnico

| Capa           | Tecnología                                      | Rol                                                | Estado        |
| -------------- | ----------------------------------------------- | -------------------------------------------------- | ------------- |
| Interfaz       | PySide6 + OpenGL                                | UI nativa + renderizado GPU de video               |               |
| Inferencia     | YOLOv11/v12 · TensorRT + ONNX Runtime GPU       | Detección con backend acelerado seleccionable      | **Expandido** |
| Cognición      | Rust (PyO3) + nalgebra                          | Multi-tracker, Kalman, geometría computacional, SAHI | **Expandido** |
| Captura        | VPF + NVIDIA Direct Capture                     | Captura GPU-acelerada sin round-trip a CPU         | **Nuevo**     |
| IPC            | Shared Memory + Iceoryx + Ring Buffers          | Transporte zero-copy con bus de metadatos dual     | **Expandido** |
| Observabilidad | Prometheus + Loguru                             | Métricas de producción + logging estructurado      | **Nuevo**     |
| Configuración  | Hydra + Pydantic V2                             | Config jerárquica con validación de schemas        |               |
| Respuesta      | Audio synthesis + Email/SMS                     | Sistema activo de disuasión y notificación remota  | **Nuevo**     |

---

## El reto de arquitectura

El desafío central es mover un tensor de video de ~6 MB por frame a través de múltiples procesos
de inferencia sin copiarlo. El GIL de Python bloquea el paralelismo real entre hilos, y hacer
inferencia en el hilo de UI de Qt lo congelaría.

La solución combina Multiprocessing (para romper el GIL), Shared Memory (para eliminar copias),
Iceoryx (para metadatos de ultra-baja latencia) y un núcleo Rust que opera completamente fuera
del GIL. El resultado: pipeline determinista de cámara a UI en producción.

### Por qué Rust — Python/Rust Hybrid Architecture

| Motivación                   | Detalle                                                                                                                                                 |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Bypass del GIL**           | El núcleo Rust (PyO3) corre en threads nativos sin el Global Interpreter Lock — paralelismo real entre el decoder de frames y los workers de inferencia |
| **Operaciones zero-copy**    | Los buffers de frames se asignan una sola vez en Shared Memory; Rust pasa punteros, nunca datos — eliminando el overhead de serialización               |
| **Rendimiento determinista** | Sin garbage collector ni GC pauses: la latencia de cámara a UI es predecible frame a frame (~80ms a 25fps)                                              |
| **Seguridad de memoria**     | El compilador de Rust garantiza en tiempo de compilación que no hay data races ni dangling pointers en el pipeline de video                             |
| **Multi-tracker configurable** | El núcleo Rust expone tres algoritmos de tracking (BoT-SORT, ByteTrack, Hybrid-SORT) seleccionables desde `config.yaml` sin recompilar — abstracción de alto rendimiento con zero overhead de despacho desde Python |
| **Geometría computacional sin GIL** | Las validaciones de zonas de intrusión y cruce de líneas usan cálculos IoU vectorizados en Rust con nalgebra — sin lock de intérprete en el hot path de análisis frame a frame |

### Sistema de respuesta activa

Vigilia Edge no es un visualizador pasivo. Cuando el motor de reglas confirma una amenaza,
el sistema activa dos mecanismos de respuesta:

- **Audio disuasorio**: síntesis y reproducción de alarmas sonoras para disuadir activamente
  al intruso en el momento de la detección.
- **Notificaciones remotas**: integración con Email y SMS para alertar al operador desde
  cualquier ubicación cuando la amenaza es confirmada.

!!! success "v1.0 — En producción"

    Esta versión v1.0 ya se encuentra totalmente operativa para despliegues en estaciones de trabajo locales.

[Leer architecture_overview en el showcase](https://github.com/Bajmein/vigilia-edge-showcase/blob/main/architecture_overview.md){ .md-button }
[Ver repositorio vitrina en GitHub](https://github.com/Bajmein/vigilia-edge-showcase){ .md-button .md-button--primary }
