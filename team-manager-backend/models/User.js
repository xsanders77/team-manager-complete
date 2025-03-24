const mongoose = require("mongoose");

// Schema für ein Kind (wird von Eltern verwaltet)
const childSchema = new mongoose.Schema({
  name: String,
  birthDate: Date,
  phone: String,
  tags: [String],
});

// Schema für Benutzer
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "trainer", "parent", "player"] },
  children: [childSchema], // Nur für Eltern
});

module.exports = mongoose.model("User", userSchema);
