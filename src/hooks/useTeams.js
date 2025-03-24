import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import teamService from '../services/teamService';

/**
 * Hook für das Abrufen aller Teams
 * @returns {Object} Query-Objekt mit Teams-Daten
 */
export function useTeams() {
  return useQuery({
    queryKey: ['teams'],
    queryFn: teamService.getAllTeams
  });
}

/**
 * Hook für das Abrufen eines Teams nach ID
 * @param {string} teamId - ID des Teams
 * @returns {Object} Query-Objekt mit Team-Daten
 */
export function useTeam(teamId) {
  return useQuery({
    queryKey: ['team', teamId],
    queryFn: () => teamService.getTeamById(teamId),
    enabled: !!teamId
  });
}

/**
 * Hook für das Erstellen eines neuen Teams
 * @returns {Object} Mutation-Objekt für Team-Erstellung
 */
export function useCreateTeam() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: teamData => teamService.createTeam(teamData),
    onSuccess: () => {
      // Nach erfolgreicher Erstellung die Teams-Liste aktualisieren
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    }
  });
}

/**
 * Hook für das Aktualisieren eines Teams
 * @returns {Object} Mutation-Objekt für Team-Aktualisierung
 */
export function useUpdateTeam() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ teamId, teamData }) => teamService.updateTeam(teamId, teamData),
    onSuccess: (data, variables) => {
      // Nach erfolgreicher Aktualisierung die Teams-Liste und das spezifische Team aktualisieren
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['team', variables.teamId] });
    }
  });
}

/**
 * Hook für das Löschen eines Teams
 * @returns {Object} Mutation-Objekt für Team-Löschung
 */
export function useDeleteTeam() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: teamId => teamService.deleteTeam(teamId),
    onSuccess: () => {
      // Nach erfolgreicher Löschung die Teams-Liste aktualisieren
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    }
  });
}

/**
 * Hook für das Hinzufügen eines Trainers zu einem Team
 * @returns {Object} Mutation-Objekt für Trainer-Hinzufügung
 */
export function useAddTrainerToTeam() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ teamId, trainerId }) => teamService.addTrainerToTeam(teamId, trainerId),
    onSuccess: (data, variables) => {
      // Nach erfolgreicher Hinzufügung das Team aktualisieren
      queryClient.invalidateQueries({ queryKey: ['team', variables.teamId] });
    }
  });
}

/**
 * Hook für das Hinzufügen eines Spielers zu einem Team
 * @returns {Object} Mutation-Objekt für Spieler-Hinzufügung
 */
export function useAddPlayerToTeam() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ teamId, playerId }) => teamService.addPlayerToTeam(teamId, playerId),
    onSuccess: (data, variables) => {
      // Nach erfolgreicher Hinzufügung das Team aktualisieren
      queryClient.invalidateQueries({ queryKey: ['team', variables.teamId] });
    }
  });
}

/**
 * Hook für das Aktualisieren der Trainer eines Teams
 * @returns {Object} Mutation-Objekt für Trainer-Aktualisierung
 */
export function useUpdateTeamTrainers() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ teamId, trainerIds }) => teamService.updateTeamTrainers(teamId, trainerIds),
    onSuccess: (data, variables) => {
      // Nach erfolgreicher Aktualisierung das Team aktualisieren
      queryClient.invalidateQueries({ queryKey: ['team', variables.teamId] });
    }
  });
}

/**
 * Hook für das Aktualisieren der Spieler eines Teams
 * @returns {Object} Mutation-Objekt für Spieler-Aktualisierung
 */
export function useUpdateTeamPlayers() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ teamId, playerIds }) => teamService.updateTeamPlayers(teamId, playerIds),
    onSuccess: (data, variables) => {
      // Nach erfolgreicher Aktualisierung das Team aktualisieren
      queryClient.invalidateQueries({ queryKey: ['team', variables.teamId] });
    }
  });
}
