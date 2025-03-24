import React from 'react';
import './Input.css';

/**
 * Wiederverwendbare Input-Komponente für Formulare
 * 
 * @param {Object} props - Komponenteneigenschaften
 * @param {string} props.id - ID des Inputs
 * @param {string} props.name - Name des Inputs
 * @param {string} props.type - Typ des Inputs (text, email, password, etc.)
 * @param {string} props.label - Label für den Input
 * @param {string} [props.value] - Wert des Inputs
 * @param {Function} props.onChange - Change-Handler-Funktion
 * @param {string} [props.placeholder] - Placeholder-Text
 * @param {string} [props.error] - Fehlermeldung
 * @param {boolean} [props.required=false] - Ob der Input erforderlich ist
 * @returns {JSX.Element} Input-Komponente
 */
const Input = ({ 
  id, 
  name, 
  type = 'text', 
  label, 
  value, 
  onChange, 
  placeholder, 
  error, 
  required = false,
  ...rest 
}) => {
  return (
    <div className={`input-group ${error ? 'input-group--error' : ''}`}>
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input-field"
        required={required}
        {...rest}
      />
      {error && <div className="input-error">{error}</div>}
    </div>
  );
};

export default Input;
