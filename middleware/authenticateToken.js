const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ message: "No autorizado" });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;
    const user = jwt.verify(token, jwtSecret);
    req.user = user;
    next();
  } catch (error) {
    console.error("Error al validar token:", error);
    return res.status(403).json({ message: "Token inválido" });
  }
};

module.exports = authenticateToken;
