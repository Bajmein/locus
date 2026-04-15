---
title: "Vigilia Edge — Desktop v1.0"
description: >
  Vigilia Edge es la versión Desktop de producción del sistema de vigilancia inteligente.
  Inferencia local con núcleo Rust, UI PySide6 y pipeline de video de alta performance.
---

# Vigilia Edge

**Sistema de vigilancia inteligente que corre completamente en local — sin nube, sin latencia de red.**

---

## ¿Qué hace?

Vigilancia local sin dependencia de nube, con latencia predecible y sin comprometer privacidad.

- Detecta y rastrea objetos en video en tiempo real mediante inferencia local (YOLOv11/v12)
  con backend acelerado seleccionable: TensorRT para máximo rendimiento o ONNX Runtime GPU
  como alternativa portable
- Renderiza overlays de detección en una UI nativa de escritorio PySide6 (Qt 6)
- Mueve frames de cámara a pantalla con baja latencia mediante un pipeline de alta performance
- Gestiona todo el procesamiento a través de un núcleo Rust compilado como extensión nativa

---

## Stack Técnico

| Capa           | Tecnología                                | Rol                                               | Estado        |
| -------------- | ----------------------------------------- | ------------------------------------------------- | ------------- |
| Interfaz       | PySide6 + OpenGL                          | UI nativa + renderizado GPU de video              |               |
| Inferencia     | YOLOv11/v12 · TensorRT + ONNX Runtime GPU | Detección con backend acelerado seleccionable     | **Expandido** |
| Cognición      | Rust (PyO3) + nalgebra                    | Multi-tracker, Kalman, geometría computacional    | **Expandido** |
| Captura        | VPF + NVIDIA Direct Capture               | Captura GPU-acelerada                             | **Nuevo**     |
| Observabilidad | Prometheus + Loguru                       | Métricas de producción + logging estructurado     | **Nuevo**     |
| Configuración  | Hydra + Pydantic V2                       | Config jerárquica con validación de schemas       |               |
| Respuesta      | Audio synthesis + Email/SMS               | Sistema activo de disuasión y notificación remota | **Nuevo**     |

---

## Sistema de respuesta activa

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
