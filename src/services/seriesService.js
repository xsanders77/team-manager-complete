import api from './api';

const seriesService = {
  /**
   * Alle Serien abrufen
   * @returns {Promise<Array>} - Liste aller Serien
   */
  async getAllSeries() {
    const response = await api.get('/series');
    return response.data;
  },

  /**
   * Serie nach ID abrufen
   * @param {string} seriesId - ID der Serie
   * @returns {Promise<Object>} - Seriendaten
   */
  async getSeriesById(seriesId) {
    const response = await api.get(`/series/${seriesId}`);
    return response.data;
  },

  /**
   * Neue Serie erstellen
   * @param {Object} seriesData - Seriendaten (title, startDate, endDate, frequency, etc.)
   * @returns {Promise<Object>} - Erstellte Serie
   */
  async createSeries(seriesData) {
    const response = await api.post('/series', seriesData);
    return response.data;
  },

  /**
   * Serie aktualisieren
   * @param {string} seriesId - ID der Serie
   * @param {Object} seriesData - Aktualisierte Seriendaten
   * @returns {Promise<Object>} - Aktualisierte Serie
   */
  async updateSeries(seriesId, seriesData) {
    const response = await api.put(`/series/${seriesId}`, seriesData);
    return response.data;
  },

  /**
   * Serie löschen
   * @param {string} seriesId - ID der Serie
   * @returns {Promise<Object>} - Löschergebnis
   */
  async deleteSeries(seriesId) {
    const response = await api.delete(`/series/${seriesId}`);
    return response.data;
  },

  /**
   * Termine einer Serie abrufen
   * @param {string} seriesId - ID der Serie
   * @returns {Promise<Array>} - Liste der Termine der Serie
   */
  async getSeriesEvents(seriesId) {
    const response = await api.get(`/series/${seriesId}/events`);
    return response.data;
  },

  /**
   * Termine basierend auf einer Serie generieren
   * @param {string} seriesId - ID der Serie
   * @param {Object} options - Optionen für die Generierung (startDate, endDate, count)
   * @returns {Promise<Array>} - Liste der generierten Termine
   */
  async generateSeriesEvents(seriesId, options) {
    const response = await api.post(`/series/${seriesId}/generate`, options);
    return response.data;
  }
};

export default seriesService;
