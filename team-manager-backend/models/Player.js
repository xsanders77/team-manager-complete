const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name des Spielers
  birthDate: { type: Date, required: true }, // Geburtsdatum
  phoneNumber: { type: String }, // Telefonnummer (optional)
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "Parent" }, // Referenz auf Elternaccount
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }], // Zugewiesene Teams
  tags: [{ type: String }], // Tags zur Klassifizierung des Spielers (z. B. "E1", "Torwart")
  createdAt: { type: Date, default: Date.now }, // Zeitstempel für die Erstellung
});

module.exports = mongoose.model("Player", playerSchema);
