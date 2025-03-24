import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

/**
 * Hook für das Abrufen von Statistiken für das Dashboard
 * @returns {Object} Query-Objekt mit Dashboard-Statistiken
 */
export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const response = await api.get('/dashboard/stats');
      return response.data;
    }
  });
}

/**
 * Hook für das Abrufen von anstehenden Terminen für das Dashboard
 * @param {number} limit - Anzahl der abzurufenden Termine
 * @returns {Object} Query-Objekt mit anstehenden Terminen
 */
export function useUpcomingEvents(limit = 5) {
  return useQuery({
    queryKey: ['dashboard', 'upcoming-events', limit],
    queryFn: async () => {
      const response = await api.get(`/dashboard/upcoming-events?limit=${limit}`);
      return response.data;
    }
  });
}

/**
 * Hook für das Abrufen von Anwesenheitsstatistiken
 * @param {string} userId - ID des Benutzers (optional)
 * @returns {Object} Query-Objekt mit Anwesenheitsstatistiken
 */
export function useAttendanceStats(userId) {
  return useQuery({
    queryKey: ['dashboard', 'attendance', userId],
    queryFn: async () => {
      const url = userId ? `/dashboard/attendance/${userId}` : '/dashboard/attendance';
      const response = await api.get(url);
      return response.data;
    },
    enabled: true
  });
}

/**
 * Hook für das Abrufen von Teamstatistiken für Trainer
 * @param {string} trainerId - ID des Trainers
 * @returns {Object} Query-Objekt mit Teamstatistiken
 */
export function useTrainerTeamStats(trainerId) {
  return useQuery({
    queryKey: ['dashboard', 'trainer', 'teams', trainerId],
    queryFn: async () => {
      const response = await api.get(`/dashboard/trainer/${trainerId}/teams`);
      return response.data;
    },
    enabled: !!trainerId
  });
}

/**
 * Hook für das Abrufen von Benachrichtigungen
 * @param {number} limit - Anzahl der abzurufenden Benachrichtigungen
 * @returns {Object} Query-Objekt mit Benachrichtigungen
 */
export function useNotifications(limit = 10) {
  return useQuery({
    queryKey: ['notifications', limit],
    queryFn: async () => {
      const response = await api.get(`/notifications?limit=${limit}`);
      return response.data;
    }
  });
}

/**
 * Hook für das Markieren einer Benachrichtigung als gelesen
 * @returns {Object} Mutation-Objekt für das Markieren einer Benachrichtigung
 */
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (notificationId) => {
      const response = await api.patch(`/notifications/${notificationId}/read`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });
}

/**
 * Hook für das Markieren aller Benachrichtigungen als gelesen
 * @returns {Object} Mutation-Objekt für das Markieren aller Benachrichtigungen
 */
export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await api.patch('/notifications/read-all');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });
}
