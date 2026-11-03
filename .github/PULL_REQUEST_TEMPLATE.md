<!--
NOTAS PARA EL ALUMNO
- Un PR = una historia de usuario. Título con formato Conventional Commits.
- Destino: `develop` (los PR `feature/*` -> `main` están prohibidos; `main` solo
  recibe el PR de cierre de hito desde `develop`).
- `Closes #N` cierra el issue al fusionar, pero GitHub solo lo aplica si el PR
  entra en la RAMA POR DEFECTO del repo. Si tu rama por defecto es `main`,
  mueve la tarjeta a `Done` a mano (o establece `develop` como rama por defecto).
-->

## Resumen

<!-- Qué cambia y por qué, en 2-4 líneas. -->

Closes #

## Cambios principales

-

## Cómo probarlo

<!-- Pasos o petición de ejemplo y resultado esperado (código HTTP incluido). -->

## Checklist

- [ ] La rama sale de `develop` y el PR apunta a `develop`.
- [ ] Commits en formato Conventional Commits.
- [ ] Cumple los criterios de aceptación del issue.
- [ ] Sin secretos ni ficheros `.env` (`git diff --staged` revisado).
- [ ] `.env.example` y documentación actualizados si he añadido variables o endpoints.
- [ ] No hay SQL ni lógica de negocio en rutas o controladores.
