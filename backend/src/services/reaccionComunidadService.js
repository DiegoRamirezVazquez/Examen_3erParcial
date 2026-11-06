const communityPool = require("../config/communityDatabase");

// Agregar una reacción
const agregarReaccion = async ({ publicacionId, userId }) => {
    const resultado = await communityPool.query(
        `
        INSERT INTO public.reacciones (
            publicacion_id,
            user_id
        )
        VALUES ($1, $2)
        ON CONFLICT (publicacion_id, user_id)
        DO NOTHING
        RETURNING *
        `,
        [publicacionId, userId]
    );

    return resultado.rows[0] || null;
};

// Quitar una reacción
const quitarReaccion = async ({ publicacionId, userId }) => {
    const resultado = await communityPool.query(
        `
        DELETE FROM public.reacciones
        WHERE publicacion_id = $1
          AND user_id = $2
        RETURNING *
        `,
        [publicacionId, userId]
    );

    return resultado.rows[0] || null;
};

module.exports = {
    agregarReaccion,
    quitarReaccion
};