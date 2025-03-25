const User = require('../models/User');
const Trainer = require('../models/Trainer');
const Player = require('../models/Player');
const mongoose = require('mongoose');

/**
 * Middleware zur Konvertierung von User-IDs zu Trainer-IDs oder Player-IDs
 * Diese Middleware löst das Kompatibilitätsproblem zwischen Frontend und Backend
 * nach der Implementierung von Ansatz 1
 */
const idConversionMiddleware = async (req, res, next) => {
  try {
    // Prüfe, ob wir einen Trainer hinzufügen
    if (req.path.includes('/trainers') && req.body.trainerId) {
      const trainerId = req.body.trainerId;
      
      console.log('ID-Konvertierung: Prüfe Trainer-ID', trainerId);
      
      // Prüfe, ob die ID ein gültiges ObjectId-Format hat
      if (!mongoose.Types.ObjectId.isValid(trainerId)) {
        return res.status(400).json({ message: 'Ungültige Trainer-ID' });
      }
      
      // Prüfe, ob die ID direkt zu einem Trainer gehört
      let trainer = await Trainer.findById(trainerId);
      
      // Wenn kein Trainer gefunden wurde, prüfe, ob es eine User-ID ist
      if (!trainer) {
        console.log('Kein Trainer mit dieser ID gefunden, prüfe User');
        
        // Prüfe, ob ein User mit dieser ID existiert
        const user = await User.findById(trainerId);
        
        if (!user) {
          return res.status(404).json({ message: 'Weder Trainer noch User mit dieser ID gefunden' });
        }
        
        // Prüfe, ob der User die Rolle "trainer" oder "admin" hat
        if (user.role !== 'trainer' && user.role !== 'admin') {
          return res.status(400).json({ message: 'Der User hat nicht die Rolle "trainer" oder "admin"' });
        }
        
        // Suche nach einem Trainer mit dieser User-ID
        trainer = await Trainer.findOne({ user: trainerId });
        
        // Wenn kein Trainer gefunden wurde, erstelle einen neuen
        if (!trainer) {
          console.log('Kein Trainer mit dieser User-ID gefunden, erstelle einen neuen');
          trainer = new Trainer({
            user: trainerId,
            teams: []
          });
          await trainer.save();
          console.log('Neuer Trainer erstellt:', trainer._id);
        }
        
        // Ersetze die User-ID durch die Trainer-ID
        req.body.trainerId = trainer._id.toString();
        console.log('ID konvertiert von User-ID zu Trainer-ID:', trainerId, '->', req.body.trainerId);
      }
    }
    
    // Prüfe, ob wir einen Spieler hinzufügen
    if (req.path.includes('/players') && req.body.playerId) {
      const playerId = req.body.playerId;
      
      console.log('ID-Konvertierung: Prüfe Spieler-ID', playerId);
      
      // Prüfe, ob die ID ein gültiges ObjectId-Format hat
      if (!mongoose.Types.ObjectId.isValid(playerId)) {
        return res.status(400).json({ message: 'Ungültige Spieler-ID' });
      }
      
      // Prüfe, ob die ID direkt zu einem Spieler gehört
      let player = await Player.findById(playerId);
      
      // Wenn kein Spieler gefunden wurde, prüfe, ob es eine User-ID ist
      if (!player) {
        console.log('Kein Spieler mit dieser ID gefunden, prüfe User');
        
        // Prüfe, ob ein User mit dieser ID existiert
        const user = await User.findById(playerId);
        
        if (!user) {
          return res.status(404).json({ message: 'Weder Spieler noch User mit dieser ID gefunden' });
        }
        
        // Prüfe, ob der User die Rolle "player" hat
        if (user.role !== 'player') {
          return res.status(400).json({ message: 'Der User hat nicht die Rolle "player"' });
        }
        
        // Suche nach einem Spieler mit dieser User-ID
        player = await Player.findOne({ user: playerId });
        
        // Wenn kein Spieler gefunden wurde, erstelle einen neuen
        if (!player) {
          console.log('Kein Spieler mit dieser User-ID gefunden, erstelle einen neuen');
          // Für einen Spieler benötigen wir ein Geburtsdatum, setzen wir ein Dummy-Datum
          player = new Player({
            user: playerId,
            birthDate: new Date('2000-01-01'), // Dummy-Datum
            teams: []
          });
          await player.save();
          console.log('Neuer Spieler erstellt:', player._id);
        }
        
        // Ersetze die User-ID durch die Spieler-ID
        req.body.playerId = player._id.toString();
        console.log('ID konvertiert von User-ID zu Spieler-ID:', playerId, '->', req.body.playerId);
      }
    }
    
    next();
  } catch (error) {
    console.error('Fehler in der ID-Konvertierungs-Middleware:', error);
    res.status(500).json({ message: 'Interner Serverfehler bei der ID-Konvertierung', error: error.message });
  }
};

module.exports = idConversionMiddleware;
