import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import './LoginPage.css';

const LoginPage = () => {
  //console.log("📢 LoginPage wird gerendert");

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    //console.log(`✏️ Eingabe geändert: ${name} = ${value}`);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    console.log("🟡 handleSubmit wurde aufgerufen");

    try {
      const user = await login(formData);
      console.log("✅ Login erfolgreich, empfangener User:", user);

      if (!user || !user.role) {
        console.warn("⚠️ Login hat keinen gültigen Benutzer geliefert");
        setError('Login erfolgreich, aber keine Benutzerrolle empfangen.');
        return;
      }

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
      console.error("❌ Login fehlgeschlagen:", err);
      setError(err.message || 'Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Anmeldedaten.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Card>
        <h2 className="login-title">Anmelden</h2>

        {/* Testbutton, um zu prüfen ob überhaupt was reagiert */}
        <button onClick={() => console.log("🧪 Testbutton funktioniert!")}>
          Test-Log
        </button>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
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
            placeholder="Ihr Passwort"
            required
          />
          <div className="login-actions">
            <Button 
              type="submit" 
              fullWidth 
              disabled={isLoading}
            >
              {isLoading ? 'Wird angemeldet...' : 'Anmelden'}
            </Button>
          </div>
        </form>

        <div className="login-links">
          <a href="/signup">Noch kein Konto? Registrieren</a>
          <a href="/reset-password">Passwort vergessen?</a>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
