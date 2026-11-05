
const { obtenerEstudianteSII } = require("../services/siiService");
const { manejarErrorSII } = require("../utils/sessionHandler");

const obtenerEstudiante = async (req, res) => {
    try {
        // El middleware obtiene el JWT desde la sesión privada.
        const estudiante = await obtenerEstudianteSII(req.token);

        return res.status(200).json({
            success: true,
            data: estudiante
        });

    } catch (error) {
        console.error("Error al consultar estudiante:", error.message);

        return manejarErrorSII(error, res, req.sessionId);
    }
};

module.exports = { obtenerEstudiante };
