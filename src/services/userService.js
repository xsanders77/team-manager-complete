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
   * Einen Benutzer nach ID abrufen
   * @param {string} userId - ID des Benutzers
   * @returns {Promise<Object>} - Benutzerdaten
   */
  async getUserById(userId) {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  /**
   * Neuen Benutzer erstellen (Admin-Funktion)
   * @param {Object} userData - Benutzerdaten (firstName, lastName, email, password, role)
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
   * @param {Object} passwordData - Passwortdaten (currentPassword, newPassword)
   * @returns {Promise<Object>} - Ergebnis der Passwortänderung
   */
  async changePassword(userId, passwordData) {
    const response = await api.put(`/users/${userId}/password`, passwordData);
    return response.data;
  },

  /**
   * Benutzerrolle ändern (Admin-Funktion)
   * @param {string} userId - ID des Benutzers
   * @param {string} role - Neue Rolle (admin, trainer, player, parent)
   * @returns {Promise<Object>} - Aktualisierter Benutzer
   */
  async changeRole(userId, role) {
    const response = await api.put(`/users/${userId}/role`, { role });
    return response.data;
  },

  /**
   * Eigenes Profil abrufen
   * @returns {Promise<Object>} - Eigene Benutzerdaten
   */
  async getProfile() {
    const response = await api.get('/users/profile');
    return response.data;
  },

  /**
   * Eigenes Profil aktualisieren
   * @param {Object} profileData - Aktualisierte Profildaten
   * @returns {Promise<Object>} - Aktualisiertes Profil
   */
  async updateProfile(profileData) {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  }
};

export default userService;
