const mongoose = require("mongoose");

const trainerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Passwort verschlüsseln bei Speicherung
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }], // Verknüpfte Teams
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Trainer", trainerSchema);
