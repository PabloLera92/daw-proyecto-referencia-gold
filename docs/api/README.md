# Evidencias de pruebas de la API

El Hito 2 exige entregar en `docs/api/` **una** de estas dos opciones. Este repositorio de referencia muestra la Opción 2 en forma de esqueleto.

## Opción 1 — Colección Postman / Thunder Client / Bruno

- Archivo `docs/api/<proyecto>_api.postman_collection.json`.
- Carpetas por recurso (`Autenticación`, `Usuarios`, `Catálogo`, `Pedidos`…).
- Variables de entorno (`{{baseUrl}}`, `{{token}}`, `{{adminToken}}`): **nunca** escribas un token real en la colección exportada.
- Scripts de prueba con aserciones automáticas, por ejemplo `pm.response.to.have.status(201)`.

## Opción 2 — Especificación OpenAPI

- [`openapi.yaml`](openapi.yaml): esquema de seguridad `bearerAuth`, esquemas de petición y respuesta y el formato de error RFC 9457 (`ProblemDetails`). Se puede servir con Swagger UI en `/api/docs`.
- En este esqueleto solo está documentado el login, a modo de ejemplo. **Completar el resto de endpoints es parte de tu trabajo.**

## Casos de prueba mínimos por recurso

| Caso                                               | Código esperado |
|----------------------------------------------------|:---------------:|
| Operación correcta (lectura / creación)            | 200 / 201       |
| Petición sin token                                 | 401             |
| Token válido con rol sin permiso, o recurso ajeno  | 403             |
| Identificador inexistente                          | 404             |
| Payload semánticamente inválido                    | 422             |

Convierte cada **criterio de aceptación** de tus historias de usuario (Dado / Cuando / Entonces) en una de estas pruebas: si no puedes, el criterio no era comprobable.

## Capturas para el PDF de entrega

Creación con M:N (`201`), petición sin token (`401`), rol no autorizado o recurso ajeno (`403`) y error de validación (`422`) mostrando el JSON RFC 9457.
