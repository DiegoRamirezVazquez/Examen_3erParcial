const {
    agregarReaccion: guardarReaccion,
    quitarReaccion: eliminarReaccion
} = require("../services/reaccionComunidadService");

// Validar identificador UUID
const esUUIDValido = (id) => {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
};

// Agregar reacción
const agregarReaccion = async (req, res) => {
    try {
        const { publicacionId } = req.params;

        if (!esUUIDValido(publicacionId)) {
            return res.status(400).json({
                success: false,
                message: "El identificador de la publicación no es válido."
            });
        }

        const reaccion = await guardarReaccion({
            publicacionId,
            userId: req.userId
        });

        return res.status(200).json({
            success: true,
            message: "Reacción registrada correctamente.",
            data: reaccion
        });

    } catch (error) {
        console.error("Error al agregar reacción:", error.message);

        return res.status(500).json({
            success: false,
            message: "No fue posible registrar la reacción."
        });
    }
};

// Quitar reacción
const quitarReaccion = async (req, res) => {
    try {
        const { publicacionId } = req.params;

        if (!esUUIDValido(publicacionId)) {
            return res.status(400).json({
                success: false,
                message: "El identificador de la publicación no es válido."
            });
        }

        await eliminarReaccion({
            publicacionId,
            userId: req.userId
        });

        return res.status(200).json({
            success: true,
            message: "Reacción eliminada correctamente."
        });

    } catch (error) {
        console.error("Error al quitar reacción:", error.message);

        return res.status(500).json({
            success: false,
            message: "No fue posible eliminar la reacción."
        });
    }
};

module.exports = {
    agregarReaccion,
    quitarReaccion
};