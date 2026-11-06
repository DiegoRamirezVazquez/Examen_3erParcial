const express = require("express");
const router = express.Router();

const {
    verificarToken
} = require("../middlewares/authMiddleware");

const {
    doubleCsrfProtection
} = require("../middlewares/csrfMiddleware");

const {
    obtenerComentarios,
    crearComentario,
    eliminarComentario
} = require("../controllers/comentarioComunidadController");

// Consultar comentarios de una publicación
router.get(
    "/:publicacionId",
    verificarToken,
    obtenerComentarios
);

// Crear comentario
router.post(
    "/:publicacionId",
    verificarToken,
    doubleCsrfProtection,
    crearComentario
);

// Eliminar un comentario propio
router.delete(
    "/comentario/:comentarioId",
    verificarToken,
    doubleCsrfProtection,
    eliminarComentario
);

module.exports = router;
