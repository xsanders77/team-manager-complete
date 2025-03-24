const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Name des Tags
  category: { type: String, default: "general" }, // Optional: Kategorie (z. B. "Position")
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team" }, // Verknüpftes Team
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Tag", tagSchema);
