const {
    obtenerComentarios: consultarComentarios,
    crearComentario: guardarComentario,
    eliminarComentario: borrarComentario
} = require("../services/comentarioComunidadService");

// Consultar comentarios
const obtenerComentarios = async (req, res) => {
    try {
        const { publicacionId } = req.params;

        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(publicacionId)) {
            return res.status(400).json({
                success: false,
                message: "El identificador de la publicación no es válido."
            });
        }

        const comentarios = await consultarComentarios(publicacionId, req.userId);

        return res.status(200).json({
            success: true,
            data: comentarios
        });

    } catch (error) {
        console.error("Error al consultar comentarios:", error.message);

        return res.status(500).json({
            success: false,
            message: "No fue posible consultar los comentarios."
        });
    }
};

// Crear comentario
const crearComentario = async (req, res) => {
    try {
        const { publicacionId } = req.params;
        const { contenido } = req.body;

        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(publicacionId)) {
            return res.status(400).json({
                success: false,
                message: "El identificador de la publicación no es válido."
            });
        }

        if (
            typeof contenido !== "string" ||
            !contenido.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "El comentario no puede estar vacío."
            });
        }

        if (contenido.trim().length > 2000) {
            return res.status(400).json({
                success: false,
                message: "El comentario no puede superar los 2000 caracteres."
            });
        }

        const comentario = await guardarComentario({
            publicacionId,
            userId: req.userId,
            contenido: contenido.trim()
        });

        return res.status(201).json({
            success: true,
            message: "Comentario creado correctamente.",
            data: comentario
        });

    } catch (error) {
        console.error("Error al crear comentario:", error.message);

        return res.status(500).json({
            success: false,
            message: "No fue posible crear el comentario."
        });
    }
};

// Eliminar comentario propio
const eliminarComentario = async (req, res) => {
    try {
        const { comentarioId } = req.params;

        if (
            !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(comentarioId)
        ) {
            return res.status(400).json({
                success: false,
                message: "El identificador del comentario no es válido."
            });
        }

        const comentario = await borrarComentario({
            comentarioId,
            userId: req.userId
        });

        if (!comentario) {
            return res.status(404).json({
                success: false,
                message: "El comentario no existe o no tienes permiso para eliminarlo."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Comentario eliminado correctamente.",
            data: comentario
        });

    } catch (error) {
        console.error("Error al eliminar comentario:", error.message);

        return res.status(500).json({
            success: false,
            message: "No fue posible eliminar el comentario."
        });
    }
};

module.exports = {
    obtenerComentarios,
    crearComentario,
    eliminarComentario
};