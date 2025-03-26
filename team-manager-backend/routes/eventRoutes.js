// eventRoutes.js - Vollständige Datei
const express = require("express");
const Event = require("../models/Event");
const Series = require("../models/Series");
const Team = require("../models/Team");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Route: Neuen Termin erstellen
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { 
      title, type, date, startTime, endTime, meetTime, location, 
      description, teamId, maxParticipants, tags, status 
    } = req.body;
    
    // Validierung
    if (!title || !date || !startTime || !endTime || !location || !teamId) {
      return res.status(400).json({ message: "Alle erforderlichen Felder müssen ausgefüllt sein." });
    }
    
    // Prüfung auf doppelte Termine
    const existingEvent = await Event.findOne({
      title,
      date,
      startTime,
      location,
      teamId
    });
    
    if (existingEvent) {
      return res.status(400).json({ message: "Ein identischer Termin existiert bereits." });
    }
    
    // Neuen Termin erstellen
    const newEvent = new Event({
      title,
      type: type || 'training',
      date,
      startTime,
      endTime,
      meetTime,
      location,
      description,
      teamId,
      maxParticipants: maxParticipants ? parseInt(maxParticipants) : null,
      tags,
      status: status || 'active',
      participants: [],
      createdBy: req.user.userId
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
    const events = await Event.find().populate('teamId', 'name');
    
    // Formatieren der Ergebnisse für das Frontend
    const formattedEvents = events.map(event => ({
      ...event.toObject(),
      team: event.teamId ? event.teamId.name : 'Kein Team'
    }));
    
    res.status(200).json(formattedEvents);
  } catch (err) {
    console.error("Fehler beim Abrufen der Events:", err.message);
    res.status(500).json({ message: "Fehler beim Abrufen der Termine" });
  }
});

// Route: Gefilterte Termine abrufen
router.get("/filtered", authMiddleware, async (req, res) => {
  try {
    let query = {};
    
    // Rollenbasierte Filterung
    if (req.user.role === "trainer") {
      // Trainer sehen Termine ihrer Teams
      const trainerTeams = await Team.find({ trainers: req.user.userId }).select('_id');
      const teamIds = trainerTeams.map(team => team._id);
      query.teamId = { $in: teamIds };
    } else if (req.user.role === "player") {
      // Spieler sehen Termine ihrer Teams
      const playerTeams = await Team.find({ players: req.user.userId }).select('_id');
      const teamIds = playerTeams.map(team => team._id);
      query.teamId = { $in: teamIds };
    } else if (req.user.role === "parent") {
      // Eltern sehen Termine ihrer Kinder
      const childrenIds = req.user.children || [];
      const childrenTeams = await Team.find({ players: { $in: childrenIds } }).select('_id');
      const teamIds = childrenTeams.map(team => team._id);
      query.teamId = { $in: teamIds };
    }
    
    const events = await Event.find(query)
      .populate('teamId', 'name')
      .sort({ date: 1 });
    
    // Formatieren der Ergebnisse für das Frontend
    const formattedEvents = events.map(event => ({
      ...event.toObject(),
      team: event.teamId ? event.teamId.name : 'Kein Team'
    }));
    
    res.status(200).json(formattedEvents);
  } catch (err) {
    console.error("Fehler beim Abrufen der gefilterten Termine:", err.message);
    res.status(500).json({ message: "Fehler beim Abrufen der gefilterten Termine" });
  }
});

// Route: Termine eines Spielers abrufen
router.get("/player/:playerId", authMiddleware, async (req, res) => {
  try {
    const { playerId } = req.params;
    
    // Berechtigungsprüfung
    if (req.user.role !== "admin" && 
        req.user.userId !== playerId && 
        !(req.user.role === "parent" && req.user.children && req.user.children.some(child => child.toString() === playerId))) {
      return res.status(403).json({ message: "Keine Berechtigung für diese Aktion" });
    }
    
    // Teams des Spielers finden
    const playerTeams = await Team.find({ players: playerId }).select('_id');
    const teamIds = playerTeams.map(team => team._id);
    
    // Termine der Teams finden
    const events = await Event.find({ teamId: { $in: teamIds } })
      .populate('teamId', 'name')
      .sort({ date: 1 });
    
    // Formatieren der Ergebnisse für das Frontend
    const formattedEvents = events.map(event => ({
      ...event.toObject(),
      team: event.teamId ? event.teamId.name : 'Kein Team'
    }));
    
    res.status(200).json(formattedEvents);
  } catch (err) {
    console.error("Fehler beim Abrufen der Spieler-Termine:", err.message);
    res.status(500).json({ message: "Fehler beim Abrufen der Spieler-Termine" });
  }
});

// Route: Einzelnen Termin abrufen
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('teamId', 'name');
    if (!event) return res.status(404).json({ message: "Termin nicht gefunden" });
    
    // Formatieren für das Frontend
    const formattedEvent = {
      ...event.toObject(),
      team: event.teamId ? event.teamId.name : 'Kein Team'
    };
    
    res.json(formattedEvent);
  } catch (err) {
    console.error("Fehler beim Abrufen des Termins:", err.message);
    res.status(500).json({ message: "Fehler beim Abrufen des Termins", error: err.message });
  }
});

