
const {
    obtenerPublicaciones: consultarPublicaciones,
    crearPublicacion: guardarPublicacion
} = require("../services/comunidadService");

// Consultar publicaciones
const obtenerPublicaciones = async (req, res) => {
    try {
        const publicaciones = await consultarPublicaciones(req.userId);

        return res.status(200).json({
            success: true,
            data: publicaciones
        });

    } catch (error) {
        console.error("Error al consultar publicaciones:", error.message);

        return res.status(500).json({
            success: false,
            message: "No fue posible consultar las publicaciones."
        });
    }
};

// Crear publicación
const crearPublicacion = async (req, res) => {
    try {
        const { contenido, categoria } = req.body;

        if (!contenido || typeof contenido !== "string" || !contenido.trim()) {
            return res.status(400).json({
                success: false,
                message: "El contenido de la publicación es obligatorio."
            });
        }

        if (contenido.trim().length > 5000) {
            return res.status(400).json({
                success: false,
                message: "La publicación no puede superar los 5000 caracteres."
            });
        }

        const categoriasPermitidas = [
            "General",
            "Dudas académicas",
            "Proyectos",
            "Material de estudio",
            "Avisos",
            "Eventos"
        ];

        const categoriaFinal = categoria || "General";

        if (!categoriasPermitidas.includes(categoriaFinal)) {
            return res.status(400).json({
                success: false,
                message: "La categoría seleccionada no es válida."
            });
        }

        const publicacion = await guardarPublicacion({
            userId: req.userId,
            contenido: contenido.trim(),
            categoria: categoriaFinal
        });

        return res.status(201).json({
            success: true,
            message: "Publicación creada correctamente.",
            data: publicacion
        });

    } catch (error) {
        console.error("Error al crear publicación:", error.message);

        return res.status(500).json({
            success: false,
            message: "No fue posible crear la publicación."
        });
    }
};

module.exports = {
    obtenerPublicaciones,
    crearPublicacion
};
