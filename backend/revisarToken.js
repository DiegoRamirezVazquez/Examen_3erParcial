const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Pega tu JWT (no se mostrará en pantalla): ", (token) => {
    try {
        const payload = JSON.parse(
            Buffer.from(token.trim().split(".")[1], "base64url").toString()
        );

        console.log("\nDatos de expiración:");

        console.log("Emitido:", payload.iat
            ? new Date(payload.iat * 1000).toLocaleString()
            : "No especificado");

        console.log("Expira:", payload.exp
            ? new Date(payload.exp * 1000).toLocaleString()
            : "El token no contiene exp");

    } catch {
        console.log("No se pudo interpretar el JWT.");
    }

    rl.close();
});
