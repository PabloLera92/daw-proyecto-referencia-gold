'use strict';

const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const { authGuard } = require('../middlewares/jwt.middleware');

/**
 * ============================================================================
 * CAPA 1 · RUTAS                                   (backend/src/routes/)
 * ============================================================================
 * RESPONSABILIDAD ÚNICA: asociar «verbo HTTP + URI» con los middlewares y el
 * método del controlador que la atiende. Nada más.
 *
 * Qué SÍ hace:
 *   - Declara el mapa de la API: leer este archivo debe darte, en 10 segundos,
 *     qué endpoints existen y quién puede llamarlos.
 *   - Encadena los middlewares de seguridad en orden:
 *         authGuard  ->  roleGuard([...])  ->  controlador
 *
 * Qué NO hace (si lo ves aquí, está mal ubicado):
 *   - ✗ SQL ni consultas al ORM.
 *   - ✗ Lógica de negocio ni cálculos.
 *   - ✗ Validación manual de campos (eso es del controlador o de un esquema).
 *
 * Pregunta de control: ¿puedo decir qué hace cada endpoint sin leer ninguna
 * línea de lógica? Si no, falta separar responsabilidades.
 * (Cuando tengas rutas privadas por rol, mira el ejemplo con roleGuard en
 *  docs/contrato_api_rest.md, apartado 5.)
 */
const router = Router();

router.post('/register', authController.register); // público
router.post('/login', authController.login);       // público
router.get('/me', authGuard, authController.me);    // privado: requiere token válido

module.exports = router;
