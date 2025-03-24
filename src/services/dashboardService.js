import api from './api';

const dashboardService = {
  /**
   * Dashboard-Statistiken abrufen
   * @returns {Promise<Object>} - Dashboard-Statistiken
   */
  async getStats() {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  /**
   * Anstehende Termine für das Dashboard abrufen
   * @param {number} limit - Anzahl der abzurufenden Termine
   * @returns {Promise<Array>} - Liste der anstehenden Termine
   */
  async getUpcomingEvents(limit = 5) {
    const response = await api.get(`/dashboard/upcoming-events?limit=${limit}`);
    return response.data;
  },

  /**
   * Anwesenheitsstatistiken abrufen
   * @param {string} userId - ID des Benutzers (optional)
   * @returns {Promise<Object>} - Anwesenheitsstatistiken
   */
  async getAttendanceStats(userId) {
    const url = userId ? `/dashboard/attendance/${userId}` : '/dashboard/attendance';
    const response = await api.get(url);
    return response.data;
  },

  /**
   * Teamstatistiken für Trainer abrufen
   * @param {string} trainerId - ID des Trainers
   * @returns {Promise<Object>} - Teamstatistiken
   */
  async getTrainerTeamStats(trainerId) {
    const response = await api.get(`/dashboard/trainer/${trainerId}/teams`);
    return response.data;
  }
};

export default dashboardService;
