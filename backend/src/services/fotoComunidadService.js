const communityStorage = require("../config/communityStorage");

const BUCKET = process.env.COMMUNITY_SUPABASE_BUCKET;

const guardarFotoPerfil = async ({ userId, fotoBase64 }) => {
    if (!userId || !fotoBase64) {
        throw new Error("Falta el identificador o la fotografía del estudiante.");
    }

    // Detectar el formato de la fotografía
    const base64Limpio = fotoBase64.replace(
        /^data:image\/[a-zA-Z0-9.+-]+;base64,/,
        ""
    );

    const imagen = Buffer.from(base64Limpio, "base64");

    let extension;
    let contentType;

    if (
        imagen[0] === 0xff &&
        imagen[1] === 0xd8 &&
        imagen[2] === 0xff
    ) {
        extension = "jpg";
        contentType = "image/jpeg";
    } else if (
        imagen[0] === 0x89 &&
        imagen[1] === 0x50 &&
        imagen[2] === 0x4e &&
        imagen[3] === 0x47
    ) {
        extension = "png";
        contentType = "image/png";
    } else if (
        imagen.toString("ascii", 0, 4) === "RIFF" &&
        imagen.toString("ascii", 8, 12) === "WEBP"
    ) {
        extension = "webp";
        contentType = "image/webp";
    } else {
        throw new Error("El formato de la fotografía institucional no es compatible.");
    }

    // Limitar el tamaño a 5 MB
    if (imagen.length > 5 * 1024 * 1024) {
        throw new Error("La fotografía supera el límite de 5 MB.");
    }

    const identificador = String(userId).replace(/[^a-zA-Z0-9_-]/g, "");

    const ruta = `perfiles/${identificador}.${extension}`;

    const { error } = await communityStorage.storage
        .from(BUCKET)
        .upload(ruta, imagen, {
            contentType,
            upsert: true
        });

    if (error) {
        throw new Error(`Error al guardar la fotografía: ${error.message}`);
    }

    return ruta;
};

module.exports = {
    guardarFotoPerfil
};
