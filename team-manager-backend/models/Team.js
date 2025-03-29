const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 1 }, // Name des Teams (z. B. "E-Jugend")
  trainers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Trainer" }], // Verknüpfte Trainer
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }], // Verknüpfte Spieler
  ageGroup: { type: String, default: 'unbekannt' },
  tags: [{ type: String, default: [] }], // Tags für zusätzliche Gruppierungen (z. B. "E1", "E2", "Leistungsklasse")
  createdAt: { type: Date, default: Date.now }, // Zeitstempel für die Erstellung
});

module.exports = mongoose.model("Team", teamSchema);
