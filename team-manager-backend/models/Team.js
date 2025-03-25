const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name des Teams (z. B. "E-Jugend")
  trainers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Trainer" }], // Verknüpfte Trainer
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }], // Verknüpfte Spieler
  tags: [{ type: String }], // Tags für zusätzliche Gruppierungen (z. B. "E1", "E2", "Leistungsklasse")
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Team", teamSchema);
