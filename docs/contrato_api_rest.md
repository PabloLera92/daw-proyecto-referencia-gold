# Contrato de API REST — GesTaller

Base URL: `/api/v1` · Formato: `application/json; charset=utf-8` · Autenticación: `Authorization: Bearer <JWT>`.

## 1. Formato estándar de respuesta

**Toda** respuesta del servidor, éxito o error, respeta esta envoltura:

| Campo     | Tipo                    | Descripción                                                                    |
|-----------|-------------------------|--------------------------------------------------------------------------------|
| `success` | boolean                 | `true` si la operación se completó; `false` en cualquier error.                |
| `data`    | objeto \| array \| null | Recurso(s) devuelto(s). `null` si no hay contenido o hay error.                |
| `message` | string                  | Mensaje legible y breve. Nunca contiene trazas internas ni SQL.                |
| `errors`  | array                   | Lista de errores (vacía en éxito). Cada elemento: `{ "field": string, "message": string }`. |

Reglas:

1. Los cuatro campos están **siempre** presentes (contrato estable para el frontend).
2. El código HTTP expresa el resultado; `success` es su reflejo para el cliente.
3. En producción, un 500 jamás expone `stack`, consultas ni rutas del servidor.

## 2. Códigos de estado HTTP obligatorios

| Código | Nombre                 | Cuándo usarlo                                                                                     |
|:------:|------------------------|---------------------------------------------------------------------------------------------------|
| 200    | OK                     | Lectura o actualización correcta (`GET`, `PUT`, `PATCH`).                                         |
| 201    | Created                | Recurso creado (`POST`). Incluye el recurso en `data` y cabecera `Location`.                      |
| 400    | Bad Request            | Petición malformada: JSON inválido, parámetro de ruta con formato incorrecto.                     |
| 401    | Unauthorized           | Falta el token, es inválido/caducado o las credenciales de login son erróneas (**no autenticado**). |
| 403    | Forbidden              | Token válido pero el rol no tiene permiso (**autenticado, no autorizado**).                       |
| 404    | Not Found              | El recurso o la ruta no existe (o no es visible para ese usuario).                                |
| 422    | Unprocessable Entity   | JSON bien formado pero que incumple reglas de validación (campo obligatorio ausente, email inválido, valor fuera de rango). |
| 500    | Internal Server Error  | Fallo inesperado del servidor. Mensaje genérico; el detalle va solo al log.                       |

**Criterio 400 vs 422:** 400 = no se puede ni interpretar la petición; 422 = se interpreta, pero los datos no son válidos para el negocio.
**Criterio 401 vs 403:** 401 = «no sé quién eres»; 403 = «sé quién eres y no puedes».

## 3. Ejemplos de payload

### 3.1 Login (JWT) — `POST /api/v1/auth/login`

Petición:

```json
{
  "email": "mecanico@gestaller.example",
  "password": "Dummy#Pass2026"
}
```

Respuesta `200 OK`:

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.<payload>.<signature>",
    "tokenType": "Bearer",
    "expiresIn": "1h",
    "user": { "id": 7, "nombre": "Marta Taller", "email": "mecanico@gestaller.example", "rol": "MECANICO" }
  },
  "message": "Login correcto",
  "errors": []
}
```

Credenciales erróneas → `401 Unauthorized` (mismo mensaje para email inexistente y contraseña errónea, para no revelar qué cuentas existen):

```json
{ "success": false, "data": null, "message": "Credenciales inválidas", "errors": [] }
```

### 3.2 Creación de recurso — `POST /api/v1/citas`

Cabecera: `Authorization: Bearer <token>`

```json
{
  "vehiculoId": 12,
  "fechaHora": "2026-12-03T09:30:00Z",
  "motivo": "Ruido en el tren delantero"
}
```

Respuesta `201 Created`:

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
  "message": "Cita creada correctamente",
  "errors": []
}
```

### 3.3 Fallo de validación — `POST /api/v1/auth/register` sin email

Petición:

```json
{ "nombre": "Ana Cliente", "password": "abc" }
```

Respuesta `422 Unprocessable Entity`:

```json
{
  "success": false,
  "data": null,
  "message": "Error de validación",
  "errors": [
    { "field": "email", "message": "El email es obligatorio" },
    { "field": "password", "message": "La contraseña debe tener al menos 8 caracteres" }
  ]
}
```

## 4. Convenciones adicionales

- Rutas en plural y minúsculas: `/citas`, `/ordenes`, `/vehiculos`.
- Verbos HTTP semánticos: `GET` lee, `POST` crea, `PUT/PATCH` modifica, `DELETE` elimina.
- Fechas en ISO 8601 UTC. Importes como número con dos decimales.
- Las contraseñas nunca se devuelven en ninguna respuesta (ni siquiera el hash).
