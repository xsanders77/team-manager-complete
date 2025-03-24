import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import eventService from '../services/eventService';

/**
 * Hook für das Abrufen aller Termine
 * @returns {Object} Query-Objekt mit Termin-Daten
 */
export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: eventService.getAllEvents
  });
}

/**
 * Hook für das Abrufen gefilterter Termine basierend auf der Benutzerrolle
 * @returns {Object} Query-Objekt mit gefilterten Termin-Daten
 */
export function useFilteredEvents() {
  return useQuery({
    queryKey: ['events', 'filtered'],
    queryFn: eventService.getFilteredEvents
  });
}

/**
 * Hook für das Abrufen eines Termins nach ID
 * @param {string} eventId - ID des Termins
 * @returns {Object} Query-Objekt mit Termin-Daten
 */
export function useEvent(eventId) {
  return useQuery({
    queryKey: ['event', eventId],
    queryFn: () => eventService.getEvent(eventId),
    enabled: !!eventId
  });
}

/**
 * Hook für das Abrufen von Terminen eines Teams
 * @param {string} teamId - ID des Teams
 * @returns {Object} Query-Objekt mit Team-Termin-Daten
 */
export function useTeamEvents(teamId) {
  return useQuery({
    queryKey: ['events', 'team', teamId],
    queryFn: () => eventService.getEventsByTeam(teamId),
    enabled: !!teamId
  });
}

/**
 * Hook für das Erstellen eines neuen Termins
 * @returns {Object} Mutation-Objekt für Termin-Erstellung
 */
export function useCreateEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: eventData => eventService.createEvent(eventData),
    onSuccess: () => {
      // Nach erfolgreicher Erstellung die Termin-Listen aktualisieren
      queryClient.invalidateQueries({ queryKey: ['events'] });
    }
  });
}

/**
 * Hook für das Aktualisieren eines Termins
 * @returns {Object} Mutation-Objekt für Termin-Aktualisierung
 */
export function useUpdateEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ eventId, eventData }) => eventService.updateEvent(eventId, eventData),
    onSuccess: (data, variables) => {
      // Nach erfolgreicher Aktualisierung die Termin-Listen und den spezifischen Termin aktualisieren
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', variables.eventId] });
    }
  });
}

/**
 * Hook für das Löschen eines Termins
 * @returns {Object} Mutation-Objekt für Termin-Löschung
 */
export function useDeleteEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: eventId => eventService.deleteEvent(eventId),
    onSuccess: () => {
      // Nach erfolgreicher Löschung die Termin-Listen aktualisieren
      queryClient.invalidateQueries({ queryKey: ['events'] });
    }
  });
}

/**
 * Hook für das Aktualisieren des Teilnahmestatus
 * @returns {Object} Mutation-Objekt für Teilnahmestatus-Aktualisierung
 */
export function useUpdateParticipation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ eventId, playerId, status }) => 
      eventService.updateParticipation(eventId, playerId, status),
    onSuccess: (data, variables) => {
      // Nach erfolgreicher Aktualisierung den spezifischen Termin aktualisieren
      queryClient.invalidateQueries({ queryKey: ['event', variables.eventId] });
    }
  });
}

/**
 * Hook für das Aktualisieren des Teilnahmestatus eines Kindes (für Eltern)
 * @returns {Object} Mutation-Objekt für Teilnahmestatus-Aktualisierung des Kindes
 */
export function useUpdateChildParticipation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ eventId, childId, status }) => 
      eventService.updateChildParticipation(eventId, childId, status),
    onSuccess: (data, variables) => {
      // Nach erfolgreicher Aktualisierung den spezifischen Termin aktualisieren
      queryClient.invalidateQueries({ queryKey: ['event', variables.eventId] });
    }
  });
}
