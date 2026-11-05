
const crypto = require("crypto");
const pool = require("../config/database");

const DURACION_SESION = 60 * 60 * 1000; // 1 hora

// Genera un identificador aleatorio para la cookie.
const generarSessionId = () => {
    return crypto.randomBytes(32).toString("base64url");
};

// Guarda únicamente el hash del identificador.
const generarHash = (sessionId) => {
    return crypto
        .createHash("sha256")
        .update(sessionId)
        .digest("hex");
};

// Crea una sesión en Supabase.
const crearSesion = async ({ userId, encryptedToken, expiresAt }) => {
    const sessionId = generarSessionId();
    const sessionHash = generarHash(sessionId);

    const expiracionJWT = new Date(expiresAt);
    const expiracionSesion = new Date(
        Math.min(
            expiracionJWT.getTime(),
            Date.now() + DURACION_SESION
        )
    );

    if (!Number.isFinite(expiracionSesion.getTime()) ||
        expiracionSesion <= new Date()) {
        throw new Error("La sesión no tiene una expiración válida");
    }

    await pool.query(
        `INSERT INTO public.sesiones
        (session_hash, user_id, encrypted_token, expires_at)
        VALUES ($1, $2, $3, $4)`,
        [sessionHash, userId, encryptedToken, expiracionSesion]
    );

    return {
        sessionId,
        expiresAt: expiracionSesion
    };
};

// Busca una sesión vigente.
const obtenerSesion = async (sessionId) => {
    if (!sessionId || typeof sessionId !== "string") {
        return null;
    }

    const sessionHash = generarHash(sessionId);

    const resultado = await pool.query(
        `SELECT user_id, encrypted_token, expires_at
         FROM public.sesiones
         WHERE session_hash = $1
         AND expires_at > NOW()
         LIMIT 1`,
        [sessionHash]
    );

    if (resultado.rowCount === 0) {
        return null;
    }

    await pool.query(
        `UPDATE public.sesiones
         SET last_activity_at = NOW()
         WHERE session_hash = $1`,
        [sessionHash]
    );

    return resultado.rows[0];
};

// Elimina una sesión.
const eliminarSesion = async (sessionId) => {
    if (!sessionId || typeof sessionId !== "string") {
        return;
    }

    const sessionHash = generarHash(sessionId);

    await pool.query(
        `DELETE FROM public.sesiones
         WHERE session_hash = $1`,
        [sessionHash]
    );
};

module.exports = {
    crearSesion,
    obtenerSesion,
    eliminarSesion
};