// Route: Termin bearbeiten
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, type, date, startTime, endTime, meetTime, location, 
      description, teamId, maxParticipants, tags, status 
    } = req.body;
    
    // Validierung
    if (!title || !date || !startTime || !endTime || !location || !teamId) {
      return res.status(400).json({ message: "Alle erforderlichen Felder müssen ausgefüllt sein." });
    }
    
    // Termin aktualisieren
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      {
        title,
        type: type || 'training',
        date,
        startTime,
        endTime,
        meetTime,
        location,
        description,
        teamId,
        maxParticipants: maxParticipants ? parseInt(maxParticipants) : null,
        tags,
        status: status || 'active'
      },
      { new: true }
    ).populate('teamId', 'name');
    
    if (!updatedEvent) {
      return res.status(404).json({ message: "Termin nicht gefunden" });
    }
    
    // Formatieren für das Frontend
    const formattedEvent = {
      ...updatedEvent.toObject(),
      team: updatedEvent.teamId ? updatedEvent.teamId.name : 'Kein Team'
    };
    
    res.status(200).json(formattedEvent);
  } catch (err) {
    console.error("Fehler beim Bearbeiten des Termins:", err.message);
    res.status(500).json({ message: "Fehler beim Bearbeiten des Termins", error: err.message });
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
    const validStatus = ['accepted', 'declined', 'pending'];
    
    if (!playerId) {
      return res.status(400).json({ message: "Spieler-ID ist erforderlich" });
    }
    
    if (status && !validStatus.includes(status)) {
      return res.status(400).json({ message: "Ungültiger Status. Erlaubte Werte: accepted, declined, pending" });
    }
    
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
    event.participants.push({ 
      playerId, 
      status: status || 'pending' 
    });
    
    await event.save();
    
    // Termin mit Teilnehmerdaten zurückgeben
    const populatedEvent = await Event.findById(req.params.id)
      .populate('participants.playerId', 'firstName lastName email');
    
    res.status(201).json(populatedEvent);
  } catch (err) {
    res.status(500).json({ message: "Fehler beim Hinzufügen eines Teilnehmers", error: err.message });
  }
});

// Route: Teilnehmerstatus aktualisieren
router.patch("/:id/participants/:playerId", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatus = ['accepted', 'declined', 'pending'];
    
    if (!status || !validStatus.includes(status)) {
      return res.status(400).json({ message: "Ungültiger Status. Erlaubte Werte: accepted, declined, pending" });
    }
    
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
    
    // Termin mit Teilnehmerdaten zurückgeben
    const populatedEvent = await Event.findById(req.params.id)
      .populate('participants.playerId', 'firstName lastName email');
    
    res.json(populatedEvent);
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
    const events = await Event.find({ seriesId: req.params.seriesId }).populate('teamId', 'name');
    if (!events.length) {
      return res.status(404).json({ message: "Keine Einzeltermine für diese Serie gefunden" });
    }
    
    // Formatieren der Ergebnisse für das Frontend
    const formattedEvents = events.map(event => ({
      ...event.toObject(),
      team: event.teamId ? event.teamId.name : 'Kein Team'
    }));
    
    res.json(formattedEvents);
  } catch (err) {
    res.status(500).json({ message: "Fehler beim Abrufen der Einzeltermine", error: err.message });
  }
});

// Route: Neue Terminserie erstellen
router.post("/series", authMiddleware, async (req, res) => {
  try {
    const { 
      title, type, startTime, endTime, meetTime, location, description, 
      teamId, maxParticipants, tags, repeatType, repeatDays, startDate, endDate 
    } = req.body;
    
    // Validierung
    if (!title || !startTime || !endTime || !location || !teamId || 
        !repeatType || !repeatDays || !startDate || !endDate) {
      return res.status(400).json({ message: "Alle erforderlichen Felder müssen ausgefüllt sein." });
    }
    
    // Neue Serie erstellen
    const newSeries = new Series({
      title,
      type: type || 'training',
      startTime,
      endTime,
      meetTime,
      location,
      description,
      teamId,
      maxParticipants: maxParticipants ? parseInt(maxParticipants) : null,
      tags,
      repeatRule: {
        frequency: repeatType,
        repeatDays,
        startDate,
        endDate
      },
      createdBy: req.user.userId
    });
    
    const savedSeries = await newSeries.save();
    
    // Einzeltermine generieren
    const events = generateEventsFromSeries(savedSeries);
    
    // Einzeltermine speichern
    const savedEvents = await Promise.all(events.map(event => event.save()));
    
    res.status(201).json({
      series: savedSeries,
      events: savedEvents
    });
  } catch (err) {
    console.error("Fehler beim Erstellen der Terminserie:", err.message);
    res.status(500).json({ message: "Fehler beim Erstellen der Terminserie", error: err.message });
  }
});

// Hilfsfunktion zum Generieren von Einzelterminen aus einer Serie
function generateEventsFromSeries(series) {
  const events = [];
  const { startDate, endDate, frequency, repeatDays } = series.repeatRule;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Schleife durch alle Tage zwischen Start- und Enddatum
  for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    const dayOfWeek = date.getDay(); // 0 = Sonntag, 1 = Montag, ...
    
    // Prüfen, ob der aktuelle Tag in den Wiederholungstagen enthalten ist
    if (repeatDays.includes(dayOfWeek === 0 ? 6 : dayOfWeek - 1)) { // Umrechnung auf 0 = Montag, ..., 6 = Sonntag
      // Bei zweiwöchentlicher Wiederholung prüfen, ob es sich um die richtige Woche handelt
      if (frequency === 'biweekly') {
        const weekDiff = Math.floor((date - start) / (7 * 24 * 60 * 60 * 1000));
        if (weekDiff % 2 !== 0) continue;
      }
      
      // Neuen Termin erstellen
      const event = new Event({
        seriesId: series._id,
        title: series.title,
        type: series.type,
        date: new Date(date),
        startTime: series.startTime,
        endTime: series.endTime,
        meetTime: series.meetTime,
        location: series.location,
        description: series.description,
        teamId: series.teamId,
        maxParticipants: series.maxParticipants,
        tags: series.tags,
        status: 'active',
        participants: [],
        createdBy: series.createdBy
      });
      
      events.push(event);
    }
  }
  
  return events;
}

module.exports = router;
