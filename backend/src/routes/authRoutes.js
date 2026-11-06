const express = require("express");
const router = express.Router();

const {
    doubleCsrfProtection
} = require("../middlewares/csrfMiddleware");

const {
    verificarToken
} = require("../middlewares/authMiddleware");

const {
    login,
    logout,
    me,
    obtenerTokenCSRF
} = require("../controllers/authController");


router.get("/csrf", obtenerTokenCSRF);

router.post("/login", doubleCsrfProtection, login);

router.post("/logout", doubleCsrfProtection, logout);

router.get("/me", verificarToken, me);

module.exports = router;
