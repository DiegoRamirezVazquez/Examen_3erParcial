const communityPool = require("../config/communityDatabase");
const { obtenerUrlFoto } = require("./fotoUrlService");

// Consultar comentarios de una publicación
const obtenerComentarios = async (publicacionId, userId) => {
    const resultado = await communityPool.query(
        `
        SELECT
            c.id,
            c.publicacion_id,
            c.user_id,
            c.contenido,
            c.fecha_creacion,
            COALESCE(p.nombre, 'Estudiante') AS nombre,
            (c.user_id = $2) AS es_autor,
            p.foto_url
        FROM public.comentarios c
        LEFT JOIN public.perfiles p
            ON p.user_id = c.user_id
        WHERE c.publicacion_id = $1
        ORDER BY c.fecha_creacion ASC
        `,
        [publicacionId, userId]
    );

        const comentariosConFotos = await Promise.all(
        resultado.rows.map(async (comentario) => ({
            ...comentario,
            foto_url: await obtenerUrlFoto(comentario.foto_url)
        }))
    );

    return comentariosConFotos;
};

// Crear comentario
const crearComentario = async ({
    publicacionId,
    userId,
    contenido
}) => {
    const resultado = await communityPool.query(
        `
        INSERT INTO public.comentarios (
            publicacion_id,
            user_id,
            contenido
        )
        VALUES ($1, $2, $3)
        RETURNING *
        `,
        [publicacionId, userId, contenido]
    );

    return resultado.rows[0];
};

// Eliminar un comentario propio
const eliminarComentario = async ({ comentarioId, userId }) => {
    const resultado = await communityPool.query(
        `
        DELETE FROM public.comentarios
        WHERE id = $1
          AND user_id = $2
        RETURNING id, publicacion_id
        `,
        [comentarioId, userId]
    );

    return resultado.rows[0] || null;
};

module.exports = {
    obtenerComentarios,
    crearComentario,
    eliminarComentario
};
