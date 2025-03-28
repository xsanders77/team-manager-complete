const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Referenz auf das User-Modell
  birthDate: { type: Date, required: true }, // Geburtsdatum
  phoneNumber: { type: String }, // Telefonnummer (optional)
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "Parent" }, // Referenz auf Elternaccount
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }], // Zugewiesene Teams
  position: { type: String, required: true }, // Position des Spielers (z.B. "Torwart", "Verteidiger")
  jerseyNumber: { type: Number, required: true }, // Trikotnummer
  tags: [{ type: String, default: [] }], // Tags zur Klassifizierung des Spielers (z. B. "E1", "Torwart")
  createdAt: { type: Date, default: Date.now }, // Zeitstempel für die Erstellung
});

module.exports = mongoose.model("Player", playerSchema);