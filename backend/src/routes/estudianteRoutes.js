const express = require("express");
const router = express.Router();

const { verificarToken } = require("../middlewares/authMiddleware");
const { obtenerEstudiante } = require("../controllers/estudianteController");

router.get("/", verificarToken, obtenerEstudiante);

module.exports = router;