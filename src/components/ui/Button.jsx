import React from 'react';
import './Button.css';

/**
 * Wiederverwendbare Button-Komponente mit verschiedenen Stilen
 * 
 * @param {Object} props - Komponenteneigenschaften
 * @param {string} [props.variant='primary'] - Button-Variante (primary, secondary, danger, success)
 * @param {string} [props.size='medium'] - Button-Größe (small, medium, large)
 * @param {boolean} [props.fullWidth=false] - Ob der Button die volle Breite einnehmen soll
 * @param {boolean} [props.disabled=false] - Ob der Button deaktiviert ist
 * @param {Function} props.onClick - Klick-Handler-Funktion
 * @param {React.ReactNode} props.children - Button-Inhalt
 * @returns {JSX.Element} Button-Komponente
 */
const Button = ({ 
  variant = 'primary', 
  size = 'medium', 
  fullWidth = false, 
  disabled = false, 
  onClick, 
  children,
  ...rest 
}) => {
  const buttonClasses = [
    'button',
    `button--${variant}`,
    `button--${size}`,
    fullWidth ? 'button--full-width' : '',
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
