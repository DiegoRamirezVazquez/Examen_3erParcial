const crypto = require("crypto");
const pool = require("../config/database");

const DURACION_SESION = 60 * 60 * 1000; // 1 hora

const generarSessionId = () => {
    return crypto.randomBytes(32).toString("base64url");
};

const generarHash = (sessionId) => {
    return crypto
        .createHash("sha256")
        .update(sessionId)
        .digest("hex");
};

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

    if (
        !Number.isFinite(expiracionSesion.getTime()) ||
        expiracionSesion <= new Date()
    ) {
        throw new Error("La sesión no tiene una expiración válida");
    }

    const resultado = await pool.query(
        `INSERT INTO public.sesiones
        (session_hash, user_id, encrypted_token, expires_at)
        VALUES ($1, $2, $3, $4)
        RETURNING id`,
        [sessionHash, userId, encryptedToken, expiracionSesion]
    );

    return {
        sessionId,
        sessionDbId: resultado.rows[0].id,
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
        `SELECT id, user_id, encrypted_token, expires_at
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
