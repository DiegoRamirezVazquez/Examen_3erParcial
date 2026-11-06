const communityPool = require("../config/communityDatabase");

// Registrar o actualizar el perfil del estudiante
const guardarPerfilComunidad = async ({
    userId,
    nombre,
    matricula,
    fotoUrl = null
}) => {
    const resultado = await communityPool.query(
        `
        INSERT INTO public.perfiles (
            user_id,
            nombre,
            matricula,
            foto_url
        )
        VALUES ($1, $2, $3, $4)

        ON CONFLICT (user_id)
        DO UPDATE SET
            nombre = EXCLUDED.nombre,
            matricula = EXCLUDED.matricula,
            foto_url = COALESCE(
                EXCLUDED.foto_url,
                public.perfiles.foto_url
            ),
            fecha_actualizacion = NOW()

        RETURNING
            user_id,
            nombre,
            matricula,
            foto_url
        `,
        [userId, nombre, matricula, fotoUrl]
    );

    return resultado.rows[0];
};

module.exports = {
    guardarPerfilComunidad
};