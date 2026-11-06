const express = require("express");
const router = express.Router();

const { verificarToken } = require("../middlewares/authMiddleware");
const { doubleCsrfProtection } = require("../middlewares/csrfMiddleware");

const {
    obtenerPublicaciones,
    crearPublicacion
} = require("../controllers/comunidadController");

// Consultar publicaciones
router.get("/", verificarToken, obtenerPublicaciones);

// Crear publicación
router.post("/", verificarToken, doubleCsrfProtection, crearPublicacion);

module.exports = router;
