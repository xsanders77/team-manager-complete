const express = require("express");
const User = require("../models/User"); // Das Benutzer-Modell importieren
const router = express.Router();

// Alle Benutzer abrufen
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Fehler beim Abrufen der Benutzer" });
  }
});

// Neuen Benutzer erstellen
router.post("/", async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ message: "Fehler beim Erstellen des Benutzers", error: err.message });
  }
});
// Update user by ID

router.put("/:id", async (req, res) => {
  const userId = req.params.id;
  const updateData = req.body;

  try {
      const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true }).select("-password");
      if (!updatedUser) {
          return res.status(404).json({ message: "Benutzer nicht gefunden" });
      }
      res.status(200).json(updatedUser);
  } catch (err) {
      console.error("Fehler beim Aktualisieren des Benutzers:", err.message);
      res.status(500).json({ message: "Fehler beim Aktualisieren des Benutzers", error: err.message });
  }
});

// Benutzer abrufen mit ID

router.get("/:id", async (req, res) => {
  const userId = req.params.id;

  try {
      const user = await User.findById(userId).select("-password"); // Passwort wird ausgeschlossen
      if (!user) {
          return res.status(404).json({ message: "Benutzer nicht gefunden" });
      }
      res.status(200).json(user);
  } catch (err) {
      console.error("Fehler beim Abrufen des Benutzers:", err.message);
      res.status(500).json({ message: "Fehler beim Abrufen des Benutzers", error: err.message });
  }
});

// Delete user by ID

router.delete("/:id", async (req, res) => {
  const userId = req.params.id;

  try {
      const deletedUser = await User.findByIdAndDelete(userId);
      if (!deletedUser) {
          return res.status(404).json({ message: "Benutzer nicht gefunden" });
      }
      res.status(200).json({ message: "Benutzer erfolgreich gelöscht", user: deletedUser });
  } catch (err) {
      console.error("Fehler beim Löschen des Benutzers:", err.message);
      res.status(500).json({ message: "Fehler beim Löschen des Benutzers", error: err.message });
  }
});

// Alle Benutzer löschen

router.delete("/", async (req, res) => {
  try {
    await User.deleteMany({});
    res.status(200).json({ message: "Alle Benutzer wurden erfolgreich gelöscht" });
  } catch (err) {
    res.status(500).json({ message: "Fehler beim Löschen aller Benutzer", error: err.message });
  }
});

module.exports = router;
