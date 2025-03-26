const mongoose = require("mongoose");

// Schema für Serientermine
const seriesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ["training", "match"], default: "training" },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  meetTime: { type: String }, // Zeit zum Treffen
  location: { type: String, required: true },
  description: { type: String },
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
  maxParticipants: { type: Number },
  tags: [String], // Subgruppen
  repeatRule: {
    frequency: { type: String, enum: ["weekly", "biweekly"], required: true },
    repeatDays: [{ type: Number }], // 0-6 für Montag-Sonntag
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Series", seriesSchema);
