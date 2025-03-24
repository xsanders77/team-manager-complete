import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import notificationService from '../services/notificationService';

/**
 * Hook für das Abrufen von Benachrichtigungen
 * @param {number} limit - Anzahl der abzurufenden Benachrichtigungen
 * @returns {Object} Query-Objekt mit Benachrichtigungen
 */
export function useNotifications(limit = 10) {
  return useQuery({
    queryKey: ['notifications', limit],
    queryFn: () => notificationService.getNotifications(limit)
  });
}

/**
 * Hook für das Markieren einer Benachrichtigung als gelesen
 * @returns {Object} Mutation-Objekt für das Markieren einer Benachrichtigung
 */
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (notificationId) => notificationService.markAsRead(notificationId),
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
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });
}

/**
 * Hook für das Löschen einer Benachrichtigung
 * @returns {Object} Mutation-Objekt für das Löschen einer Benachrichtigung
 */
export function useDeleteNotification() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (notificationId) => notificationService.deleteNotification(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });
}

/**
 * Hook für das Löschen aller Benachrichtigungen
 * @returns {Object} Mutation-Objekt für das Löschen aller Benachrichtigungen
 */
export function useDeleteAllNotifications() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => notificationService.deleteAllNotifications(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });
}
