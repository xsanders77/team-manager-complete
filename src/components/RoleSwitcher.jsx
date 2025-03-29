// src/components/RoleSwitcher.jsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const RoleSwitcher = () => {
  const { user, setOverrideRole } = useAuth();
  // Nur rendern, wenn ein Benutzer angemeldet ist
  if (!user) return null;

  const roles = ['admin', 'trainer', 'player', 'parent'];

  return (
    <div style={{ padding: '10px', background: '#eee', marginBottom: '1rem' }}>
      <label htmlFor="role-switch">Rolle wechseln: </label>
      <select
        id="role-switch"
        value={user.role}
        onChange={(e) => setOverrideRole(e.target.value)}
        style={{ marginLeft: '0.5rem' }}
      >
        {roles.map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>
    </div>
  );
};

export default RoleSwitcher;
