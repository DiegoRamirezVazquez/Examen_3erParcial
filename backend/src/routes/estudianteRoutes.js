const express = require("express");
const router = express.Router();

const { verificarToken } = require("../middlewares/authMiddleware");

const {
    obtenerEstudiante,
    obtenerCalificaciones,
    obtenerKardex,
    obtenerHorarios
} = require("../controllers/estudianteController");

// Información del estudiante
router.get("/", verificarToken, obtenerEstudiante);

// Calificaciones
router.get("/calificaciones", verificarToken, obtenerCalificaciones);

// Kardex
router.get("/kardex", verificarToken, obtenerKardex);

// Horarios
router.get("/horarios", verificarToken, obtenerHorarios);

module.exports = router;