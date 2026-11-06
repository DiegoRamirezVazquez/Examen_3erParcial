const pool = require("../config/database");

const registrarActividad = async ({
    userId = null,
    sessionDbId = null,
    evento,
    apartado = null,
    descripcion = null,
    detalles = {}
}) => {
    try {
        if (!evento) {
            throw new Error("El evento es obligatorio");
        }

        await pool.query(
            `INSERT INTO public.bitacora_actividad
            (user_id, session_id, evento, apartado, descripcion, detalles)
            VALUES ($1, $2, $3, $4, $5, $6)`,
            [
                userId,
                sessionDbId,
                evento,
                apartado,
                descripcion,
                JSON.stringify(detalles)
            ]
        );

        return true;

    } catch (error) {
        console.error(
            "Error al registrar actividad en bitácora:",
            error.message
        );

        return false;
    }
};

module.exports = { registrarActividad };