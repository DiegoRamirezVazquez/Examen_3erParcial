
const {
    obtenerSesion
} = require("../services/sessionService");

const {
    descifrarToken
} = require("../services/cryptoService");

const verificarToken = async (req, res, next) => {
    try {
        const sessionId = req.cookies?.app_session;

        if (!sessionId) {
            return res.status(401).json({
                success: false,
                message: "No hay una sesión activa. Inicia sesión."
            });
        }

        const sesion = await obtenerSesion(sessionId);

        if (!sesion) {
            res.clearCookie("app_session", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/"
            });

            return res.status(401).json({
                success: false,
                message: "La sesión ha expirado. Inicia sesión nuevamente."
            });
        }

        // El JWT se descifra exclusivamente en el backend.
        const token = descifrarToken(sesion.encrypted_token);

        req.token = token;
        req.userId = sesion.user_id;
        req.sessionId = sessionId;

        next();

    } catch (error) {
        console.error("Error al verificar sesión:", error.message);

        return res.status(500).json({
            success: false,
            message: "No fue posible verificar la sesión."
        });
    }
};

module.exports = { verificarToken };
