# Build-Anleitung für Team-Manager-App

## Voraussetzungen
- Node.js (Version 16 oder höher)
- npm (Version 7 oder höher)
- MongoDB (für die lokale Entwicklung)

## Frontend-Build

### Entwicklungsumgebung
1. In das Frontend-Verzeichnis wechseln:
   ```
   cd team-manager-phase3
   ```

2. Abhängigkeiten installieren:
   ```
   npm install --legacy-peer-deps
   ```

3. Entwicklungsserver starten:
   ```
   npm run dev
   ```
   Die Anwendung ist dann unter http://localhost:5173 verfügbar.

### Produktions-Build
1. In das Frontend-Verzeichnis wechseln:
   ```
   cd team-manager-phase3
   ```

2. Abhängigkeiten installieren (falls noch nicht geschehen):
   ```
   npm install --legacy-peer-deps
   ```

3. Produktions-Build erstellen:
   ```
   npm run build
   ```
   Die Build-Dateien werden im Verzeichnis `dist` erstellt.

## Backend-Build

1. In das Backend-Verzeichnis wechseln:
   ```
   cd team-manager-phase3/team-manager-backend
   ```

2. Abhängigkeiten installieren:
   ```
   npm install --legacy-peer-deps
   ```

3. Server starten:
   ```
   npm start
   ```
   Der Server läuft dann auf Port 3000.

## Umgebungsvariablen

### Frontend (.env Datei im Frontend-Root-Verzeichnis)
```
VITE_API_URL=http://localhost:3000/api
```

### Backend (.env Datei im Backend-Root-Verzeichnis)
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/team-manager
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
```

## Deployment

### Frontend-Deployment
Die statischen Dateien aus dem `dist`-Verzeichnis können auf jedem Webserver gehostet werden.

### Backend-Deployment
1. Stellen Sie sicher, dass Node.js auf dem Server installiert ist
2. Kopieren Sie die Backend-Dateien auf den Server
3. Installieren Sie die Abhängigkeiten mit `npm install --production`
4. Konfigurieren Sie die Umgebungsvariablen für die Produktionsumgebung
5. Starten Sie den Server mit `npm start` oder verwenden Sie einen Prozessmanager wie PM2

## Hinweise
- Für die Produktionsumgebung sollten Sie einen Reverse-Proxy wie Nginx verwenden
- Stellen Sie sicher, dass die MongoDB-Datenbank entsprechend konfiguriert und gesichert ist
- Verwenden Sie für die Produktionsumgebung sichere JWT-Secrets
