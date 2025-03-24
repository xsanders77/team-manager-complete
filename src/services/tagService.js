import api from './api';

const tagService = {
  /**
   * Alle Tags eines Teams abrufen
   * @param {string} teamId - ID des Teams
   * @returns {Promise<Array>} - Liste aller Tags des Teams
   */
  async getTagsByTeam(teamId) {
    const response = await api.get(`/teams/${teamId}/tags`);
    return response.data;
  },

  /**
   * Neuen Tag erstellen
   * @param {string} teamId - ID des Teams
   * @param {Object} tagData - Tag-Daten (name, description)
   * @returns {Promise<Object>} - Erstellter Tag
   */
  async createTag(teamId, tagData) {
    const response = await api.post(`/teams/${teamId}/tags`, tagData);
    return response.data;
  },

  /**
   * Tag löschen
   * @param {string} teamId - ID des Teams
   * @param {string} tagId - ID des Tags
   * @returns {Promise<Object>} - Löschergebnis
   */
  async deleteTag(teamId, tagId) {
    const response = await api.delete(`/teams/${teamId}/tags/${tagId}`);
    return response.data;
  },

  /**
   * Tags zu Spielern zuweisen
   * @param {string} teamId - ID des Teams
   * @param {string} tagId - ID des Tags
   * @param {Array} playerIds - Liste der Spieler-IDs
   * @returns {Promise<Object>} - Zuweisungsergebnis
   */
  async assignTagToPlayers(teamId, tagId, playerIds) {
    const response = await api.post(`/teams/${teamId}/tags/${tagId}/assign`, { playerIds });
    return response.data;
  },

  /**
   * Tags von Spielern entfernen
   * @param {string} teamId - ID des Teams
   * @param {string} tagId - ID des Tags
   * @param {Array} playerIds - Liste der Spieler-IDs
   * @returns {Promise<Object>} - Entfernungsergebnis
   */
  async removeTagFromPlayers(teamId, tagId, playerIds) {
    const response = await api.post(`/teams/${teamId}/tags/${tagId}/remove`, { playerIds });
    return response.data;
  }
};

export default tagService;
