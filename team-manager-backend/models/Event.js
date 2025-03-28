const mongoose = require("mongoose");

// Schema für Teilnehmer eines Termins
const participantSchema = new mongoose.Schema({
  playerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["accepted", "declined", "pending"], default: "pending" },
});

// Schema für Einzeltermine
const eventSchema = new mongoose.Schema({
  seriesId: { type: mongoose.Schema.Types.ObjectId, ref: "Series", required: true }, // Verweis auf die Serie
  title: { type: String, required: true },
  type: { type: String, enum: ["training", "match"], default: "training" },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  meetTime: { type: String }, // Zeit zum Treffen
  location: { type: String, required: true },
  description: { type: String },
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
  maxParticipants: { type: Number, min: 1 }, // Ensure it's a positive integer
  status: { type: String, enum: ["active", "cancelled"], default: "active" },
  participants: [participantSchema], // Liste der Teilnehmer mit Status
  tags: [{ type: String, default: [] }], // Optional: Tags zur Zuordnung
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Event", eventSchema);
