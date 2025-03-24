const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes"); // Importiere Authentifizierungsrouten

const app = express();
dotenv.config();
// Middleware
app.use(cors()); // Aktiviert CORS
app.use(express.json()); // Zum Verarbeiten von JSON-Daten

// Test-Route
app.get("/test", (req, res) => {
  res.status(200).json({ message: "Server läuft korrekt!" });
});

// Authentifizierungsrouten
app.use("/api/auth", authRoutes);

// MongoDB-Verbindung herstellen
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true, // Ab Mongoose 6.x nicht mehr nötig, kann entfernt werden
   
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Standardroute für nicht gefundene Routen
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Server starten
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
