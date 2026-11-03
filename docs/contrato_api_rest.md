# Contrato de API REST — GesTaller

Base URL: `/api/v1` · Formato: `application/json; charset=utf-8` · Autenticación: cabecera `Authorization: Bearer <token>`.

> **Cómo usar este documento.** El contrato se escribe **antes** que el código: es el acuerdo entre backend y frontend sobre qué se envía y qué se devuelve. Aquí se fijan los formatos y los códigos HTTP que el Hito 2 audita (200, 201, 204, 400, 401, 403, 404, 409, 422 y 500). Adapta los recursos a tu dominio; el **criterio** de cada código es el que debes aplicar.

## 1. Formato de las respuestas

### 1.1. Éxito (2xx)

```json
{ "success": true, "data": { }, "message": "Descripción breve" }
```

| Campo     | Tipo                    | Descripción                                                           |
|-----------|-------------------------|-----------------------------------------------------------------------|
| `success` | boolean                 | `true` en toda respuesta 2xx con cuerpo.                              |
| `data`    | objeto \| array         | Recurso(s) devuelto(s).                                               |
| `message` | string                  | Mensaje legible y breve.                                              |

Un `204 No Content` **no lleva cuerpo**.

### 1.2. Error (4xx y 5xx): estándar RFC 9457

Toda respuesta de error sigue la estructura *Problem Details for HTTP APIs* (RFC 9457) con `Content-Type: application/problem+json`. Es lo que audita la rúbrica del Hito 2 y lo que consume el frontend del Hito 3 para pintar el error bajo cada campo.

| Campo       | Tipo    | Obligatorio | Descripción                                                                  |
|-------------|---------|:-----------:|------------------------------------------------------------------------------|
| `type`      | URI     | Sí          | Identifica la **clase** de error (`.../errors/validation-failed`).           |
| `title`     | string  | Sí          | Resumen corto y estable del tipo de error.                                   |
| `status`    | integer | Sí          | Mismo código HTTP de la respuesta.                                           |
| `detail`    | string  | Sí          | Explicación de **esta** ocurrencia, legible para una persona.                |
| `instance`  | string  | Sí          | Ruta de la petición que falló.                                               |
| `timestamp` | string  | Sí          | Fecha ISO 8601 UTC del error.                                                |
| `errors`    | array   | Solo 422/400 | Extensión: `[{ "field": string, "message": string }]` por campo inválido.   |

Reglas:

1. El **éxito** y el **error** se distinguen por el código HTTP (2xx frente a 4xx/5xx), no solo por el cuerpo.
2. Un 500 **jamás** expone `stack`, consultas SQL ni rutas internas: el detalle va al log del servidor (`console.error`, `winston` o `pino`) y al cliente solo llega un mensaje genérico.
3. Las contraseñas y sus hashes **nunca** aparecen en ninguna respuesta.

## 2. Errores del cliente (4xx) frente a fallos del servidor (5xx)

| Aspecto                    | 4xx — error del **cliente**                              | 5xx — fallo del **servidor**                              |
|----------------------------|----------------------------------------------------------|-----------------------------------------------------------|
| ¿De quién es la «culpa»?   | De la petición: datos erróneos, sin permiso, recurso inexistente | Del servidor: BD caída, excepción no controlada, bug |
| ¿Reintentar igual ayuda?   | **No**: el cliente debe corregir la petición             | **Quizá**: el problema puede ser transitorio              |
| ¿Qué se muestra al usuario?| Mensaje concreto y accionable («El email es obligatorio»)| Mensaje genérico («Ocurrió una anomalía inesperada»)      |
| ¿Qué se registra en el log?| Normalmente nada o un `warn`                             | **Siempre** el error completo (`console.error`) con traza |
| ¿Quién debe actuar?        | El usuario / el frontend                                 | El equipo de desarrollo                                   |
| Detalle expuesto           | Sí, es seguro y útil                                     | **No**: revelaría información explotable                  |

**Regla práctica:** si el servidor devuelve un 500 porque el cliente envió un campo vacío, hay un **bug de validación**: debía ser un 422. Un 5xx provocado por la entrada del usuario es un fallo de diseño.

## 3. Códigos de estado HTTP obligatorios

