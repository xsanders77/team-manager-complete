const express = require("express");
const Tag = require("../models/Tag");
const authMiddleware = require("../middleware/authMiddleware");

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Zugriff verweigert. Nur Admins erlaubt." });
  }
  next();
};

const trainerMiddleware = (req, res, next) => {
  if (req.user.role !== "trainer") {
    return res.status(403).json({ message: "Zugriff verweigert. Nur Trainer erlaubt." });
  }
  next();
};

const router = express.Router();

// Tag erstellen
router.post("/", authMiddleware, async (req, res) => {
  const { name, category, teamId } = req.body;

  try {
    // Nur Admins dürfen globale Tags erstellen
    if (req.user.role === "trainer" && !teamId) {
      return res.status(403).json({ message: "Trainer dürfen nur teamgebundene Tags erstellen." });
    }

    const newTag = new Tag({ name, category, teamId });
    const savedTag = await newTag.save();
    res.status(201).json(savedTag);
  } catch (err) {
    console.error("Fehler beim Erstellen des Tags:", err.message);
    res.status(500).json({ message: "Fehler beim Erstellen des Tags" });
  }
});

// Alle Tags abrufen
router.get("/", authMiddleware, async (req, res) => {
  try {
    let tags;
    if (req.user.role === "admin") {
      tags = await Tag.find(); // Admin sieht alle Tags
    } else if (req.user.role === "trainer") {
      // Trainer sieht nur Tags für seine Teams
      tags = await Tag.find({ teamId: { $in: req.user.teams } });
    } else {
      return res.status(403).json({ message: "Unbefugter Zugriff." });
    }

    res.status(200).json(tags);
  } catch (err) {
    console.error("Fehler beim Abrufen der Tags:", err.message);
    res.status(500).json({ message: "Fehler beim Abrufen der Tags" });
  }
});

// Tag löschen
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);

    if (!tag) {
      return res.status(404).json({ message: "Tag nicht gefunden" });
    }

    // Admin darf alle Tags löschen
    if (req.user.role === "trainer" && !req.user.teams.includes(tag.teamId.toString())) {
      return res.status(403).json({ message: "Kein Zugriff auf dieses Tag." });
    }

    await tag.deleteOne();
    res.status(200).json({ message: "Tag erfolgreich gelöscht" });
  } catch (err) {
    console.error("Fehler beim Löschen des Tags:", err.message);
    res.status(500).json({ message: "Fehler beim Löschen des Tags" });
  }
});

module.exports = router;
