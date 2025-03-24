const express = require("express");
const Series = require("../models/Series");
const Event = require("../models/Event"); // Für die Verknüpfung mit Einzelterminen
const router = express.Router();

// Alle Serien abrufen
router.get("/", async (req, res) => {
  try {
    const series = await Series.find();
    res.json(series);
  } catch (err) {
    res.status(500).json({ message: "Fehler beim Abrufen der Serientermine", error: err.message });
  }
});

// Einzelne Serie abrufen
router.get("/:id", async (req, res) => {
  try {
    const series = await Series.findById(req.params.id);
    if (!series) return res.status(404).json({ message: "Serie nicht gefunden" });
    res.json(series);
  } catch (err) {
    res.status(500).json({ message: "Fehler beim Abrufen der Serie", error: err.message });
  }
});

// Serie erstellen
router.post("/", async (req, res) => {
  try {
    const newSeries = new Series(req.body);
    const savedSeries = await newSeries.save();

    // Einzeltermine auf Basis der Serienregel generieren
    const { startDate, endDate, frequency, dayOfWeek } = req.body.repeatRule;
    let currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
      if (frequency === "weekly" && dayOfWeek && currentDate.getDay() !== getDayOfWeek(dayOfWeek)) {
        currentDate.setDate(currentDate.getDate() + 1); // Zum nächsten Tag springen
        continue;
      }

      const newEvent = new Event({
        seriesId: savedSeries._id, // Verweis auf die Serie
        title: req.body.title,
        date: currentDate,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        meetTime: req.body.meetTime,
        location: req.body.location,
        tags: req.body.tags,
        status: "active",
      });

      await newEvent.save();
      currentDate.setDate(currentDate.getDate() + (frequency === "daily" ? 1 : 7));
    }

    res.status(201).json(savedSeries);
  } catch (err) {
    res.status(400).json({ message: "Fehler beim Erstellen der Serie", error: err.message });
  }
});

// Serie aktualisieren
router.put("/:id", async (req, res) => {
  try {
    const updatedSeries = await Series.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedSeries) return res.status(404).json({ message: "Serie nicht gefunden" });
    res.json(updatedSeries);
  } catch (err) {
    res.status(400).json({ message: "Fehler beim Aktualisieren der Serie", error: err.message });
  }
});

// Serie löschen
router.delete("/:id", async (req, res) => {
  try {
    const deletedSeries = await Series.findByIdAndDelete(req.params.id);
    if (!deletedSeries) return res.status(404).json({ message: "Serie nicht gefunden" });

    // Optional: Einzeltermine löschen, die mit der Serie verknüpft sind
    await Event.deleteMany({ seriesId: req.params.id });

    res.json({ message: "Serie erfolgreich gelöscht" });
  } catch (err) {
    res.status(500).json({ message: "Fehler beim Löschen der Serie", error: err.message });
  }
});

// Hilfsfunktion: Wochentage in Zahlen konvertieren
function getDayOfWeek(day) {
  const days = { sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6 };
  return days[day.toLowerCase()];
}

module.exports = router;
