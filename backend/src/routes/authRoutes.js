const express = require("express");
const router = express.Router();

const {
    doubleCsrfProtection
} = require("../middlewares/csrfMiddleware");

const {
    verificarToken
} = require("../middlewares/authMiddleware");

const {
    login,
    logout,
    me,
    obtenerTokenCSRF
} = require("../controllers/authController");

// Obtener token CSRF
router.get("/csrf", obtenerTokenCSRF);

// Iniciar sesión
router.post("/login", doubleCsrfProtection, login);

// Cerrar sesión
router.post("/logout", doubleCsrfProtection, logout);

// Consultar perfil con sesión válida
router.get("/me", verificarToken, me);

module.exports = router;
