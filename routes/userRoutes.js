const express = require("express");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router(); // Usa router en lugar de app

// Definir la ruta del dashboard, protegida con la autenticación
router.get("/dashboard", authenticateToken, (req, res) => {
  res.status(200).json({ message: `Bienvenido, usuario ${req.user.email}` });
});

module.exports = router; // Exporta el router
