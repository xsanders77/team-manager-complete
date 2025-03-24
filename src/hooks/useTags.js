import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import tagService from '../services/tagService';

/**
 * Hook für das Abrufen aller Tags eines Teams
 * @param {string} teamId - ID des Teams
 * @returns {Object} Query-Objekt mit Tag-Daten
 */
export function useTeamTags(teamId) {
  return useQuery({
    queryKey: ['tags', 'team', teamId],
    queryFn: () => tagService.getTagsByTeam(teamId),
    enabled: !!teamId
  });
}

/**
 * Hook für das Erstellen eines neuen Tags
 * @returns {Object} Mutation-Objekt für Tag-Erstellung
 */
export function useCreateTag() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ teamId, tagData }) => tagService.createTag(teamId, tagData),
    onSuccess: (data, variables) => {
      // Nach erfolgreicher Erstellung die Tags-Liste des Teams aktualisieren
      queryClient.invalidateQueries({ queryKey: ['tags', 'team', variables.teamId] });
    }
  });
}

/**
 * Hook für das Löschen eines Tags
 * @returns {Object} Mutation-Objekt für Tag-Löschung
 */
export function useDeleteTag() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ teamId, tagId }) => tagService.deleteTag(teamId, tagId),
    onSuccess: (data, variables) => {
      // Nach erfolgreicher Löschung die Tags-Liste des Teams aktualisieren
      queryClient.invalidateQueries({ queryKey: ['tags', 'team', variables.teamId] });
    }
  });
}

/**
 * Hook für das Zuweisen eines Tags zu Spielern
 * @returns {Object} Mutation-Objekt für Tag-Zuweisung
 */
export function useAssignTagToPlayers() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ teamId, tagId, playerIds }) => 
      tagService.assignTagToPlayers(teamId, tagId, playerIds),
    onSuccess: (data, variables) => {
      // Nach erfolgreicher Zuweisung die Tags-Liste und die betroffenen Spieler aktualisieren
      queryClient.invalidateQueries({ queryKey: ['tags', 'team', variables.teamId] });
      // Für jeden Spieler die Daten aktualisieren
      variables.playerIds.forEach(playerId => {
        queryClient.invalidateQueries({ queryKey: ['player', playerId] });
      });
      // Auch die allgemeine Spielerliste aktualisieren
      queryClient.invalidateQueries({ queryKey: ['players', 'team', variables.teamId] });
    }
  });
}

/**
 * Hook für das Entfernen eines Tags von Spielern
 * @returns {Object} Mutation-Objekt für Tag-Entfernung
 */
export function useRemoveTagFromPlayers() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ teamId, tagId, playerIds }) => 
      tagService.removeTagFromPlayers(teamId, tagId, playerIds),
    onSuccess: (data, variables) => {
      // Nach erfolgreicher Entfernung die Tags-Liste und die betroffenen Spieler aktualisieren
      queryClient.invalidateQueries({ queryKey: ['tags', 'team', variables.teamId] });
      // Für jeden Spieler die Daten aktualisieren
      variables.playerIds.forEach(playerId => {
        queryClient.invalidateQueries({ queryKey: ['player', playerId] });
      });
      // Auch die allgemeine Spielerliste aktualisieren
      queryClient.invalidateQueries({ queryKey: ['players', 'team', variables.teamId] });
    }
  });
}
