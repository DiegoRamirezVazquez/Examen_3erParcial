const {
    loginSII,
    obtenerEstudianteSII
} = require("../services/siiService");

const {
    crearSesion,
    eliminarSesion,
    obtenerSesion
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

const {
    registrarActividad
} = require("../services/bitacoraService");

const {
    guardarPerfilComunidad
} = require("../services/perfilComunidadService");

const {
    guardarFotoPerfil
} = require("../services/fotoComunidadService");


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "El correo y la contraseña son obligatorios."
            });
        }

        const respuesta = await loginSII(email, password);
        const token = respuesta?.message?.login?.token;

        if (typeof token !== "string" || !token) {
            return res.status(502).json({
                success: false,
                message: "No se pudo obtener el token institucional."
            });
        }

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


        const userId =
            payload.sub ||
            payload.user_id ||
            payload.numero_control ||
            email;

        const encryptedToken = cifrarToken(token);

        const sesion = await crearSesion({
            userId: String(userId),
            encryptedToken,
            expiresAt: new Date(expiracion * 1000)
        });

        await registrarActividad({
            userId: String(userId),
            sessionDbId: sesion.sessionDbId,
            evento: "LOGIN",
            apartado: "Login",
            descripcion: "El estudiante inició sesión correctamente.",
            detalles: {
                resultado: "EXITOSO"
            }
        });

        const maxAge = sesion.expiresAt.getTime() - Date.now();

        res.cookie("app_session", sesion.sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
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

const logout = async (req, res) => {
    try {
        const sessionId = req.cookies?.app_session;

        if (sessionId) {
            // Recuperar los datos antes de eliminar la sesión
            const sesion = await obtenerSesion(sessionId);

            if (sesion) {
                await registrarActividad({
                    userId: sesion.user_id,
                    sessionDbId: sesion.id,
                    evento: "LOGOUT",
                    apartado: "Login",
                    descripcion: "El estudiante cerró su sesión.",
                    detalles: {
                        resultado: "EXITOSO"
                    }
                });
            }

            await eliminarSesion(sessionId);
        }

        limpiarCookie(res);

        res.clearCookie("csrf_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
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


const me = async (req, res) => {
    try {
        const estudiante = await obtenerEstudianteSII(req.token);

        // Obtener los datos reales del estudiante
        const datosEstudiante = estudiante?.data;

        if (
            datosEstudiante?.persona &&
            datosEstudiante?.numero_control
        ) {
            let fotoUrl = null;

            const perfilActual = await guardarPerfilComunidad({
                userId: String(req.userId),
                nombre: String(datosEstudiante.persona).trim(),
                matricula: String(datosEstudiante.numero_control).trim()
            });

            // Subir fotografía solamente si todavía no existe
            if (!perfilActual.foto_url && datosEstudiante.foto) {
                fotoUrl = await guardarFotoPerfil({
                    userId: String(req.userId),
                    fotoBase64: datosEstudiante.foto
                });

                await guardarPerfilComunidad({
                    userId: String(req.userId),
                    nombre: String(datosEstudiante.persona).trim(),
                    matricula: String(datosEstudiante.numero_control).trim(),
                    fotoUrl
                });
            }

            console.log("Perfil de comunidad guardado:", perfilActual.user_id);
        } else {
            console.error("El SII no devolvió los datos necesarios para el perfil.");
        }

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
