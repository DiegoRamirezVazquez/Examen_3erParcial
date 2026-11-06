const express = require("express");
const router = express.Router();

const {
    verificarToken
} = require("../middlewares/authMiddleware");

const {
    doubleCsrfProtection
} = require("../middlewares/csrfMiddleware");

const {
    agregarReaccion,
    quitarReaccion
} = require("../controllers/reaccionComunidadController");

// Agregar Me gusta
router.post(
    "/:publicacionId",
    verificarToken,
    doubleCsrfProtection,
    agregarReaccion
);

// Quitar Me gusta
router.delete(
    "/:publicacionId",
    verificarToken,
    doubleCsrfProtection,
    quitarReaccion
);

module.exports = router;