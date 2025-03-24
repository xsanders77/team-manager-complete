import React from 'react';
import './Card.css';

/**
 * Wiederverwendbare Card-Komponente für strukturierte Inhalte
 * 
 * @param {Object} props - Komponenteneigenschaften
 * @param {string} [props.title] - Titel der Karte
 * @param {React.ReactNode} props.children - Karteninhalt
 * @param {string} [props.className] - Zusätzliche CSS-Klassen
 * @returns {JSX.Element} Card-Komponente
 */
const Card = ({ title, children, className = '', ...rest }) => {
  const cardClasses = ['card', className].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} {...rest}>
      {title && <div className="card__header">{title}</div>}
      <div className="card__content">
        {children}
      </div>
    </div>
  );
};

export default Card;
