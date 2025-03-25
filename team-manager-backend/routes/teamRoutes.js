const express = require("express");
const Team = require("../models/Team"); // Importiere das Team-Modell
const User = require("../models/User"); // Importiere das User-Modell
const Trainer = require("../models/Trainer"); // Importiere das Trainer-Modell
const Player = require("../models/Player"); // Importiere das Player-Modell
const router = express.Router();

// Alle Teams abrufen
router.get("/", async (req, res) => {
  try {
    const teams = await Team.find()
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
    
    console.log("Alle Teams abgerufen:", teams.length);
    res.json(teams);
  } catch (err) {
    console.error("Fehler beim Abrufen der Teams:", err.message);
    res.status(500).json({ message: "Fehler beim Abrufen der Teams", error: err.message });
  }
});

// Team erstellen
router.post("/", async (req, res) => {
  try {
    const { name, trainers, tags, players } = req.body;
    const newTeam = new Team({ name, trainers, tags, players });
    const savedTeam = await newTeam.save();
    res.status(201).json(savedTeam);
  } catch (err) {
    res.status(400).json({ message: "Fehler beim Erstellen des Teams", error: err.message });
  }
});

// Team nach ID abrufen
router.get("/:id", async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
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
    
    if (!team) return res.status(404).json({ message: "Team nicht gefunden" });
    
    console.log("Team nach ID abgerufen:", team._id, "Trainer:", team.trainers.length);
    res.json(team);
  } catch (err) {
    console.error("Fehler beim Abrufen des Teams:", err.message);
    res.status(500).json({ message: "Fehler beim Abrufen des Teams", error: err.message });
  }
});

// Team aktualisieren
router.put("/:id", async (req, res) => {
  try {
    const { name, trainers, tags, players } = req.body;
    const updatedTeam = await Team.findByIdAndUpdate(
      req.params.id,
      { name, trainers, tags, players },
      { new: true }
    )
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
    
    if (!updatedTeam) return res.status(404).json({ message: "Team nicht gefunden" });
    
    console.log("Team aktualisiert:", updatedTeam._id, "Trainer:", updatedTeam.trainers.length);
    res.json(updatedTeam);
  } catch (err) {
    console.error("Fehler beim Aktualisieren des Teams:", err.message);
    res.status(400).json({ message: "Fehler beim Aktualisieren des Teams", error: err.message });
  }
});

// Team löschen
router.delete("/:id", async (req, res) => {
  try {
    const deletedTeam = await Team.findByIdAndDelete(req.params.id);
    if (!deletedTeam) return res.status(404).json({ message: "Team nicht gefunden" });
    res.json({ message: "Team erfolgreich gelöscht" });
  } catch (err) {
    res.status(500).json({ message: "Fehler beim Löschen des Teams", error: err.message });
  }
});

module.exports = router;