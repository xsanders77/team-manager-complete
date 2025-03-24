import React from 'react';
import './Badge.css';

/**
 * Badge-Komponente für Statusanzeige und Labels
 * 
 * @param {Object} props - Komponenten-Props
 * @param {React.ReactNode} props.children - Inhalt des Badges
 * @param {string} props.variant - Variante des Badges ('primary', 'secondary', 'success', 'danger', 'warning', 'info')
 * @param {string} props.size - Größe des Badges ('small', 'medium', 'large')
 * @param {boolean} props.pill - Ob der Badge abgerundete Ecken haben soll
 * @param {boolean} props.outline - Ob der Badge nur einen Umriss haben soll
 * @param {function} props.onClick - Callback-Funktion für Klick auf Badge (macht Badge klickbar)
 * @returns {React.ReactElement}
 */
const Badge = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  pill = false, 
  outline = false,
  onClick 
}) => {
  const badgeClasses = [
    'badge',
    `badge-${variant}`,
    `badge-${size}`,
    pill ? 'badge-pill' : '',
    outline ? 'badge-outline' : '',
    onClick ? 'badge-clickable' : ''
  ].filter(Boolean).join(' ');

  const handleClick = (event) => {
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <span 
      className={badgeClasses} 
      onClick={handleClick}
      role={onClick ? 'button' : 'status'}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </span>
  );
};

export default Badge;
