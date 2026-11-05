const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const estudianteRoutes = require("./routes/estudianteRoutes");

const app = express();

// Permitir peticiones desde nuestro frontend
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/estudiante", estudianteRoutes);

// Comprueba que el servidor funciona
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Backend del examen funcionando"
    });
});

module.exports = app;