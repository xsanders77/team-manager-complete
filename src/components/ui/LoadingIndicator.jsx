import React, { useState, useEffect } from 'react';
import './LoadingIndicator.css';

/**
 * Wiederverwendbare LoadingIndicator-Komponente für Ladezustände
 * 
 * @param {Object} props - Komponenteneigenschaften
 * @param {boolean} [props.isLoading=true] - Ob der Ladeindikator angezeigt werden soll
 * @param {string} [props.size='medium'] - Größe des Ladeindikators (small, medium, large)
 * @param {string} [props.text='Wird geladen...'] - Text, der neben dem Ladeindikator angezeigt wird
 * @param {boolean} [props.fullScreen=false] - Ob der Ladeindikator den gesamten Bildschirm einnehmen soll
 * @param {string} [props.color='primary'] - Farbe des Ladeindikators (primary, secondary, success, danger)
 * @returns {JSX.Element|null} LoadingIndicator-Komponente oder null wenn nicht geladen wird
 */
const LoadingIndicator = ({ 
  isLoading = true, 
  size = 'medium', 
  text = 'Wird geladen...', 
  fullScreen = false,
  color = 'primary'
}) => {
  const [visible, setVisible] = useState(false);
  
  // Verzögerung beim Anzeigen des Ladeindikators, um Flackern bei schnellen Ladevorgängen zu vermeiden
  useEffect(() => {
    let timeout;
    
    if (isLoading) {
      timeout = setTimeout(() => {
        setVisible(true);
      }, 300);
    } else {
      setVisible(false);
    }
    
    return () => {
      clearTimeout(timeout);
    };
  }, [isLoading]);
  
  if (!isLoading && !visible) {
    return null;
  }
  
  const indicatorClasses = [
    'loading-indicator',
    `loading-indicator--${size}`,
    `loading-indicator--${color}`,
    fullScreen ? 'loading-indicator--fullscreen' : ''
  ].filter(Boolean).join(' ');
  
  return (
    <div className={indicatorClasses}>
      <div className="loading-indicator__spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      {text && <div className="loading-indicator__text">{text}</div>}
    </div>
  );
};

export default LoadingIndicator;
