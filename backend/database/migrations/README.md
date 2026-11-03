# Migraciones

Una migración = un cambio de esquema **versionado y reproducible**, escrito en código (Knex, Prisma, Sequelize, Eloquent…). El esquema debe derivarse de `docs/der.md`.

| Prohibido (rúbrica Hito 2)                              | Obligatorio                                              |
|---------------------------------------------------------|----------------------------------------------------------|
| Volcados `.sql` sueltos, phpMyAdmin, comandos manuales   | Migraciones del ORM / query builder                      |
| Esquema que solo funciona en tu máquina                  | Reconstrucción total con **un comando**: `npm run db:reset` |

`git ls-files '*.sql'` debe devolver **cero** resultados: es una de las comprobaciones del profesor.

## Comandos

```bash
npm run db:migrate   # aplica las migraciones pendientes
npm run db:rollback  # deshace todas
npm run db:reset     # rollback + migrate + seed: reconstrucción desde cero
```

## Qué debe contener tu esquema

- Claves foráneas con integridad explícita, justificando `CASCADE` (solo detalles subordinados) frente a `RESTRICT`.
- Restricciones `UNIQUE` (emails, códigos, matrículas) y `CHECK` (importes positivos, enumerados).
- Un archivo por cambio lógico, con prefijo de fecha para fijar el orden, y su `down` correspondiente.

El archivo `20261103000001_create_rol_usuario.js` es el único ejemplo resuelto; el resto de tu modelo lo escribes tú.
