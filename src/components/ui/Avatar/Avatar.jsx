import React, { useState } from 'react';
import './Avatar.css';

/**
 * Avatar-Komponente für Benutzerprofilbilder
 * 
 * @param {Object} props - Komponenten-Props
 * @param {string} props.src - Bildquelle für den Avatar
 * @param {string} props.alt - Alternativer Text für das Bild
 * @param {string} props.size - Größe des Avatars ('small', 'medium', 'large')
 * @param {string} props.name - Name des Benutzers (für Fallback und Tooltip)
 * @param {string} props.status - Status des Benutzers ('online', 'offline', 'away')
 * @param {function} props.onClick - Callback-Funktion für Klick auf Avatar
 * @returns {React.ReactElement}
 */
const Avatar = ({ 
  src, 
  alt, 
  size = 'medium', 
  name = '', 
  status, 
  onClick 
}) => {
  const [hasError, setHasError] = useState(false);
  
  // Fehlerbehandlung für Bilder
  const handleError = () => {
    setHasError(true);
  };
  
  // Generiere Initialen aus dem Namen
  const getInitials = () => {
    if (!name) return '?';
    
    const nameParts = name.split(' ').filter(part => part.length > 0);
    if (nameParts.length === 0) return '?';
    
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };
  
  // Generiere Hintergrundfarbe basierend auf dem Namen
  const getBackgroundColor = () => {
    if (!name) return '#adb5bd';
    
    const charCodeSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const colors = [
      '#4dabf7', '#339af0', '#228be6', '#1c7ed6', '#1971c2', 
      '#20c997', '#12b886', '#0ca678', '#099268', '#087f5b',
      '#fab005', '#f59f00', '#f08c00', '#e67700', '#d9480f'
    ];
    
    return colors[charCodeSum % colors.length];
  };
  
  const avatarClasses = [
    'avatar',
    `avatar-${size}`,
    onClick ? 'avatar-clickable' : ''
  ].filter(Boolean).join(' ');
  
  const statusClasses = status ? `avatar-status avatar-status-${status}` : '';
  
  return (
    <div 
      className={avatarClasses} 
      onClick={onClick}
      title={name}
    >
      {!hasError && src ? (
        <img 
          src={src} 
          alt={alt || name || 'Avatar'} 
          className="avatar-image" 
          onError={handleError}
        />
      ) : (
        <div 
          className="avatar-fallback" 
          style={{ backgroundColor: getBackgroundColor() }}
        >
          {getInitials()}
        </div>
      )}
      
      {status && <span className={statusClasses}></span>}
    </div>
  );
};

export default Avatar;
