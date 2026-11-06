const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const estudianteRoutes = require("./routes/estudianteRoutes");

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Rutas de autenticación
app.use("/api/auth", authRoutes);

app.use("/api/estudiante", estudianteRoutes);

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Backend del examen funcionando"
    });
});

module.exports = app;