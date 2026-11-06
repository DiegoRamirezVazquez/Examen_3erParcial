const communityStorage = require("../config/communityStorage");

const BUCKET = process.env.COMMUNITY_SUPABASE_BUCKET;

// Generar URL temporal para una fotografía privada
const obtenerUrlFoto = async (ruta) => {
    if (!ruta) {
        return null;
    }

    const { data, error } = await communityStorage.storage
        .from(BUCKET)
        .createSignedUrl(ruta, 3600);

    if (error) {
        console.error(
            "Error al generar URL de fotografía:",
            error.message
        );

        return null;
    }

    return data.signedUrl;
};

module.exports = {
    obtenerUrlFoto
};
