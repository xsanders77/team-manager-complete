import api from './api';

const teamService = {
  /**
   * Alle Teams abrufen
   * @returns {Promise<Array>} - Liste aller Teams
   */
  async getAllTeams() {
    const response = await api.get('/teams');
    return response.data;
  },

  /**
   * Ein Team nach ID abrufen
   * @param {string} teamId - ID des Teams
   * @returns {Promise<Object>} - Teamdaten
   */
  async getTeamById(teamId) {
    const response = await api.get(`/teams/${teamId}`);
    return response.data;
  },

  /**
   * Neues Team erstellen (Admin-Funktion)
   * @param {Object} teamData - Teamdaten (name, ageGroup)
   * @returns {Promise<Object>} - Erstelltes Team
   */
  async createTeam(teamData) {
    // Korrigierter Pfad mit /api/admin statt /admin
    const response = await api.post('/teams', teamData);
    return response.data;
  },

  /**
   * Team aktualisieren (Admin-Funktion)
   * @param {string} teamId - ID des Teams
   * @param {Object} teamData - Aktualisierte Teamdaten
   * @returns {Promise<Object>} - Aktualisiertes Team
   */
  async updateTeam(teamId, teamData) {
    console.log('Übergebene Team-Daten:', teamData);
    // Korrigierter Pfad mit /api/admin statt /admin
    const response = await api.put(`/admin/teams/${teamId}`, teamData);
    return response.data;
  },

  /**
   * Team löschen (Admin-Funktion)
   * @param {string} teamId - ID des Teams
   * @returns {Promise<Object>} - Löschergebnis
   */
  async deleteTeam(teamId) {
    // Korrigierter Pfad mit /api/admin statt /admin
    const response = await api.delete(`/teams/${teamId}`);
    return response.data;
  },

  /**
   * Trainer zu einem Team hinzufügen (Admin-Funktion)
   * @param {string} teamId - ID des Teams
   * @param {string} trainerId - ID des Trainers
   * @returns {Promise<Object>} - Aktualisiertes Team
   */
  async addTrainerToTeam(teamId, trainerId) {
    // Korrigierter Pfad mit /api/admin statt /admin
    const response = await api.post(`/admin/teams/${teamId}/trainers`, { trainerId });
    return response.data;
  },

  /**
   * Spieler zu einem Team hinzufügen (Admin/Trainer-Funktion)
   * @param {string} teamId - ID des Teams
   * @param {string} playerId - ID des Spielers
   * @returns {Promise<Object>} - Aktualisiertes Team
   */
  async addPlayerToTeam(teamId, playerId) {
    // Korrigierter Pfad mit /api/admin statt /admin
    const response = await api.post(`/admin/teams/${teamId}/players`, { playerId });
    return response.data;
  },

  /**
   * Trainer eines Teams aktualisieren (Admin-Funktion)
   * @param {string} teamId - ID des Teams
   * @param {Array} trainerIds - Liste der Trainer-IDs
   * @returns {Promise<Object>} - Aktualisiertes Team
   */
  async updateTeamTrainers(teamId, trainerIds) {
    // Korrigierter Pfad mit /api/admin statt /admin
    const response = await api.put(`/teams/${teamId}/trainers`, { trainerIds });
    return response.data;
  },

  /**
   * Spieler eines Teams aktualisieren (Admin/Trainer-Funktion)
   * @param {string} teamId - ID des Teams
   * @param {Array} playerIds - Liste der Spieler-IDs
   * @returns {Promise<Object>} - Aktualisiertes Team
   */
  async updateTeamPlayers(teamId, playerIds) {
    // Korrigierter Pfad mit /api/admin statt /admin
    const response = await api.put(`/teams/${teamId}/players`, { playerIds });
    return response.data;
  }
};

export default teamService;
