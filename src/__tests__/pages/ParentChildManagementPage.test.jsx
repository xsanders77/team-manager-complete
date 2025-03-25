import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ParentChildManagementPage from '../../pages/ParentChildManagementPage';
import { useAuth } from '../../contexts/AuthContext';
import { useParentChildren, useCreatePlayer, useDeletePlayer } from '../../hooks/usePlayers';
import { useTeams } from '../../hooks/useTeams';

// Mock der Hooks
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: jest.fn()
}));

jest.mock('../../hooks/usePlayers', () => ({
  useParentChildren: jest.fn(),
  useCreatePlayer: jest.fn(),
  useDeletePlayer: jest.fn()
}));

jest.mock('../../hooks/useTeams', () => ({
  useTeams: jest.fn()
}));

// Test-Setup
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithProviders = (ui) => {
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};

describe('ParentChildManagementPage', () => {
  beforeEach(() => {
    // Mock-Daten zurücksetzen
    useAuth.mockReturnValue({
      user: { _id: 'parent123', name: 'Test Parent' }
    });
    
    useParentChildren.mockReturnValue({
      data: [
        { 
          _id: 'child1', 
          name: 'Test Child 1', 
          birthdate: '2015-05-15',
          team: 'Team A'
        }
      ],
      isLoading: false,
      error: null
    });
    
    useTeams.mockReturnValue({
      data: [
        { _id: 'team1', name: 'Team A' },
        { _id: 'team2', name: 'Team B' }
      ]
    });
    
    const mutateAsync = jest.fn().mockResolvedValue({});
    useCreatePlayer.mockReturnValue({
      mutateAsync,
      isPending: false
    });
    
    useDeletePlayer.mockReturnValue({
      mutateAsync: jest.fn().mockResolvedValue({}),
      isPending: false
    });
  });

  test('rendert die Komponente korrekt mit Kinderdaten', () => {
    renderWithProviders(<ParentChildManagementPage />);
    
    // Überprüfen, ob die Überschrift angezeigt wird
    expect(screen.getByText('Meine Kinder')).toBeInTheDocument();
    
    // Überprüfen, ob das Kind angezeigt wird
    expect(screen.getByText('Test Child 1')).toBeInTheDocument();
    
    // Überprüfen, ob der "Kind hinzufügen"-Button angezeigt wird
    expect(screen.getByText('Kind hinzufügen')).toBeInTheDocument();
  });

  test('zeigt das Formular zum Hinzufügen eines Kindes an, wenn der Button geklickt wird', () => {
    renderWithProviders(<ParentChildManagementPage />);
    
    // Auf den "Kind hinzufügen"-Button klicken
    fireEvent.click(screen.getByText('Kind hinzufügen'));
    
    // Überprüfen, ob das Formular angezeigt wird
    expect(screen.getByText('Kind hinzufügen', { selector: 'div.card__header' })).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Geburtsdatum')).toBeInTheDocument();
    expect(screen.getByLabelText('Team')).toBeInTheDocument();
  });

  test('validiert das Formular und zeigt Fehlermeldungen an', async () => {
    renderWithProviders(<ParentChildManagementPage />);
    
    // Auf den "Kind hinzufügen"-Button klicken
    fireEvent.click(screen.getByText('Kind hinzufügen'));
    
    // Formular absenden ohne Daten einzugeben
    fireEvent.click(screen.getByText('Kind hinzufügen', { selector: 'button[type="submit"]' }));
    
    // Überprüfen, ob die Fehlermeldung angezeigt wird
    await waitFor(() => {
      expect(screen.getByText('Bitte füllen Sie alle Pflichtfelder aus.')).toBeInTheDocument();
    });
  });

  test('fügt ein neues Kind hinzu, wenn das Formular korrekt ausgefüllt wird', async () => {
    const mutateAsync = jest.fn().mockResolvedValue({});
    useCreatePlayer.mockReturnValue({
      mutateAsync,
      isPending: false
    });
    
    renderWithProviders(<ParentChildManagementPage />);
    
    // Auf den "Kind hinzufügen"-Button klicken
    fireEvent.click(screen.getByText('Kind hinzufügen'));
    
    // Formular ausfüllen
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Neues Kind' } });
    fireEvent.change(screen.getByLabelText('Geburtsdatum'), { target: { value: '2018-03-15' } });
    fireEvent.change(screen.getByLabelText('Team'), { target: { value: 'team1' } });
    
    // Formular absenden
    fireEvent.click(screen.getByText('Kind hinzufügen', { selector: 'button[type="submit"]' }));
    
    // Überprüfen, ob die Mutation aufgerufen wurde
    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Neues Kind',
        birthdate: '2018-03-15',
        teamId: 'team1',
        parentId: 'parent123'
      }));
    });
    
    // Überprüfen, ob die Erfolgsmeldung angezeigt wird
    await waitFor(() => {
      expect(screen.getByText('Kind "Neues Kind" wurde erfolgreich hinzugefügt.')).toBeInTheDocument();
    });
  });

  test('entfernt ein Kind, wenn der Entfernen-Button geklickt wird', async () => {
    const deletePlayerMutateAsync = jest.fn().mockResolvedValue({});
    useDeletePlayer.mockReturnValue({
      mutateAsync: deletePlayerMutateAsync,
      isPending: false
    });
    
    renderWithProviders(<ParentChildManagementPage />);
    
    // Auf den "Entfernen"-Button klicken
    fireEvent.click(screen.getByText('Entfernen'));
    
    // Überprüfen, ob die Mutation aufgerufen wurde
    await waitFor(() => {
      expect(deletePlayerMutateAsync).toHaveBeenCalledWith('child1');
    });
    
    // Überprüfen, ob die Erfolgsmeldung angezeigt wird
    await waitFor(() => {
      expect(screen.getByText('Kind wurde erfolgreich entfernt.')).toBeInTheDocument();
    });
  });

  test('zeigt eine Nachricht an, wenn keine Kinder vorhanden sind', () => {
    useParentChildren.mockReturnValue({
      data: [],
      isLoading: false,
      error: null
    });
    
    renderWithProviders(<ParentChildManagementPage />);
    
    // Überprüfen, ob die "Keine Kinder"-Nachricht angezeigt wird
    expect(screen.getByText('Sie haben noch keine Kinder hinzugefügt.')).toBeInTheDocument();
  });

  test('zeigt eine Ladeanimation an, während die Daten geladen werden', () => {
    useParentChildren.mockReturnValue({
      isLoading: true
    });
    
    renderWithProviders(<ParentChildManagementPage />);
    
    // Überprüfen, ob die Ladeanimation angezeigt wird
    expect(screen.getByText('Lade Kinder...')).toBeInTheDocument();
  });

  test('zeigt eine Fehlermeldung an, wenn ein Fehler auftritt', () => {
    useParentChildren.mockReturnValue({
      isLoading: false,
      error: { message: 'Fehler beim Laden der Daten' }
    });
    
    renderWithProviders(<ParentChildManagementPage />);
    
    // Überprüfen, ob die Fehlermeldung angezeigt wird
    expect(screen.getByText('Fehler beim Laden der Kinder: Fehler beim Laden der Daten')).toBeInTheDocument();
  });
});
