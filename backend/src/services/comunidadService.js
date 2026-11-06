const communityPool = require("../config/communityDatabase");

const {
    obtenerUrlFoto
} = require("./fotoUrlService");

// Consultar publicaciones
// Consultar publicaciones con información del autor
// Consultar publicaciones con información del autor y reacciones
const obtenerPublicaciones = async (userId) => {
    const resultado = await communityPool.query(
        `
        SELECT
            p.id,
            p.user_id,
            p.contenido,
            p.categoria,
            p.fecha_creacion,
            p.fecha_actualizacion,

            COALESCE(pr.nombre, 'Estudiante') AS nombre,
            pr.matricula,
            pr.foto_url,

            COALESCE(
                json_agg(
                    DISTINCT jsonb_build_object(
                        'id', i.id,
                        'url', i.url
                    )
                ) FILTER (WHERE i.id IS NOT NULL),
                '[]'
            ) AS imagenes,

            COUNT(DISTINCT r.id)::INTEGER AS total_reacciones,

            BOOL_OR(r.user_id = $1) AS usuario_reacciono

        FROM public.publicaciones p

        LEFT JOIN public.perfiles pr
            ON pr.user_id = p.user_id

        LEFT JOIN public.imagenes_publicacion i
            ON i.publicacion_id = p.id

        LEFT JOIN public.reacciones r
            ON r.publicacion_id = p.id

        WHERE p.estado = 'publicada'

        GROUP BY p.id, pr.nombre, pr.matricula, pr.foto_url

        ORDER BY p.fecha_creacion DESC

        LIMIT 50
        `,
        [userId]
    );

    const publicacionesConFotos = await Promise.all(
        resultado.rows.map(async (publicacion) => ({
            ...publicacion,
            foto_url: await obtenerUrlFoto(publicacion.foto_url),
            usuario_reacciono: publicacion.usuario_reacciono || false
        }))
    );

    return publicacionesConFotos;
};

// Crear publicación
const crearPublicacion = async ({
    userId,
    contenido,
    categoria
}) => {
    const resultado = await communityPool.query(
        `INSERT INTO public.publicaciones
        (user_id, contenido, categoria)
        VALUES ($1, $2, $3)
        RETURNING *`,
        [userId, contenido, categoria]
    );

    return resultado.rows[0];
};

module.exports = {
    obtenerPublicaciones,
    crearPublicacion
};