| Código | Nombre                 | Cuándo usarlo                                                                                     |
|:------:|------------------------|---------------------------------------------------------------------------------------------------|
| 200    | OK                     | Lectura o actualización correcta (`GET`, `PUT`, `PATCH`) con cuerpo.                              |
| 201    | Created                | Recurso creado (`POST`). Devuelve el recurso en `data` y la cabecera `Location`.                  |
| 204    | No Content             | Operación correcta **sin cuerpo** (típicamente `DELETE`).                                         |
| 400    | Bad Request            | Petición **malformada**: JSON inválido, parámetro de ruta con formato incorrecto (`/citas/abc`).  |
| 401    | Unauthorized           | Falta el token, es inválido o está caducado, o el login falla. **No autenticado.**                |
| 403    | Forbidden              | Token válido pero el rol no tiene permiso, o el recurso es de otro usuario. **No autorizado.**    |
| 404    | Not Found              | El recurso o la ruta no existe (o se oculta deliberadamente al usuario).                          |
| 409    | Conflict               | Choca con el estado actual: email ya registrado, franja de cita ya ocupada.                       |
| 422    | Unprocessable Entity   | JSON bien formado pero que incumple reglas de validación (campo ausente, email inválido, valor fuera de rango). |
| 500    | Internal Server Error  | Fallo inesperado. Mensaje genérico; el detalle solo en el log.                                    |

**Criterios que se confunden**

- **400 frente a 422:** 400 = ni siquiera se puede interpretar la petición; 422 = se interpreta, pero los **datos** no son válidos para el negocio.
- **401 frente a 403:** 401 = «no sé quién eres»; 403 = «sé quién eres y no puedes».
- **403 frente a 404 (recurso ajeno):** ambos son válidos (Hito 2, 2.4). 404 evita revelar que el recurso existe (*enumeración*); lo importante es elegir uno y ser coherente.
- **409 frente a 422:** 422 = el dato es inválido por sí mismo; 409 = el dato es válido pero **choca** con algo que ya existe.

## 4. Ejemplos de payload

### 4.1. Login (JWT) — `POST /api/v1/auth/login` → `200 OK`

Petición:

```json
{
  "email": "mecanico@gestaller.example",
  "password": "Dummy#Pass2026"
}
```

