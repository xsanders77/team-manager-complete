import React from 'react';
import './Loader.css';

/**
 * Loader-Komponente für Ladeanimationen
 * 
 * @param {Object} props - Komponenten-Props
 * @param {string} props.size - Größe des Loaders ('small', 'medium', 'large')
 * @param {string} props.color - Farbe des Loaders
 * @param {string} props.text - Text, der unter dem Loader angezeigt wird
 * @param {boolean} props.fullScreen - Ob der Loader den gesamten Bildschirm einnehmen soll
 * @returns {React.ReactElement}
 */
const Loader = ({ 
  size = 'medium', 
  color = 'primary', 
  text = '', 
  fullScreen = false 
}) => {
  const loaderClasses = [
    'loader',
    `loader-${size}`,
    `loader-${color}`,
    fullScreen ? 'loader-fullscreen' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={loaderClasses}>
      <div className="loader-spinner">
        <div className="loader-circle"></div>
        <div className="loader-circle"></div>
        <div className="loader-circle"></div>
      </div>
      {text && <div className="loader-text">{text}</div>}
    </div>
  );
};

export default Loader;
