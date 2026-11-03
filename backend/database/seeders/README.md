# Seeders

Datos de demostración **ficticios** cargados por código (nunca volcados `.sql`). Prohibido incluir datos personales reales (RGPD).

## Requisitos del Hito 2

| Requisito                                            | Mínimo                                                               |
|------------------------------------------------------|----------------------------------------------------------------------|
| Cuentas de demostración                              | 1 Administrador y 2 usuarios estándar independientes (para auditar la separación de datos entre usuarios) |
| Registros por entidad principal de negocio           | ≥ 10, coherentes entre sí                                            |
| Registros en la tabla intermedia de la M:N           | ≥ 5, con **variedad** en sus atributos propios (cantidades, descuentos, estados) |
| Idempotencia                                         | Ejecutarlo dos veces no duplica ni rompe nada                        |

## Buenas prácticas

- Contraseñas de demostración **ficticias**, que cumplan tu propia política (≥ 8 caracteres) y guardadas **hasheadas** (`bcrypt.hash` dentro del seeder), nunca en texto plano en la base de datos.
- El orden de los archivos (`001_`, `002_`…) debe respetar las dependencias entre tablas (primero catálogos, luego transacciones).
- Datos verosímiles de **tu** dominio: sirven para tus propias pruebas y para el profesor.

`001_roles.js` es el único ejemplo resuelto; el resto lo escribes tú. Todo se carga con `npm run db:reset`.
