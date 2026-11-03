---
name: Historia de usuario
about: Plantilla estándar para una historia de usuario del backlog
title: "[HU-XX] Verbo en infinitivo + objeto"
labels: user-story
assignees: ''
---

<!--
NOTAS PARA EL ALUMNO (borra estos comentarios en tus issues)
- Una historia describe QUÉ necesita una persona, no CÓMO se programa.
- "Como" debe ser un rol REAL de tu matriz RBAC (Público, Usuario, Admin...).
  "Como desarrollador..." es una tarea técnica, no una historia.
- Los criterios de aceptación son específicos de ESTA historia. La Definition of
  Done (DoD) es común a TODAS. La historia pasa a `Done` cuando cumple las dos.
- Cada criterio debe poder convertirse directamente en una prueba (Postman,
  test automático): resultado observable, binario, con errores y permisos.
-->

## Historia de usuario

**Como** [rol: Administrador | Mecánico | Cliente | Público]
**quiero** [acción o funcionalidad que realiza esa persona en el sistema]
**para** [beneficio o valor de negocio que justifica construirla].

## Trazabilidad

- Caso de uso del anteproyecto: `CU-XX`
- Entidades implicadas (según `docs/der.md`): <!-- p. ej. cita, vehiculo -->
- Dependencias con otras historias: <!-- #issue -->

## Criterios de aceptación (de esta historia, mínimo 3)

- [ ] **Camino feliz.** Dado [contexto], cuando [acción del rol], entonces [resultado observable: código HTTP y dato resultante].
- [ ] **Dato inválido.** Dado [dato inválido], cuando [acción], entonces [error concreto: código HTTP y mensaje por campo].
- [ ] **Permisos.** Solo el rol [X] puede [acción]; sin token recibe `401` y con otro rol, `403`.

## Condiciones técnicas obligatorias

- [ ] **Validación en servidor** de todos los campos de entrada (validar en el frontend no basta).
- [ ] **Códigos HTTP** conformes a `docs/contrato_api_rest.md` (200/201/204/400/401/403/404/409/422/500).
- [ ] Errores 4xx/5xx en formato **RFC 9457**; el 500 sin trazas ni SQL.
- [ ] **Passwords con hash** bcrypt (coste ≥ 10) o argon2id; nunca en texto plano ni en respuestas.
- [ ] Endpoint protegido con `authGuard` y `roleGuard` si no es público; titularidad del recurso comprobada en el servicio.
- [ ] Sin secretos en el código: configuración vía variables de entorno y `.env.example` actualizado.

## Definition of Done (común a todas las historias)

- [ ] Rama `feature/hu-XX-<verbo-objeto>` creada desde `develop`.
- [ ] Commits siguiendo Conventional Commits.
- [ ] Pull Request hacia `develop` con `Closes #<este issue>`.
- [ ] Documentación actualizada (README, `docs/`, OpenAPI/Postman) si procede.
- [ ] Prueba añadida o actualizada para cada criterio de aceptación.

## Etiquetas, milestone y estimación

- Etiquetas: <!-- backend | frontend | database | devops -->
- Milestone: <!-- Hito 2 | Hito 3 -->
- Puntos de historia: <!-- 1 | 2 | 3 | 5 | 8 -->
