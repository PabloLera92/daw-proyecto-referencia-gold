'use strict';

const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const { verifyJwt } = require('../middlewares/jwt.middleware');

/**
 * CAPA 1 — RUTAS
 * Responsabilidad ÚNICA: mapear "verbo + URL" -> middlewares -> controlador.
 * Aquí no hay lógica, ni SQL, ni validación manual: solo cableado.
 * Leer este archivo debe darte el mapa de la API en 10 segundos.
 */
const router = Router();

router.post('/register', authController.register); // público
router.post('/login', authController.login);       // público
router.get('/me', verifyJwt, authController.me);    // protegido: requiere token válido

module.exports = router;
