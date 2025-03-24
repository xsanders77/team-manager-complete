import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import seriesService from '../services/seriesService';

/**
 * Hook für das Abrufen aller Serien
 * @returns {Object} Query-Objekt mit Serien-Daten
 */
export function useSeries() {
  return useQuery({
    queryKey: ['series'],
    queryFn: seriesService.getAllSeries
  });
}

/**
 * Hook für das Abrufen einer Serie nach ID
 * @param {string} seriesId - ID der Serie
 * @returns {Object} Query-Objekt mit Serien-Daten
 */
export function useSeriesById(seriesId) {
  return useQuery({
    queryKey: ['series', seriesId],
    queryFn: () => seriesService.getSeriesById(seriesId),
    enabled: !!seriesId
  });
}

/**
 * Hook für das Erstellen einer neuen Serie
 * @returns {Object} Mutation-Objekt für Serien-Erstellung
 */
export function useCreateSeries() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: seriesData => seriesService.createSeries(seriesData),
    onSuccess: () => {
      // Nach erfolgreicher Erstellung die Serien-Liste aktualisieren
      queryClient.invalidateQueries({ queryKey: ['series'] });
    }
  });
}

/**
 * Hook für das Aktualisieren einer Serie
 * @returns {Object} Mutation-Objekt für Serien-Aktualisierung
 */
export function useUpdateSeries() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ seriesId, seriesData }) => seriesService.updateSeries(seriesId, seriesData),
    onSuccess: (data, variables) => {
      // Nach erfolgreicher Aktualisierung die Serien-Liste und die spezifische Serie aktualisieren
      queryClient.invalidateQueries({ queryKey: ['series'] });
      queryClient.invalidateQueries({ queryKey: ['series', variables.seriesId] });
    }
  });
}

/**
 * Hook für das Löschen einer Serie
 * @returns {Object} Mutation-Objekt für Serien-Löschung
 */
export function useDeleteSeries() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: seriesId => seriesService.deleteSeries(seriesId),
    onSuccess: () => {
      // Nach erfolgreicher Löschung die Serien-Liste aktualisieren
      queryClient.invalidateQueries({ queryKey: ['series'] });
      // Auch die Termin-Liste aktualisieren, da Termine der Serie gelöscht werden könnten
      queryClient.invalidateQueries({ queryKey: ['events'] });
    }
  });
}

/**
 * Hook für das Abrufen der Termine einer Serie
 * @param {string} seriesId - ID der Serie
 * @returns {Object} Query-Objekt mit Termin-Daten der Serie
 */
export function useSeriesEvents(seriesId) {
  return useQuery({
    queryKey: ['events', 'series', seriesId],
    queryFn: () => seriesService.getSeriesEvents(seriesId),
    enabled: !!seriesId
  });
}

/**
 * Hook für das Generieren von Terminen basierend auf einer Serie
 * @returns {Object} Mutation-Objekt für Termin-Generierung
 */
export function useGenerateSeriesEvents() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ seriesId, options }) => seriesService.generateSeriesEvents(seriesId, options),
    onSuccess: (data, variables) => {
      // Nach erfolgreicher Generierung die Termin-Listen aktualisieren
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['events', 'series', variables.seriesId] });
    }
  });
}
