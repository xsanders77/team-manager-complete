import api from './api';

const playerService = {
  /**
   * Alle Spieler abrufen
   * @returns {Promise<Array>} - Liste aller Spieler
   */
  async getAllPlayers() {
    const response = await api.get('/players');
    return response.data;
  },

  /**
   * Spieler nach ID abrufen
   * @param {string} playerId - ID des Spielers
   * @returns {Promise<Object>} - Spielerdaten
   */
  async getPlayerById(playerId) {
    const response = await api.get(`/players/${playerId}`);
    return response.data;
  },

  /**
   * Spieler eines Teams abrufen
   * @param {string} teamId - ID des Teams
   * @returns {Promise<Array>} - Liste der Spieler im Team
   */
  async getPlayersByTeam(teamId) {
    const response = await api.get(`/teams/${teamId}/players`);
    return response.data;
  },

  /**
   * Neuen Spieler erstellen
   * @param {Object} playerData - Spielerdaten (name, birthdate, etc.)
   * @returns {Promise<Object>} - Erstellter Spieler
   */
  async createPlayer(playerData) {
    const response = await api.post('/players', playerData);
    return response.data;
  },

  /**
   * Spieler aktualisieren
   * @param {string} playerId - ID des Spielers
   * @param {Object} playerData - Aktualisierte Spielerdaten
   * @returns {Promise<Object>} - Aktualisierter Spieler
   */
  async updatePlayer(playerId, playerData) {
    const response = await api.put(`/players/${playerId}`, playerData);
    return response.data;
  },

  /**
   * Spieler löschen
   * @param {string} playerId - ID des Spielers
   * @returns {Promise<Object>} - Löschergebnis
   */
  async deletePlayer(playerId) {
    const response = await api.delete(`/players/${playerId}`);
    return response.data;
  },

  /**
   * Kinder eines Elternteils abrufen
   * @param {string} parentId - ID des Elternteils
   * @returns {Promise<Array>} - Liste der Kinder
   */
  async getChildrenByParent(parentId) {
    const response = await api.get(`/parents/${parentId}/children`);
    return response.data;
  },

  /**
   * Tags zu einem Spieler hinzufügen
   * @param {string} playerId - ID des Spielers
   * @param {Array} tags - Liste der Tags
   * @returns {Promise<Object>} - Aktualisierter Spieler
   */
  async addTagsToPlayer(playerId, tags) {
    const response = await api.post(`/players/${playerId}/tags`, { tags });
    return response.data;
  },

  /**
   * Tags von einem Spieler entfernen
   * @param {string} playerId - ID des Spielers
   * @param {Array} tags - Liste der zu entfernenden Tags
   * @returns {Promise<Object>} - Aktualisierter Spieler
   */
  async removeTagsFromPlayer(playerId, tags) {
    const response = await api.delete(`/players/${playerId}/tags`, { data: { tags } });
    return response.data;
  }
};

export default playerService;