Respuesta:

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.<payload>.<signature>",
    "tokenType": "Bearer",
    "expiresIn": "1h",
    "user": { "id": 7, "nombre": "Marta Taller", "email": "mecanico@gestaller.example", "rol": "MECANICO" }
  },
  "message": "Login correcto"
}
```

Cuando el token existe, el cliente lo envía en **todas** las peticiones protegidas:

```http
GET /api/v1/citas HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.<payload>.<signature>
```

Credenciales erróneas → `401`. **El mismo mensaje** para email inexistente y contraseña errónea, para no revelar qué cuentas existen (enumeración de usuarios):

```json
{
  "type": "https://api.gestaller.example/errors/invalid-credentials",
  "title": "Credenciales inválidas",
  "status": 401,
  "detail": "El email o la contraseña no son correctos.",
  "instance": "/api/v1/auth/login",
  "timestamp": "2026-11-15T18:42:10.120Z"
}
```

### 4.2. Creación de recurso — `POST /api/v1/citas` → `201 Created`

Petición (con cabecera `Authorization: Bearer <token>`):

```json
{
  "vehiculoId": 12,
  "fechaHora": "2026-12-03T09:30:00Z",
  "motivo": "Ruido en el tren delantero"
}
```

Respuesta:

```json
{
  "success": true,
  "data": {
    "id": 58,
    "vehiculoId": 12,
    "fechaHora": "2026-12-03T09:30:00Z",
    "estado": "PENDIENTE",
    "motivo": "Ruido en el tren delantero"
  },
  "message": "Cita creada correctamente"
}
```

### 4.3. Validación fallida — `POST /api/v1/auth/register` sin email → `422 Unprocessable Entity`

Petición:

```json
{ "nombre": "Ana Cliente", "password": "abc" }
```

Respuesta (`Content-Type: application/problem+json`):

```json
{
  "type": "https://api.gestaller.example/errors/validation-failed",
  "title": "Error de validación",
  "status": 422,
  "detail": "La petición contiene campos que incumplen las reglas de validación.",
  "instance": "/api/v1/auth/register",
  "timestamp": "2026-11-15T18:42:10.120Z",
  "errors": [
    { "field": "email", "message": "El email es obligatorio" },
    { "field": "password", "message": "La contraseña debe tener al menos 8 caracteres" }
  ]
}
```

El frontend recorre `errors[]` y pinta cada `message` **bajo el campo** indicado en `field` (requisito del Hito 3).

### 4.4. Conflicto — `POST /api/v1/citas` con la franja ocupada → `409 Conflict`

```json
{
  "type": "https://api.gestaller.example/errors/slot-taken",
  "title": "Franja no disponible",
  "status": 409,
  "detail": "Ya existe una cita confirmada para esa fecha y hora.",
  "instance": "/api/v1/citas",
  "timestamp": "2026-11-15T18:42:10.120Z"
}
```

### 4.5. Fallo del servidor — `500 Internal Server Error`

```json
{
  "type": "https://api.gestaller.example/errors/internal-error",
  "title": "Error interno del servidor",
  "status": 500,
  "detail": "Ocurrió una anomalía inesperada. Contacte con soporte técnico.",
  "instance": "/api/v1/citas",
  "timestamp": "2026-11-15T18:42:10.120Z"
}
```

Sin `stack`, sin SQL, sin rutas de archivos. Todo eso va a `console.error` en el servidor.

## 5. Protección de rutas: JWT y RBAC mediante middlewares

> **Idea clave:** la seguridad se declara **una vez** en la capa de rutas, con middlewares reutilizables. Los controladores no repiten ni conocen cómo se verifica un token. Y recuerda: ocultar un botón en el frontend **no es seguridad**; la autorización real vive siempre en el servidor.

Tres comprobaciones, **en este orden** y cada una con su código:

| # | Middleware / capa  | Pregunta                               | Si falla | Dónde vive                      |
|:-:|--------------------|----------------------------------------|:--------:|---------------------------------|
| 1 | `authGuard`        | ¿Quién eres? (token presente, firma y caducidad válidas) | **401** | `middlewares/jwt.middleware.js` |
| 2 | `roleGuard([...])` | ¿Tu rol permite esta ruta?             | **403**  | `middlewares/jwt.middleware.js` |
| 3 | Servicio           | ¿Este recurso es **tuyo**? (titularidad) | **403** o **404** | `services/*.service.js`  |

```js
// routes/ordenes.routes.js — la protección se lee de un vistazo
router.get('/',    authGuard, roleGuard(['ADMIN']),             ordenesController.listAll);
router.get('/:id', authGuard,                                   ordenesController.getById);   // titularidad en el servicio
router.patch('/:id/estado', authGuard, roleGuard(['ADMIN', 'MECANICO']), ordenesController.updateStatus);
```

- **`authGuard`** extrae el token de `Authorization: Bearer <token>`, comprueba firma y caducidad y deja la identidad en `req.user = { id, rol }`. Si algo falla, responde **401**.
- **`roleGuard(['ADMIN'])`** es parametrizable: compara `req.user.rol` con los roles permitidos. Si no coincide, responde **403**.
- **Titularidad (anti-BOLA/IDOR):** un middleware no sabe de quién es el recurso 58. Esa comprobación (`orden.cliente_id === req.user.id`) pertenece al **servicio**, que es quien consulta el recurso. Sin ella, cualquier cliente podría leer las órdenes de otro cambiando el número de la URL.
- **Orden importa:** `authGuard` siempre antes que `roleGuard`; si no hay identidad, no hay rol que evaluar.
- El token debe tener caducidad acotada (máximo **2 horas** en el Hito 2) y el secreto de firma vive solo en variables de entorno.

## 6. Convenciones adicionales

- Rutas en plural y minúsculas: `/citas`, `/ordenes`, `/vehiculos`.
- Verbos HTTP semánticos: `GET` lee, `POST` crea, `PUT/PATCH` modifica, `DELETE` elimina.
- Fechas en ISO 8601 UTC. Importes como número con dos decimales.
- Un endpoint público de salud (`GET /api/v1/health`) permite comprobar el despliegue.
- Las pruebas de este contrato (casos 200, 201, 401, 403, 404 y 422) se documentan en [`docs/api/`](api/README.md).
