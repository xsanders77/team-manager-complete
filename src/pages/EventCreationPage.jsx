import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Alert from '../components/ui/Alert';
import { useAuth } from '../hooks/useAuth';
import { useCreateEvent } from '../hooks/useEvents';
import { useTeams } from '../hooks/useTeams';
import './EventCreationPage.css';

/**
 * EventCreationPage - Seite zur Erstellung von Einzel- und Serienterminen (Trainer-Rolle)
 * 
 * @returns {JSX.Element} EventCreationPage-Komponente
 */
const EventCreationPage = () => {
  const { user } = useAuth();
  const { data: teams = [] } = useTeams();
  const createEventMutation = useCreateEvent();
  
  const [eventType, setEventType] = useState('single'); // 'single' oder 'series'
  const [notification, setNotification] = useState(null);
  
  const [eventData, setEventData] = useState({
    title: '',
    type: 'training', // 'training' oder 'match'
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    description: '',
    teamId: user?.teamId || '',
    maxParticipants: '',
    // Nur für Serientermine
    repeatType: 'weekly', // 'weekly' oder 'biweekly'
    repeatUntil: '',
    repeatDays: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (day) => {
    const currentDays = [...eventData.repeatDays];
    if (currentDays.includes(day)) {
      const updatedDays = currentDays.filter(d => d !== day);
      setEventData(prev => ({
        ...prev,
        repeatDays: updatedDays
      }));
    } else {
      setEventData(prev => ({
        ...prev,
        repeatDays: [...currentDays, day]
      }));
    }
  };

  const validateForm = () => {
    // Validierung für alle Termintypen
    if (!eventData.title || !eventData.date || !eventData.startTime || 
        !eventData.endTime || !eventData.location || !eventData.teamId) {
      setNotification({
        type: 'error',
        message: 'Bitte füllen Sie alle Pflichtfelder aus.'
      });
      return false;
    }

    // Zusätzliche Validierung für Serientermine
    if (eventType === 'series') {
      if (!eventData.repeatUntil) {
        setNotification({
          type: 'error',
          message: 'Bitte geben Sie ein Enddatum für die Terminserie an.'
        });
        return false;
      }
      if (eventData.repeatDays.length === 0) {
        setNotification({
          type: 'error',
          message: 'Bitte wählen Sie mindestens einen Wochentag für die Wiederholung aus.'
        });
        return false;
      }
      if (new Date(eventData.repeatUntil) <= new Date(eventData.date)) {
        setNotification({
          type: 'error',
          message: 'Das Enddatum muss nach dem Startdatum liegen.'
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      if (eventType === 'single') {
        // Einzeltermin erstellen
        await createEventMutation.mutateAsync({
          ...eventData,
          maxParticipants: eventData.maxParticipants ? parseInt(eventData.maxParticipants) : null
        });
        
        setNotification({
          type: 'success',
          message: 'Termin wurde erfolgreich erstellt.'
        });
      } else {
        // Terminserie erstellen
        await createEventMutation.mutateAsync({
          ...eventData,
          isSeries: true,
          maxParticipants: eventData.maxParticipants ? parseInt(eventData.maxParticipants) : null
        });
        
        setNotification({
          type: 'success',
          message: 'Terminserie wurde erfolgreich erstellt.'
        });
      }
      
      // Formular zurücksetzen
      setEventData({
        title: '',
        type: 'training',
        date: '',
        startTime: '',
        endTime: '',
        location: '',
        description: '',
        teamId: user?.teamId || '',
        maxParticipants: '',
        repeatType: 'weekly',
        repeatUntil: '',
        repeatDays: []
      });
      
    } catch (error) {
      setNotification({
        type: 'error',
        message: `Fehler beim Erstellen des Termins: ${error.message}`
      });
    }
  };

  const dismissNotification = () => {
    setNotification(null);
  };

  return (
    <div className="event-creation-page">
      <div className="event-creation-header">
        <h1>Termin erstellen</h1>
        <Button 
          variant="secondary" 
          onClick={() => window.location.href = '/trainer/events'}
        >
          Zurück zur Terminübersicht
        </Button>
      </div>
      
      {notification && (
        <Alert 
          type={notification.type} 
          message={notification.message} 
          dismissible={true}
          onDismiss={dismissNotification}
        />
      )}
      
      <Card title="Termindetails">
        <div className="event-type-selector">
          <div className="event-type-options">
            <label className={`event-type-option ${eventType === 'single' ? 'selected' : ''}`}>
              <input 
                type="radio" 
                name="eventType" 
                value="single" 
                checked={eventType === 'single'} 
                onChange={() => setEventType('single')} 
              />
              <span>Einzeltermin</span>
            </label>
            <label className={`event-type-option ${eventType === 'series' ? 'selected' : ''}`}>
              <input 
                type="radio" 
                name="eventType" 
                value="series" 
                checked={eventType === 'series'} 
                onChange={() => setEventType('series')} 
              />
              <span>Terminserie</span>
            </label>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-row">
            <Input
              id="title"
              name="title"
              label="Titel *"
              value={eventData.title}
              onChange={handleInputChange}
              placeholder="z.B. Training U15"
              required
            />
            
            <div className="form-group">
              <label htmlFor="type">Art des Termins *</label>
              <select
                id="type"
                name="type"
                value={eventData.type}
                onChange={handleInputChange}
                className="select-input"
                required
              >
                <option value="training">Training</option>
                <option value="match">Spiel</option>
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <Input
              id="date"
              name="date"
              type="date"
              label="Datum *"
              value={eventData.date}
              onChange={handleInputChange}
              required
            />
            
            <div className="form-group">
              <label htmlFor="teamId">Team *</label>
              <select
                id="teamId"
                name="teamId"
                value={eventData.teamId}
                onChange={handleInputChange}
                className="select-input"
                required
              >
                <option value="">Team auswählen</option>
                {teams.map(team => (
                  <option key={team._id || team.id} value={team._id || team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <Input
              id="startTime"
              name="startTime"
              type="time"
              label="Startzeit *"
              value={eventData.startTime}
              onChange={handleInputChange}
              required
            />
            
            <Input
              id="endTime"
              name="endTime"
              type="time"
              label="Endzeit *"
              value={eventData.endTime}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-row">
            <Input
              id="location"
              name="location"
              label="Ort *"
              value={eventData.location}
              onChange={handleInputChange}
              placeholder="z.B. Sportplatz Musterstadt"
              required
            />
            
            <Input
              id="maxParticipants"
              name="maxParticipants"
              type="number"
              label="Max. Teilnehmer"
              value={eventData.maxParticipants}
              onChange={handleInputChange}
              placeholder="Leer lassen für unbegrenzt"
              min="1"
            />
          </div>
          
          <div className="form-row full-width">
            <div className="form-group">
              <label htmlFor="description">Beschreibung</label>
              <textarea
                id="description"
                name="description"
                value={eventData.description}
                onChange={handleInputChange}
                placeholder="Zusätzliche Informationen zum Termin"
                className="textarea-input"
                rows="4"
              />
            </div>
          </div>
          
          {eventType === 'series' && (
            <div className="series-options">
              <h3>Serienoptionen</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="repeatType">Wiederholungstyp *</label>
                  <select
                    id="repeatType"
                    name="repeatType"
                    value={eventData.repeatType}
                    onChange={handleInputChange}
                    className="select-input"
                    required
                  >
                    <option value="weekly">Wöchentlich</option>
                    <option value="biweekly">Alle zwei Wochen</option>
                  </select>
                </div>
                
                <Input
                  id="repeatUntil"
                  name="repeatUntil"
                  type="date"
                  label="Wiederholen bis *"
                  value={eventData.repeatUntil}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Wochentage *</label>
                <div className="weekday-selector">
                  {['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'].map((day, index) => (
                    <label key={day} className="weekday-option">
                      <input
                        type="checkbox"
                        checked={eventData.repeatDays.includes(index)}
                        onChange={() => handleCheckboxChange(index)}
                      />
                      <span>{day}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <div className="form-actions">
            <Button
              type="submit"
              disabled={createEventMutation.isPending}
            >
              {createEventMutation.isPending ? 'Wird erstellt...' : 'Termin erstellen'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => window.location.href = '/trainer/events'}
              disabled={createEventMutation.isPending}
            >
              Abbrechen
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EventCreationPage;
