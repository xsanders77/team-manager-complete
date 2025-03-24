import api from './api';

const userService = {
  /**
   * Alle Benutzer abrufen (Admin-Funktion)
   * @returns {Promise<Array>} - Liste aller Benutzer
   */
  async getAllUsers() {
    const response = await api.get('/users');
    return response.data;
  },

  /**
   * Benutzer nach ID abrufen
   * @param {string} userId - ID des Benutzers
   * @returns {Promise<Object>} - Benutzerdaten
   */
  async getUserById(userId) {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  /**
   * Neuen Benutzer erstellen (Admin-Funktion)
   * @param {Object} userData - Benutzerdaten (name, email, password, role)
   * @returns {Promise<Object>} - Erstellter Benutzer
   */
  async createUser(userData) {
    const response = await api.post('/users', userData);
    return response.data;
  },

  /**
   * Benutzer aktualisieren
   * @param {string} userId - ID des Benutzers
   * @param {Object} userData - Aktualisierte Benutzerdaten
   * @returns {Promise<Object>} - Aktualisierter Benutzer
   */
  async updateUser(userId, userData) {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  },

  /**
   * Benutzer löschen (Admin-Funktion)
   * @param {string} userId - ID des Benutzers
   * @returns {Promise<Object>} - Löschergebnis
   */
  async deleteUser(userId) {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },

  /**
   * Passwort ändern
   * @param {string} userId - ID des Benutzers
   * @param {Object} passwordData - Altes und neues Passwort
   * @returns {Promise<Object>} - Änderungsergebnis
   */
  async changePassword(userId, passwordData) {
    const response = await api.put(`/users/${userId}/password`, passwordData);
    return response.data;
  },

  /**
   * Benutzerrolle ändern (Admin-Funktion)
   * @param {string} userId - ID des Benutzers
   * @param {string} role - Neue Rolle
   * @returns {Promise<Object>} - Aktualisierter Benutzer
   */
  async changeRole(userId, role) {
    const response = await api.put(`/users/${userId}/role`, { role });
    return response.data;
  }
};

export default userService;
