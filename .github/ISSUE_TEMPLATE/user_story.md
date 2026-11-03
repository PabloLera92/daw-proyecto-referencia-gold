---
name: Historia de usuario
about: Plantilla estándar para una historia de usuario del backlog
title: "[HU-XX] Título corto en infinitivo"
labels: user-story
assignees: ''
---

## Historia de usuario

**Como** [rol: Administrador | Mecánico | Cliente]
**quiero** [acción o funcionalidad]
**para** [beneficio de negocio].

## Contexto / notas

<!-- Enlaces al DER, capturas, dependencias con otras historias (#issue) -->

## Criterios de aceptación (Definition of Done)

- [ ] Dado [contexto], cuando [acción], entonces [resultado esperado].
- [ ] Dado [contexto de error], cuando [acción], entonces [error esperado].
- [ ] Código integrado en `develop` mediante Pull Request enlazada a este issue (`Closes #N`).
- [ ] Commits siguiendo Conventional Commits.
- [ ] Documentación actualizada (README / `docs/`) si procede.

## Condiciones técnicas obligatorias

- [ ] **Validación en servidor** de todos los campos de entrada (no basta con validar en el frontend).
- [ ] **Códigos HTTP** conformes a `docs/contrato_api_rest.md` (200/201/400/401/403/404/422/500).
- [ ] Respuesta con la envoltura estándar `success / data / message / errors`.
- [ ] **Passwords con hash bcrypt**; nunca en texto plano ni devueltas en respuestas.
- [ ] Endpoint protegido con JWT y control de rol (RBAC) si no es público.
- [ ] Sin secretos en el código: configuración vía variables de entorno (`.env.example` actualizado).

## Estimación

Puntos de historia: <!-- 1 | 2 | 3 | 5 | 8 -->  ·  Sprint: <!-- 2 -->
