import api from './api';

const eventService = {
  /**
   * Alle Termine abrufen
   * @returns {Promise<Array>} - Liste aller Termine
   */
  async getAllEvents() {
    const response = await api.get('/events');
    return response.data;
  },

  /**
   * Termine gefiltert nach Benutzerrolle abrufen
   * @returns {Promise<Array>} - Liste der gefilterten Termine
   */
  async getFilteredEvents() {
    const response = await api.get('/events/filtered');
    return response.data;
  },

  /**
   * Termin nach ID abrufen
   * @param {string} eventId - ID des Termins
   * @returns {Promise<Object>} - Termindaten
   */
  async getEvent(eventId) {
    const response = await api.get(`/events/${eventId}`);
    return response.data;
  },

  /**
   * Termine eines Teams abrufen
   * @param {string} teamId - ID des Teams
   * @returns {Promise<Array>} - Liste der Termine des Teams
   */
  async getEventsByTeam(teamId) {
    const response = await api.get(`/teams/${teamId}/events`);
    return response.data;
  },

  /**
   * Neuen Termin erstellen
   * @param {Object} eventData - Termindaten (title, date, startTime, endTime, location, etc.)
   * @returns {Promise<Object>} - Erstellter Termin
   */
  async createEvent(eventData) {
    const response = await api.post('/events', eventData);
    return response.data;
  },

  /**
   * Termin aktualisieren
   * @param {string} eventId - ID des Termins
   * @param {Object} eventData - Aktualisierte Termindaten
   * @returns {Promise<Object>} - Aktualisierter Termin
   */
  async updateEvent(eventId, eventData) {
    const response = await api.put(`/events/${eventId}`, eventData);
    return response.data;
  },

  /**
   * Termin löschen
   * @param {string} eventId - ID des Termins
   * @returns {Promise<Object>} - Löschergebnis
   */
  async deleteEvent(eventId) {
    const response = await api.delete(`/events/${eventId}`);
    return response.data;
  },

  /**
   * Teilnehmer zu einem Termin hinzufügen
   * @param {string} eventId - ID des Termins
   * @param {string} playerId - ID des Spielers
   * @returns {Promise<Object>} - Aktualisierter Termin
   */
  async addParticipant(eventId, playerId) {
    const response = await api.post(`/events/${eventId}/participants`, { playerId });
    return response.data;
  },

  /**
   * Teilnehmer von einem Termin entfernen
   * @param {string} eventId - ID des Termins
   * @param {string} playerId - ID des Spielers
   * @returns {Promise<Object>} - Aktualisierter Termin
   */
  async removeParticipant(eventId, playerId) {
    const response = await api.delete(`/events/${eventId}/participants/${playerId}`);
    return response.data;
  },

  /**
   * Teilnahmestatus aktualisieren
   * @param {string} eventId - ID des Termins
   * @param {string} playerId - ID des Spielers
   * @param {string} status - Neuer Status (accepted, declined, pending)
   * @returns {Promise<Object>} - Aktualisierter Teilnahmestatus
   */
  async updateParticipation(eventId, playerId, status) {
    const response = await api.patch(`/events/${eventId}/participants/${playerId}`, { status });
    return response.data;
  },

  /**
   * Teilnahmestatus für Kind aktualisieren (Eltern-Funktion)
   * @param {string} eventId - ID des Termins
   * @param {string} childId - ID des Kindes
   * @param {string} status - Neuer Status (accepted, declined, pending)
   * @returns {Promise<Object>} - Aktualisierter Teilnahmestatus
   */
  async updateChildParticipation(eventId, childId, status) {
    const response = await api.patch(`/events/${eventId}/participants/${childId}`, { status });
    return response.data;
  }
};

export default eventService;