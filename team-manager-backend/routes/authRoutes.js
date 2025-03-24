const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Registrierungs-Route
router.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Prüfen, ob Benutzer existiert
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "E-Mail wird bereits verwendet" });
    }

    // Passwort hashen
    const hashedPassword = await bcrypt.hash(password, 10);

    // Benutzer erstellen
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const savedUser = await newUser.save();

    res.status(201).json({ message: "Benutzer erfolgreich registriert", userId: savedUser._id });
  } catch (err) {
    console.error("Fehler bei der Registrierung:", err.message);
    res.status(500).json({ message: "Fehler beim Registrieren des Benutzers", error: err.message });
  }
});

// Login-Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Benutzer nicht gefunden" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    // TEMPORÄR
    //const isPasswordValid = password === '1234';
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Ungültiges Passwort" });
    }

    // JWT erstellen
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || "supersecret",
      { expiresIn: "1h" }
    );

    res.status(200).json({ token, userId: user._id, role: user.role });
  } catch (err) {
    console.error("Fehler beim Login:", err.message);
    res.status(500).json({ message: "Fehler beim Login", error: err.message });
  }
});

// Geschützte Route: Benutzerprofil
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId, "name email role");
    if (!user) {
      return res.status(404).json({ message: "Benutzer nicht gefunden" });
    }

    res.status(200).json({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error("Fehler beim Abrufen des Profils:", err.message);
    res.status(500).json({ message: "Fehler beim Abrufen des Profils", error: err.message });
  }
});

module.exports = router;
