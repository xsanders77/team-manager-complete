import api from '../services/api';

const notificationService = {
  /**
   * Alle Benachrichtigungen abrufen
   * @param {number} limit - Anzahl der abzurufenden Benachrichtigungen
   * @returns {Promise<Array>} - Liste der Benachrichtigungen
   */
  async getNotifications(limit = 10) {
    const response = await api.get(`/notifications?limit=${limit}`);
    return response.data;
  },

  /**
   * Benachrichtigung als gelesen markieren
   * @param {string} notificationId - ID der Benachrichtigung
   * @returns {Promise<Object>} - Aktualisierte Benachrichtigung
   */
  async markAsRead(notificationId) {
    const response = await api.patch(`/notifications/${notificationId}/read`);
    return response.data;
  },

  /**
   * Alle Benachrichtigungen als gelesen markieren
   * @returns {Promise<Object>} - Ergebnis der Operation
   */
  async markAllAsRead() {
    const response = await api.patch('/notifications/read-all');
    return response.data;
  },

  /**
   * Benachrichtigung löschen
   * @param {string} notificationId - ID der Benachrichtigung
   * @returns {Promise<Object>} - Ergebnis der Löschoperation
   */
  async deleteNotification(notificationId) {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  },

  /**
   * Alle Benachrichtigungen löschen
   * @returns {Promise<Object>} - Ergebnis der Löschoperation
   */
  async deleteAllNotifications() {
    const response = await api.delete('/notifications/all');
    return response.data;
  }
};

export default notificationService;
