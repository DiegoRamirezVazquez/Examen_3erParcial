const {
    obtenerEstudianteSII,
    obtenerCalificacionesSII,
    obtenerKardexSII,
    obtenerHorariosSII
} = require("../services/siiService");

const { manejarErrorSII } = require("../utils/sessionHandler");


const obtenerEstudiante = async (req, res) => {
    try {
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


const obtenerCalificaciones = async (req, res) => {
    try {
        const calificaciones = await obtenerCalificacionesSII(req.token);

        return res.status(200).json({
            success: true,
            data: calificaciones
        });

    } catch (error) {
        console.error("Error al consultar calificaciones:", error.message);
        return manejarErrorSII(error, res, req.sessionId);
    }
};

const obtenerKardex = async (req, res) => {
    try {
        const kardex = await obtenerKardexSII(req.token);

        return res.status(200).json({
            success: true,
            data: kardex
        });

    } catch (error) {
        console.error("Error al consultar Kardex:", error.message);
        return manejarErrorSII(error, res, req.sessionId);
    }
};

const obtenerHorarios = async (req, res) => {
    try {
        const horarios = await obtenerHorariosSII(req.token);

        return res.status(200).json({
            success: true,
            data: horarios
        });

    } catch (error) {
        console.error("Error al consultar horarios:", error.message);
        return manejarErrorSII(error, res, req.sessionId);
    }
};

module.exports = {
    obtenerEstudiante,
    obtenerCalificaciones,
    obtenerKardex,
    obtenerHorarios
};