
const crypto = require("crypto");

const ALGORITHM = "aes-256-gcm";

const obtenerClave = () => {
    const key = process.env.JWT_ENCRYPTION_KEY;

    if (!key || !/^[a-fA-F0-9]{64}$/.test(key)) {
        throw new Error("JWT_ENCRYPTION_KEY debe contener 32 bytes en hexadecimal");
    }

    return Buffer.from(key, "hex");
};

const cifrarToken = (token) => {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGORITHM, obtenerClave(), iv);

    const encrypted = Buffer.concat([
        cipher.update(token, "utf8"),
        cipher.final()
    ]);

    const authTag = cipher.getAuthTag();

    return [
        iv.toString("hex"),
        authTag.toString("hex"),
        encrypted.toString("hex")
    ].join(":");
};

const descifrarToken = (encryptedToken) => {
    const [ivHex, authTagHex, encryptedHex] = encryptedToken.split(":");

    if (!ivHex || !authTagHex || !encryptedHex) {
        throw new Error("Formato de token cifrado inválido");
    }

    const decipher = crypto.createDecipheriv(
        ALGORITHM,
        obtenerClave(),
        Buffer.from(ivHex, "hex")
    );

    decipher.setAuthTag(Buffer.from(authTagHex, "hex"));

    const decrypted = Buffer.concat([
        decipher.update(Buffer.from(encryptedHex, "hex")),
        decipher.final()
    ]);

    return decrypted.toString("utf8");
};

module.exports = { cifrarToken, descifrarToken };
