const mongoose = require("mongoose");

const trainerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Referenz auf das User-Modell
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }], // Verknüpfte Teams
  qualifications: [{ type: String }], // Qualifikationen des Trainers (z.B. "Lizenz C", "Erste Hilfe")
  specialization: { type: String }, // Spezialisierung (z.B. "Torwarttraining", "Athletik")
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Trainer", trainerSchema);