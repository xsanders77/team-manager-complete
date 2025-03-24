const express = require("express");
const Event = require("../models/Event");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Route: Neuen Termin erstellen
router.post("/", authMiddleware, async (req, res) => {
  console.log("Headers:", req.headers); // Zeige die Anfrage-Header
  console.log("Empfangener Body:", req.body); // Debugging: Body loggen
  console.log("User aus Token:", req.user); // Debugging des authentifizierten Users

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "Body ist leer. Stellen Sie sicher, dass die Anfrage korrekt ist." });
  }
  
  const { title, date, startTime, endTime, meetTime, location, tags, status } = req.body;

  

  if (!title || !date || !startTime || !endTime || !location) {
    return res.status(400).json({ message: "Alle erforderlichen Felder müssen ausgefüllt sein." });
  }
  try {
    // Prüfung auf doppelte Termine
    const existingEvent = await Event.findOne({
      title,
      date,
      startTime,
      location
    });

    if (existingEvent) {
      return res.status(400).json({ message: "Ein identischer Termin existiert bereits." });
    }
  // Neuen Termin erstellen
  const newEvent = new Event({
    title,
    date,
    startTime,
    endTime,
    meetTime,
    location,
    tags,
    status,
    createdBy: req.user.userId, // User-ID aus Token
  });

  const savedEvent = await newEvent.save();
  res.status(201).json(savedEvent);
} catch (err) {
  console.error("Fehler beim Erstellen eines Termins:", err.message);
  res.status(500).json({ message: "Fehler beim Erstellen des Termins", error: err.message });
}
});

// Route: Alle relevanten Termine abrufen
router.get("/", authMiddleware, async (req, res) => {
  try {
    console.log("Abfrage gestartet");
    const events = await Event.find();
    console.log("Gefundene Events:", events);
    res.status(200).json(events);
  } catch (err) {
    console.error("Fehler beim Abrufen der Events:", err.message);
    res.status(500).json({ message: "Fehler beim Abrufen der Termine" });
  }
});

// Route: Einzelnen Termin abrufen
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Termin nicht gefunden" });
    res.json(event);
  } catch (err) {
    console.error("Fehler beim Abrufen des Termins:", err.message);
    res.status(500).json({ message: "Fehler beim Abrufen des Termins", error: err.message });
  }
});

// Route: Termin bearbeiten
router.put("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, date, startTime, endTime, meetTime, location, tags, status } = req.body;

  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { title, date, startTime, endTime, meetTime, location, tags, status },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Termin nicht gefunden" });
    }

    res.status(200).json(updatedEvent);
  } catch (err) {
    console.error("Fehler beim Bearbeiten des Termins:", err.message);
    res.status(500).json({ message: "Fehler beim Bearbeiten des Termins" });
  }
});

// Route: Termin löschen
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({ message: "Termin nicht gefunden" });
    }

    res.status(200).json({ message: "Termin erfolgreich gelöscht" });
  } catch (err) {
    console.error("Fehler beim Löschen des Termins:", err.message);
    res.status(500).json({ message: "Fehler beim Löschen des Termins" });
  }
});

// Route: Teilnehmer eines Elternteils für einen bestimmten Termin abrufen
router.get("/:eventId/participants", authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId).populate("participants.playerId");
    if (!event) {
      return res.status(404).json({ message: "Termin nicht gefunden" });
    }

    // Kinder des angemeldeten Elternteils
    const parentChildren = req.user.role === "parent" ? req.user.children : [];
    
    // Kinder filtern, die zu diesem Termin gehören
    const relevantParticipants = event.participants.filter((participant) =>
      parentChildren.some((child) => child._id.toString() === participant.playerId._id.toString())
    );

    // Ausgabe mit Teilnahme-Status
    const result = relevantParticipants.map((participant) => ({
      childId: participant.playerId._id,
      name: participant.playerId.name,
      status: participant.status,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Fehler beim Abrufen der Teilnehmer", error: err.message });
  }
});

// Route: Teilnehmer hinzufügen
router.post("/:id/participants", authMiddleware, async (req, res) => {
  try {
    const { playerId, status } = req.body;

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Termin nicht gefunden" });

    // Prüfen, ob der Spieler bereits in der Teilnehmerliste ist
    const existingParticipant = event.participants.find(
      (participant) => participant.playerId.toString() === playerId
    );
    if (existingParticipant) {
      return res.status(400).json({ message: "Spieler ist bereits Teilnehmer" });
    }

    // Teilnehmer hinzufügen
    event.participants.push({ playerId, status });
    await event.save();

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: "Fehler beim Hinzufügen eines Teilnehmers", error: err.message });
  }
});

// Route: Teilnehmerstatus aktualisieren
router.patch("/:id/participants/:playerId", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Termin nicht gefunden" });

    // Teilnehmer suchen
    const participant = event.participants.find(
      (p) => p.playerId.toString() === req.params.playerId
    );
    if (!participant) {
      return res.status(404).json({ message: "Teilnehmer nicht gefunden" });
    }

    // Status aktualisieren
    participant.status = status;
    await event.save();

    res.json(event);
  } catch (err) {
    res.status(500).json({ message: "Fehler beim Aktualisieren des Teilnehmerstatus", error: err.message });
  }
});

// Route: Teilnehmer entfernen
router.delete("/:id/participants/:playerId", authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Termin nicht gefunden" });

    // Teilnehmer entfernen
    const updatedParticipants = event.participants.filter(
      (p) => p.playerId.toString() !== req.params.playerId
    );

    // Teilnehmerliste aktualisieren
    event.participants = updatedParticipants;
    await event.save();

    res.json(event);
  } catch (err) {
    res.status(500).json({ message: "Fehler beim Entfernen eines Teilnehmers", error: err.message });
  }
});

// Route: Einzeltermine für eine Serie abrufen
router.get("/series/:seriesId", authMiddleware, async (req, res) => {
  try {
    const events = await Event.find({ seriesId: req.params.seriesId });
    if (!events.length) {
      return res.status(404).json({ message: "Keine Einzeltermine für diese Serie gefunden" });
    }
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Fehler beim Abrufen der Einzeltermine", error: err.message });
  }
});

module.exports = router;
