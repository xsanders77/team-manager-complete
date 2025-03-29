const express = require("express");
const User = require("../models/User"); // Das Benutzer-Modell importieren
const Trainer = require("../models/Trainer"); // Modell für Trainer
const Player = require("../models/Player"); // Modell für Spieler
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

router.get("/players", async (req, res) => {
  console.log("Received request for all players"); // Log request receipt
  try {
      const players = await Player.find(); // Populate user details without password
      console.log("Trainers fetched:", players); // Log the trainers to the console
      res.status(200).json(players);
  } catch (err) {
      console.error("Fehler beim Abrufen der Trainer:", err.message);
      res.status(500).json({ message: "Fehler beim Abrufen der Trainer" });
  }
});

router.get("/trainers", async (req, res) => {
  console.log("Received request for all trainers"); // Log request receipt
  try {
      const trainers = await Trainer.find(); // Populate user details without password
      console.log("Trainers fetched:", trainers); // Log the trainers to the console
      res.status(200).json(trainers);
  } catch (err) {
      console.error("Fehler beim Abrufen der Trainer:", err.message);
      res.status(500).json({ message: "Fehler beim Abrufen der Trainer" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    console.log('Neuer Benutzer erstellt:', savedUser._id, 'Rolle:', savedUser.role); // Debugging: Log user creation
    
    // Wenn der Benutzer die Rolle "trainer" oder "admin" hat, erstelle einen Trainer-Eintrag
    if (savedUser.role === 'trainer' || savedUser.role === 'admin') {
      try {
        // Prüfe, ob bereits ein Trainer für diesen User existiert
        let trainer = await Trainer.findOne({ user: savedUser._id });
        
        if (!trainer) {
          // Erstelle einen neuen Trainer
          trainer = new Trainer({
            user: savedUser._id,
            teams: []
          });
          
          await trainer.save();
          console.log('Neuer Trainer automatisch erstellt:', trainer._id, 'für User:', savedUser._id);
        }
      } catch (trainerErr) {
        console.error('Fehler beim Erstellen des Trainers:', trainerErr.message);
        // Wir werfen hier keinen Fehler, da der User bereits erstellt wurde
      }
    }
    
    // Wenn der Benutzer die Rolle "player" hat, erstelle einen Player-Eintrag
    if (savedUser.role === 'player') {
      try {
        // Prüfe, ob bereits ein Player für diesen User existiert
        let player = await Player.findOne({ user: savedUser._id });
        
        if (!player) {
          // Erstelle einen neuen Player
          player = new Player({
            user: savedUser._id,
            birthDate: new Date('2000-01-01'), // Dummy-Datum
            teams: []
          });
          
          await player.save();
          console.log('Neuer Player automatisch erstellt:', player._id, 'für User:', savedUser._id);
        }
      } catch (playerErr) {
        console.error('Fehler beim Erstellen des Players:', playerErr.message);
        // Wir werfen hier keinen Fehler, da der User bereits erstellt wurde
      }
    }
    
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
    
    // Wenn der Benutzer die Rolle "trainer" oder "admin" hat, erstelle einen Trainer-Eintrag
    if (updatedUser.role === 'trainer' || updatedUser.role === 'admin') {
      try {
        // Prüfe, ob bereits ein Trainer für diesen User existiert
        let trainer = await Trainer.findOne({ user: updatedUser._id });
        
        if (!trainer) {
          // Erstelle einen neuen Trainer
          trainer = new Trainer({
            user: updatedUser._id,
            teams: []
          });
          
          await trainer.save();
          console.log('Neuer Trainer automatisch erstellt bei Update:', trainer._id, 'für User:', updatedUser._id);
        }
      } catch (trainerErr) {
        console.error('Fehler beim Erstellen des Trainers bei Update:', trainerErr.message);
        // Wir werfen hier keinen Fehler, da der User bereits aktualisiert wurde
      }
    }
    
    // Wenn der Benutzer die Rolle "player" hat, erstelle einen Player-Eintrag
    if (updatedUser.role === 'player') {
      try {
        // Prüfe, ob bereits ein Player für diesen User existiert
        let player = await Player.findOne({ user: updatedUser._id });
        
        if (!player) {
          // Erstelle einen neuen Player
          player = new Player({
            user: updatedUser._id,
            birthDate: new Date('2000-01-01'), // Dummy-Datum
            teams: []
          });
          
          await player.save();
          console.log('Neuer Player automatisch erstellt bei Update:', player._id, 'für User:', updatedUser._id);
        }
      } catch (playerErr) {
        console.error('Fehler beim Erstellen des Players bei Update:', playerErr.message);
        // Wir werfen hier keinen Fehler, da der User bereits aktualisiert wurde
      }
    }
    
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Fehler beim Aktualisieren des Benutzers:", err.message);
    res.status(500).json({ message: "Fehler beim Aktualisieren des Benutzers", error: err.message });
  }
});


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
