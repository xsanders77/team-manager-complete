const mongoose = require("mongoose");

const trainerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Referenz auf das User-Modell
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }], // Verknüpfte Teams
  // qualifications: [{ type: String, required: true }], // Qualifikationen des Trainers (z.B. "Lizenz C", "Erste Hilfe")
  // specialization: { type: String, required: true }, // Spezialisierung (z.B. "Torwarttraining", "Athletik")
  createdAt: { type: Date, default: Date.now }, // Zeitstempel für die Erstellung
});

module.exports = mongoose.model("Trainer", trainerSchema);