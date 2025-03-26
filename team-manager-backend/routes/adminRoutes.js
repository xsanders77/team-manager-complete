const express = require("express");
const Team = require("../models/Team"); // Modell für Teams
const Trainer = require("../models/Trainer"); // Modell für Trainer
const Player = require("../models/Player"); // Modell für Spieler
const authMiddleware = require("../middleware/authMiddleware"); // Authentifizierungsmiddleware
const idConversionMiddleware = require("../middleware/idConversionMiddleware"); // ID-Konvertierungsmiddleware

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Zugriff verweigert. Nur Admins erlaubt." });
  }
  next();
};

const router = express.Router();

// Team erstellen
router.post("/teams", authMiddleware, adminMiddleware, async (req, res) => {
  const { name } = req.body;

  try {
    const newTeam = new Team({ name });
    const savedTeam = await newTeam.save();
    res.status(201).json(savedTeam);
  } catch (err) {
    console.error("Fehler beim Erstellen des Teams:", err.message);
    res.status(500).json({ message: "Fehler beim Erstellen des Teams" });
  }
});

// Team bearbeiten
router.put("/teams/:id", authMiddleware, adminMiddleware, async (req, res) => {
  const { name, tags } = req.body;

  try {
    const updatedTeam = await Team.findByIdAndUpdate(
      req.params.id,
      { name, tags },
      { new: true }
    );
    if (!updatedTeam) {
      return res.status(404).json({ message: "Team nicht gefunden" });
    }
    res.status(200).json(updatedTeam);
  } catch (err) {
    console.error("Fehler beim Bearbeiten des Teams:", err.message);
    res.status(500).json({ message: "Fehler beim Bearbeiten des Teams" });
  }
});

// Team löschen
router.delete("/teams/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const deletedTeam = await Team.findByIdAndDelete(req.params.id);
    if (!deletedTeam) {
      return res.status(404).json({ message: "Team nicht gefunden" });
    }
    res.status(200).json({ message: "Team erfolgreich gelöscht" });
  } catch (err) {
    console.error("Fehler beim Löschen des Teams:", err.message);
    res.status(500).json({ message: "Fehler beim Löschen des Teams" });
  }
});

// Trainer zu Team hinzufügen
router.post("/teams/:teamId/trainers", authMiddleware, idConversionMiddleware, async (req, res) => {
  const { trainerId } = req.body;
  
  console.log("Trainer hinzufügen Request:", {
    teamId: req.params.teamId,
    trainerId: trainerId,
    user: req.user,
    headers: req.headers
  });

  try {
    // Temporär die Admin-Prüfung deaktivieren für Debugging-Zwecke
    // if (req.user.role !== "admin") {
    //   console.log("Benutzerrolle:", req.user.role);
    //   return res.status(403).json({ message: "Zugriff verweigert. Nur Admins erlaubt." });
    // }
    
    const team = await Team.findById(req.params.teamId);
    if (!team) {
      console.log("Team nicht gefunden:", req.params.teamId);
      return res.status(404).json({ message: "Team nicht gefunden" });
    }

    console.log("Team gefunden:", team.name, "Trainer:", team.trainers);

    // Überprüfe, ob der Trainer bereits im Team ist (String-Vergleich mit ObjectId)
    if (team.trainers.some(id => id.toString() === trainerId)) {
      console.log("Trainer bereits im Team:", trainerId);
      return res.status(400).json({ message: "Trainer ist bereits diesem Team zugeordnet." });
    }

    team.trainers.push(trainerId);
    await team.save();
    console.log("Trainer erfolgreich hinzugefügt");

    // Trainer mit allen Daten zurückgeben
    const populatedTeam = await Team.findById(req.params.teamId)
      .populate({
        path: 'trainers',
        populate: {
          path: 'user',
          select: '-password' // Passwort aus Sicherheitsgründen ausschließen
        }
      })
      .populate({
        path: 'players',
        populate: {
          path: 'user',
          select: '-password' // Passwort aus Sicherheitsgründen ausschließen
        }
      });
    
    console.log("Populated Team:", JSON.stringify(populatedTeam));

    res.status(200).json(populatedTeam);
  } catch (err) {
    console.error("Fehler beim Hinzufügen des Trainers:", err.message);
    res.status(500).json({ message: "Fehler beim Hinzufügen des Trainers", error: err.message });
  }
});

// Spieler zu Team hinzufügen
router.post("/teams/:teamId/players", authMiddleware, idConversionMiddleware, async (req, res) => {
  const { playerId } = req.body;
  
  console.log("Spieler hinzufügen Request:", {
    teamId: req.params.teamId,
    playerId: playerId,
    user: req.user,
    headers: req.headers
  });

  try {
    // Temporär die Admin-Prüfung deaktivieren für Debugging-Zwecke
    // if (req.user.role !== "admin") {
    //   console.log("Benutzerrolle:", req.user.role);
    //   return res.status(403).json({ message: "Zugriff verweigert. Nur Admins erlaubt." });
    // }
    
    const team = await Team.findById(req.params.teamId);
    if (!team) {
      console.log("Team nicht gefunden:", req.params.teamId);
      return res.status(404).json({ message: "Team nicht gefunden" });
    }

    console.log("Team gefunden:", team.name, "Spieler:", team.players);

    // Überprüfe, ob der Spieler bereits im Team ist (String-Vergleich mit ObjectId)
    if (team.players.some(id => id.toString() === playerId)) {
      console.log("Spieler bereits im Team:", playerId);
      return res.status(400).json({ message: "Spieler ist bereits diesem Team zugeordnet." });
    }

    team.players.push(playerId);
    await team.save();
    console.log("Spieler erfolgreich hinzugefügt");

    // Spieler mit allen Daten zurückgeben
    const populatedTeam = await Team.findById(req.params.teamId)
      .populate({
        path: 'trainers',
        populate: {
          path: 'user',
          select: '-password' // Passwort aus Sicherheitsgründen ausschließen
        }
      })
      .populate({
        path: 'players',
        populate: {
          path: 'user',
          select: '-password' // Passwort aus Sicherheitsgründen ausschließen
        }
      });
    
    console.log("Populated Team:", JSON.stringify(populatedTeam));

    res.status(200).json(populatedTeam);
  } catch (err) {
    console.error("Fehler beim Hinzufügen des Spielers:", err.message);
    res.status(500).json({ message: "Fehler beim Hinzufügen des Spielers", error: err.message });
  }
});

module.exports = router;
