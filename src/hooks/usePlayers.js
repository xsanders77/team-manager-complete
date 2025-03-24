import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import playerService from '../services/playerService';

/**
 * Hook für das Abrufen aller Spieler
 * @returns {Object} Query-Objekt mit Spieler-Daten
 */
export function usePlayers() {
  return useQuery({
    queryKey: ['players'],
    queryFn: playerService.getAllPlayers
  });
}

/**
 * Hook für das Abrufen eines Spielers nach ID
 * @param {string} playerId - ID des Spielers
 * @returns {Object} Query-Objekt mit Spieler-Daten
 */
export function usePlayer(playerId) {
  return useQuery({
    queryKey: ['player', playerId],
    queryFn: () => playerService.getPlayerById(playerId),
    enabled: !!playerId
  });
}

/**
 * Hook für das Abrufen von Spielern eines Teams
 * @param {string} teamId - ID des Teams
 * @returns {Object} Query-Objekt mit Team-Spieler-Daten
 */
export function useTeamPlayers(teamId) {
  return useQuery({
    queryKey: ['players', 'team', teamId],
    queryFn: () => playerService.getPlayersByTeam(teamId),
    enabled: !!teamId
  });
}

/**
 * Hook für das Erstellen eines neuen Spielers
 * @returns {Object} Mutation-Objekt für Spieler-Erstellung
 */
export function useCreatePlayer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: playerData => playerService.createPlayer(playerData),
    onSuccess: () => {
      // Nach erfolgreicher Erstellung die Spieler-Liste aktualisieren
      queryClient.invalidateQueries({ queryKey: ['players'] });
    }
  });
}

/**
 * Hook für das Aktualisieren eines Spielers
 * @returns {Object} Mutation-Objekt für Spieler-Aktualisierung
 */
export function useUpdatePlayer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ playerId, playerData }) => playerService.updatePlayer(playerId, playerData),
    onSuccess: (data, variables) => {
      // Nach erfolgreicher Aktualisierung die Spieler-Liste und den spezifischen Spieler aktualisieren
      queryClient.invalidateQueries({ queryKey: ['players'] });
      queryClient.invalidateQueries({ queryKey: ['player', variables.playerId] });
    }
  });
}

/**
 * Hook für das Löschen eines Spielers
 * @returns {Object} Mutation-Objekt für Spieler-Löschung
 */
export function useDeletePlayer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: playerId => playerService.deletePlayer(playerId),
    onSuccess: () => {
      // Nach erfolgreicher Löschung die Spieler-Liste aktualisieren
      queryClient.invalidateQueries({ queryKey: ['players'] });
    }
  });
}

/**
 * Hook für das Abrufen der Kinder eines Elternteils
 * @param {string} parentId - ID des Elternteils
 * @returns {Object} Query-Objekt mit Kinder-Daten
 */
export function useParentChildren(parentId) {
  return useQuery({
    queryKey: ['children', 'parent', parentId],
    queryFn: () => playerService.getChildrenByParent(parentId),
    enabled: !!parentId
  });
}

/**
 * Hook für das Hinzufügen von Tags zu einem Spieler
 * @returns {Object} Mutation-Objekt für Tag-Hinzufügung
 */
export function useAddTagsToPlayer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ playerId, tags }) => playerService.addTagsToPlayer(playerId, tags),
    onSuccess: (data, variables) => {
      // Nach erfolgreicher Hinzufügung den spezifischen Spieler aktualisieren
      queryClient.invalidateQueries({ queryKey: ['player', variables.playerId] });
    }
  });
}

/**
 * Hook für das Entfernen von Tags von einem Spieler
 * @returns {Object} Mutation-Objekt für Tag-Entfernung
 */
export function useRemoveTagsFromPlayer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ playerId, tags }) => playerService.removeTagsFromPlayer(playerId, tags),
    onSuccess: (data, variables) => {
      // Nach erfolgreicher Entfernung den spezifischen Spieler aktualisieren
      queryClient.invalidateQueries({ queryKey: ['player', variables.playerId] });
    }
  });
}
