const axios = require("axios");

const siiApi = axios.create({
    baseURL: process.env.SII_API_URL,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
    timeout: 15000
});

const loginSII = async (email, password) => {
    const response = await siiApi.post("/api/login", {
        email,
        password
    });

    return response.data;
};

const obtenerEstudianteSII = async (token) => {
    const response = await siiApi.get("/api/movil/estudiante", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data;
};

module.exports = { loginSII , obtenerEstudianteSII };