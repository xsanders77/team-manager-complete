# Frontend-Architektur: State-Management-Strategie

Die Team-Manager-App wird eine Kombination aus React Query für serverseitigen State und lokalen State-Management-Lösungen für UI-State verwenden.

## React Query für Server-State

React Query (TanStack Query) ist bereits als Abhängigkeit im Projekt eingerichtet und bietet folgende Vorteile:

- Automatisches Caching von API-Antworten
- Automatische Revalidierung und Aktualisierung
- Optimistische Updates für bessere Benutzerfreundlichkeit
- Einfache Fehlerbehandlung und Ladezustände
- Deduplizierung von Anfragen

### Beispiel für die Einrichtung:

```jsx
// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 Minuten
      cacheTime: 10 * 60 * 1000, // 10 Minuten
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)
```

## API-Service-Struktur

Wir werden eine strukturierte API-Service-Schicht implementieren, um die Kommunikation mit dem Backend zu organisieren:

```
src/
  services/
    api.js             # Basis-Axios-Konfiguration
    authService.js     # Authentifizierungsfunktionen
    teamService.js     # Team-bezogene API-Aufrufe
    playerService.js   # Spieler-bezogene API-Aufrufe
    eventService.js    # Termin-bezogene API-Aufrufe
    tagService.js      # Tag-bezogene API-Aufrufe
    userService.js     # Benutzer-bezogene API-Aufrufe
```

### Beispiel für einen API-Service:

```jsx
// src/services/api.js
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request-Interceptor für das Hinzufügen des Auth-Tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response-Interceptor für die Fehlerbehandlung
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Automatische Abmeldung bei 401-Fehlern (ungültiges Token)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
```

## React Hooks für API-Zugriff

Wir werden benutzerdefinierte Hooks erstellen, die React Query verwenden, um den Zugriff auf die API zu vereinfachen:

```
src/
  hooks/
    useAuth.js         # Authentifizierungshook
    useTeams.js        # Hook für Team-Operationen
    usePlayers.js      # Hook für Spieler-Operationen
    useEvents.js       # Hook für Termin-Operationen
    useTags.js         # Hook für Tag-Operationen
```

### Beispiel für einen benutzerdefinierten Hook:

```jsx
// src/hooks/useEvents.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import eventService from '../services/eventService'

export function useEvents(teamId) {
  return useQuery({
    queryKey: ['events', teamId],
    queryFn: () => eventService.getEventsByTeam(teamId),
    enabled: !!teamId,
  })
}

export function useEvent(eventId) {
  return useQuery({
    queryKey: ['event', eventId],
    queryFn: () => eventService.getEvent(eventId),
    enabled: !!eventId,
  })
}

export function useCreateEvent() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (eventData) => eventService.createEvent(eventData),
    onSuccess: (data, variables) => {
      // Invalidiere die Events-Abfrage, um eine Aktualisierung auszulösen
      queryClient.invalidateQueries(['events', variables.teamId])
    },
  })
}

export function useUpdateEventParticipation() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ eventId, playerId, status }) => 
      eventService.updateParticipation(eventId, playerId, status),
    onSuccess: (data, variables) => {
      // Invalidiere die spezifische Event-Abfrage
      queryClient.invalidateQueries(['event', variables.eventId])
    },
  })
}
```

## Lokaler State

Für UI-spezifischen State, der nicht vom Server abhängt, werden wir React's eingebaute State-Management-Funktionen verwenden:

- `useState` für einfachen, komponentenspezifischen State
- `useReducer` für komplexeren State innerhalb einer Komponente
- `useContext` für State, der über mehrere Komponenten geteilt werden muss

### Beispiel für einen Authentifizierungs-Context:

```jsx
// src/contexts/AuthContext.jsx
import { createContext, useContext, useReducer, useEffect } from 'react'
import authService from '../services/authService'

const AuthContext = createContext()

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
}

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null }
    case 'LOGIN_SUCCESS':
      return { 
        ...state, 
        isAuthenticated: true, 
        user: action.payload, 
        isLoading: false, 
        error: null 
      }
    case 'LOGIN_FAILURE':
      return { 
        ...state, 
        isAuthenticated: false, 
        user: null, 
        isLoading: false, 
        error: action.payload 
      }
    case 'LOGOUT':
      return { 
        ...state, 
        isAuthenticated: false, 
        user: null, 
        isLoading: false, 
        error: null 
      }
    default:
      return state
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)
  
  useEffect(() => {
    // Beim Laden der App prüfen, ob der Benutzer bereits angemeldet ist
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          dispatch({ type: 'LOGOUT' })
          return
        }
        
        const user = await authService.getProfile()
        dispatch({ type: 'LOGIN_SUCCESS', payload: user })
      } catch (error) {
        localStorage.removeItem('token')
        dispatch({ type: 'LOGIN_FAILURE', payload: error.message })
      }
    }
    
    checkAuthStatus()
  }, [])
  
  const login = async (credentials) => {
    dispatch({ type: 'LOGIN_START' })
    try {
      const { token, user } = await authService.login(credentials)
      localStorage.setItem('token', token)
      dispatch({ type: 'LOGIN_SUCCESS', payload: user })
      return user
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error.message })
      throw error
    }
  }
  
  const logout = () => {
    localStorage.removeItem('token')
    dispatch({ type: 'LOGOUT' })
  }
  
  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
```

## Zusammenfassung der State-Management-Strategie

1. **Server-State**: React Query für alle API-Anfragen und serverseitigen Daten
2. **Authentifizierung**: Context API mit useReducer für den Authentifizierungsstatus
3. **UI-State**: useState und useReducer für komponentenspezifischen State
4. **Geteilter State**: Context API für State, der über mehrere Komponenten geteilt werden muss
5. **Formulare**: Lokaler State mit useState oder Formular-Bibliotheken wie Formik oder React Hook Form

Diese Kombination bietet eine optimale Balance zwischen Einfachheit, Leistung und Wartbarkeit für die Team-Manager-App.
