const mongoose = require("mongoose");

// Schema für Serientermine
const seriesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  meetTime: { type: String }, // Zeit zum Treffen
  location: { type: String, required: true },
  tags: [String], // Subgruppen
  repeatRule: {
    frequency: { type: String, enum: ["daily", "weekly", "monthly"], required: true },
    dayOfWeek: { type: String }, // Nur für wöchentliche Termine
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
});

module.exports = mongoose.model("Series", seriesSchema);
