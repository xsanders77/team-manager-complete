import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import userService from '../services/userService';

/**
 * Hook für das Abrufen aller Benutzer (Admin-Funktion)
 * @returns {Object} Query-Objekt mit Benutzer-Daten
 */
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: userService.getAllUsers
  });
}

/**
 * Hook für das Abrufen eines Benutzers nach ID
 * @param {string} userId - ID des Benutzers
 * @returns {Object} Query-Objekt mit Benutzer-Daten
 */
export function useUser(userId) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => userService.getUserById(userId),
    enabled: !!userId
  });
}

/**
 * Hook für das Erstellen eines neuen Benutzers (Admin-Funktion)
 * @returns {Object} Mutation-Objekt für Benutzer-Erstellung
 */
export function useCreateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userData => userService.createUser(userData),
    onSuccess: () => {
      // Nach erfolgreicher Erstellung die Benutzer-Liste aktualisieren
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
}

/**
 * Hook für das Aktualisieren eines Benutzers
 * @returns {Object} Mutation-Objekt für Benutzer-Aktualisierung
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, userData }) => userService.updateUser(userId, userData),
    onSuccess: (data, variables) => {
      // Nach erfolgreicher Aktualisierung die Benutzer-Liste und den spezifischen Benutzer aktualisieren
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.userId] });
    }
  });
}

/**
 * Hook für das Löschen eines Benutzers (Admin-Funktion)
 * @returns {Object} Mutation-Objekt für Benutzer-Löschung
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userId => userService.deleteUser(userId),
    onSuccess: () => {
      // Nach erfolgreicher Löschung die Benutzer-Liste aktualisieren
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
}

/**
 * Hook für das Ändern des Passworts
 * @returns {Object} Mutation-Objekt für Passwort-Änderung
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: ({ userId, passwordData }) => userService.changePassword(userId, passwordData)
  });
}

/**
 * Hook für das Ändern der Benutzerrolle (Admin-Funktion)
 * @returns {Object} Mutation-Objekt für Rollen-Änderung
 */
export function useChangeRole() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, role }) => userService.changeRole(userId, role),
    onSuccess: (data, variables) => {
      // Nach erfolgreicher Änderung die Benutzer-Liste und den spezifischen Benutzer aktualisieren
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.userId] });
    }
  });
}
