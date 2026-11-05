
const {
    loginSII,
    obtenerEstudianteSII
} = require("../services/siiService");

const {
    crearSesion,
    eliminarSesion
} = require("../services/sessionService");

const {
    cifrarToken
} = require("../services/cryptoService");

const {
    limpiarCookie,
    manejarErrorSII
} = require("../utils/sessionHandler");

const {
    generateCsrfToken
} = require("../middlewares/csrfMiddleware");

// ==========================================
// INICIAR SESIÓN
// ==========================================

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "El correo y la contraseña son obligatorios."
            });
        }

        // 1. Consultar al SII desde el backend.
        const respuesta = await loginSII(email, password);
        const token = respuesta?.message?.login?.token;

        if (typeof token !== "string" || !token) {
            return res.status(502).json({
                success: false,
                message: "No se pudo obtener el token institucional."
            });
        }

        // 2. Leer la expiración del JWT.
        const partesToken = token.split(".");

        if (partesToken.length !== 3) {
            return res.status(502).json({
                success: false,
                message: "El SII devolvió un token con formato inválido."
            });
        }

        let payload;

        try {
            payload = JSON.parse(
                Buffer.from(partesToken[1], "base64url").toString()
            );
        } catch {
            return res.status(502).json({
                success: false,
                message: "No se pudo interpretar el token institucional."
            });
        }

        const expiracion = payload.exp;

        if (
            !expiracion ||
            expiracion <= Math.floor(Date.now() / 1000)
        ) {
            return res.status(502).json({
                success: false,
                message: "El token institucional no tiene una expiración válida."
            });
        }

        // 3. Identificar al estudiante.
        // Se utiliza el identificador del JWT cuando está disponible.
        const userId =
            payload.sub ||
            payload.user_id ||
            payload.numero_control ||
            email;

        // 4. Cifrar el JWT antes de almacenarlo.
        const encryptedToken = cifrarToken(token);

        // 5. Crear la sesión privada en Supabase.
        const sesion = await crearSesion({
            userId: String(userId),
            encryptedToken,
            expiresAt: new Date(expiracion * 1000)
        });

        // 6. Entregar únicamente el identificador de sesión.
        const maxAge = sesion.expiresAt.getTime() - Date.now();

        res.cookie("app_session", sesion.sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge
        });

        return res.status(200).json({
            success: true,
            message: "Autenticación exitosa."
        });

    } catch (error) {
        console.error("Error durante el inicio de sesión:", error.message);

        if (error.response) {
            return res.status(error.response.status).json({
                success: false,
                message: "El SII rechazó las credenciales o la solicitud."
            });
        }

        if (error.code === "ECONNABORTED") {
            return res.status(504).json({
                success: false,
                message: "Tiempo de espera agotado al consultar el SII."
            });
        }

        return res.status(500).json({
            success: false,
            message: "No fue posible completar el inicio de sesión."
        });
    }
};

// ==========================================
// CERRAR SESIÓN
// ==========================================

const logout = async (req, res) => {
    try {
        const sessionId = req.cookies?.app_session;

        if (sessionId) {
            await eliminarSesion(sessionId);
        }

        limpiarCookie(res);

        res.clearCookie("csrf_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/"
        });

        return res.status(200).json({
            success: true,
            message: "Sesión cerrada correctamente."
        });

    } catch (error) {
        console.error("Error al cerrar sesión:", error.message);

        return res.status(500).json({
            success: false,
            message: "No fue posible cerrar la sesión."
        });
    }
};

// ==========================================
// COMPROBAR SESIÓN Y OBTENER PERFIL
// ==========================================

const me = async (req, res) => {
    try {
        // El middleware recuperó y descifró el JWT.
        // El token permanece exclusivamente en el backend.
        const estudiante = await obtenerEstudianteSII(req.token);

        return res.status(200).json({
            success: true,
            message: "Sesión activa.",
            data: estudiante
        });

    } catch (error) {
        console.error(
            "Error al consultar el perfil:",
            error.message
        );

        return manejarErrorSII(error, res, req.sessionId);
    }
};

// ==========================================
// GENERAR TOKEN CSRF
// ==========================================

const obtenerTokenCSRF = (req, res) => {
    const csrfToken = generateCsrfToken(req, res);

    return res.status(200).json({
        success: true,
        csrfToken
    });
};

module.exports = {
    login,
    logout,
    me,
    obtenerTokenCSRF
};
