const express = require("express");
const router = express.Router();

const { verificarToken } = require("../middlewares/authMiddleware");

const {
    obtenerEstudiante,
    obtenerCalificaciones,
    obtenerKardex,
    obtenerHorarios
} = require("../controllers/estudianteController");
router.get("/", verificarToken, obtenerEstudiante);
router.get("/calificaciones", verificarToken, obtenerCalificaciones);
router.get("/kardex", verificarToken, obtenerKardex);
router.get("/horarios", verificarToken, obtenerHorarios);

module.exports = router;