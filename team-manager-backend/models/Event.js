const mongoose = require("mongoose");

// Schema für Teilnehmer eines Termins
const participantSchema = new mongoose.Schema({
  playerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["present", "absent", "excused"], default: "absent" },
});

// Schema für Einzeltermine
const eventSchema = new mongoose.Schema({
  seriesId: { type: mongoose.Schema.Types.ObjectId, ref: "Series" }, // Verweis auf die Serie
  title: { type: String, required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  meetTime: { type: String }, // Zeit zum Treffen
  location: { type: String, required: true },
  status: { type: String, enum: ["active", "cancelled"], default: "active" },
  participants: [participantSchema], // Liste der Teilnehmer mit Status
  tags: [String], // Optional: Tags zur Zuordnung
});

module.exports = mongoose.model("Event", eventSchema);
