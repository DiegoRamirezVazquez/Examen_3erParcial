const { doubleCsrf } = require("csrf-csrf");

const {
    generateCsrfToken,
    doubleCsrfProtection
} = doubleCsrf({
    getSecret: () => process.env.CSRF_SECRET,

    // Antes del login identifica al visitante por IP.
    // Después del login identifica su sesión privada.
    getSessionIdentifier: (req) => {
        return req.cookies?.app_session || req.ip || "anonymous";
    },

    cookieName: "csrf_token",

    cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/"
    },

    size: 64,

    getCsrfTokenFromRequest: (req) => {
        return req.headers["x-csrf-token"];
    }
});

module.exports = {
    generateCsrfToken,
    doubleCsrfProtection
};
