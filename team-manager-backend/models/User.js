const mongoose = require("mongoose");

// Schema für ein Kind (wird von Eltern verwaltet)
const childSchema = new mongoose.Schema({
  name: { type: String, required: true },
  birthDate: { type: Date, required: true },
  phone: { type: String, required: true },
  tags: { type: [String], default: [] },
});

// Schema für Benutzer
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ }, // Regex for email validation
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "trainer", "parent", "player"], default: "player" },
  children: { type: [childSchema], default: [] }, // Nur für Eltern
});

// Pre-save hook to hash password
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    const bcrypt = require('bcryptjs');
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model("User", userSchema);