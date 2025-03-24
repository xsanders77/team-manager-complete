import { useQuery } from '@tanstack/react-query';
import eventService from '../services/eventService';

/**
 * Hook für das Abrufen von Spieler-spezifischen Terminen
 * @param {string} playerId - ID des Spielers
 * @returns {Object} Query-Objekt mit Spieler-Termin-Daten
 */
export function usePlayerEvents(playerId) {
  return useQuery({
    queryKey: ['events', 'player', playerId],
    queryFn: () => eventService.getEventsByPlayer(playerId),
    enabled: !!playerId
  });
}
