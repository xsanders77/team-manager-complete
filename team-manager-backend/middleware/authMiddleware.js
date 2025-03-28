const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("Kein gültiger Authorization-Header gefunden.");
    return res.status(401).json({ message: "Kein Token bereitgestellt" });
  }

  const token = authHeader.split(" ")[1];
  console.log("Empfangenes Token:", token); // Debugging: Token in die Logs schreiben

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Benutzerinformationen aus dem Token
    next();
  } catch (err) {
    console.error("Token-Fehler:", err.message);
    return res.status(401).json({ message: "Ungültiges Token" });
  }
};

module.exports = authMiddleware;
