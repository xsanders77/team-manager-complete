import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import './SignupPage.css';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'player' // Default role
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Die Passwörter stimmen nicht überein.');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('Das Passwort muss mindestens 6 Zeichen lang sein.');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);

    try {
      // Wir entfernen confirmPassword, da es nicht an den Server gesendet werden soll
      const { confirmPassword, ...userData } = formData;
      
      const user = await signup(userData);
      
      // Weiterleitung basierend auf der Benutzerrolle
      switch (user.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'trainer':
          navigate('/trainer');
          break;
        case 'player':
          navigate('/player');
          break;
        case 'parent':
          navigate('/parent');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <Card>
        <h2 className="signup-title">Registrieren</h2>
        {error && <div className="signup-error">{error}</div>}
        <form onSubmit={handleSubmit} className="signup-form">
          <Input
            id="name"
            name="name"
            type="text"
            label="Name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ihr vollständiger Name"
            required
          />
          <Input
            id="email"
            name="email"
            type="email"
            label="E-Mail"
            value={formData.email}
            onChange={handleChange}
            placeholder="Ihre E-Mail-Adresse"
            required
          />
          <Input
            id="password"
            name="password"
            type="password"
            label="Passwort"
            value={formData.password}
            onChange={handleChange}
            placeholder="Mindestens 6 Zeichen"
            required
          />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Passwort bestätigen"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Passwort wiederholen"
            required
          />
          
          <div className="signup-role-selector">
            <label className="input-label">Rolle</label>
            <div className="role-options">
              <label className="role-option">
                <input
                  type="radio"
                  name="role"
                  value="player"
                  checked={formData.role === 'player'}
                  onChange={handleChange}
                />
                <span>Spieler</span>
              </label>
              <label className="role-option">
                <input
                  type="radio"
                  name="role"
                  value="parent"
                  checked={formData.role === 'parent'}
                  onChange={handleChange}
                />
                <span>Elternteil</span>
              </label>
            </div>
          </div>
          
          <div className="signup-actions">
            <Button 
              type="submit" 
              fullWidth 
              disabled={isLoading}
            >
              {isLoading ? 'Wird registriert...' : 'Registrieren'}
            </Button>
          </div>
        </form>
        <div className="signup-links">
          <a href="/login">Bereits registriert? Anmelden</a>
        </div>
      </Card>
    </div>
  );
};

export default SignupPage;
