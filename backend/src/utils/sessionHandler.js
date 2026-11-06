
const {
    eliminarSesion
} = require("../services/sessionService");

const limpiarCookie = (res) => {
    res.clearCookie("app_session", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/"
    });
};

const manejarErrorSII = async (error, res, sessionId) => {

    // Token institucional inválido o sesión vencida
    if (error.response?.status === 401) {

        // Eliminar la sesión de Supabase
        if (sessionId) {
            try {
                await eliminarSesion(sessionId);
            } catch (sessionError) {
                console.error(
                    "Error al eliminar sesión:",
                    sessionError.message
                );
            }
        }

        limpiarCookie(res);

        return res.status(401).json({
            success: false,
            code: "SESSION_EXPIRED",
            message: "Tu sesión ha vencido o no es válida. Inicia sesión nuevamente."
        });
    }

    if (error.response?.status === 403) {
        return res.status(403).json({
            success: false,
            code: "FORBIDDEN",
            message: "No tienes permisos para realizar esta consulta."
        });
    }

    if (error.code === "ECONNABORTED") {
        return res.status(504).json({
            success: false,
            message: "El servidor institucional tardó demasiado en responder."
        });
    }

    return res.status(503).json({
        success: false,
        message: "No fue posible comunicarse con el servidor institucional."
    });
};

module.exports = {
    limpiarCookie,
    manejarErrorSII
};
