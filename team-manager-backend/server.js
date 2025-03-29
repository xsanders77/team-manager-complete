const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes"); // Importiere die Benutzer-API
const teamRoutes = require("./routes/teamRoutes");
const eventRoutes = require("./routes/eventRoutes");
const seriesRoutes = require("./routes/seriesRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const cors = require("cors");

// Konfiguration der Umgebungsvariablen
dotenv.config();

const app = express();

// Genereller Log für eingehende Anfragen
app.use((req, res, next) => {
  console.log(`Anfrage: ${req.method} ${req.url}`);
  next();
});

// Middleware: CORS und JSON-Parser
app.use(cors());
app.use(express.json());

// Middleware zum Debuggen des Raw-Body

// Benutzer-API-Routen
app.use("/api/users", userRoutes);
//app.use("/api/trainers", trainerRoutes); // Correctly register the trainer routes
app.use("/api/players", teamRoutes); // Register the player routes
app.use("/api/teams", teamRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/series", seriesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// MongoDB-Verbindung herstellen
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Test-Route
app.get("/test", (req, res) => {
  res.status(200).json({ message: "Test-Route funktioniert!" });
});

// Fehlerbehandlung für nicht gefundene Routen
app.use((req, res) => {
  console.log("Route nicht gefunden");
  res.status(404).json({ message: "Route not found" });
});

// Globaler Fehlerhandler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong", error: err.message });
});

// Server starten
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
