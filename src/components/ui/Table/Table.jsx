import React, { useState, useMemo } from 'react';
import './Table.css';

/**
 * Table-Komponente für strukturierte Datenanzeige mit Sortier- und Filterfunktionen
 * 
 * @param {Object} props - Komponenten-Props
 * @param {Array} props.columns - Array von Spaltenobjekten mit { id, label, sortable, align }
 * @param {Array} props.data - Array von Datenobjekten
 * @param {function} props.onRowClick - Callback-Funktion für Klick auf Zeile
 * @param {boolean} props.isLoading - Ob die Daten geladen werden
 * @param {string} props.emptyMessage - Nachricht, wenn keine Daten vorhanden sind
 * @returns {React.ReactElement}
 */
const Table = ({ 
  columns = [], 
  data = [], 
  onRowClick, 
  isLoading = false,
  emptyMessage = "Keine Daten vorhanden" 
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  
  // Sortierung der Daten
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;
    
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      // Null-Werte behandeln
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      // Verschiedene Datentypen behandeln
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      return sortConfig.direction === 'asc' 
        ? aValue - bValue 
        : bValue - aValue;
    });
  }, [data, sortConfig]);
  
  // Sortierrichtung umschalten
  const requestSort = (key) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === key) {
        return { 
          key, 
          direction: prevConfig.direction === 'asc' ? 'desc' : 'asc' 
        };
      }
      return { key, direction: 'asc' };
    });
  };
  
  // Sortierindikator für Spaltenüberschrift
  const getSortIndicator = (columnId) => {
    if (sortConfig.key !== columnId) return null;
    
    return (
      <span className="sort-indicator">
        {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
      </span>
    );
  };
  
  // Zeilen-Klick-Handler
  const handleRowClick = (item, index) => {
    if (onRowClick) {
      onRowClick(item, index);
    }
  };
  
  // Leere Tabelle oder Ladezustand
  if (isLoading) {
    return (
      <div className="table-container">
        <div className="table-loading">Daten werden geladen...</div>
      </div>
    );
  }
  
  if (data.length === 0) {
    return (
      <div className="table-container">
        <div className="table-empty">{emptyMessage}</div>
      </div>
    );
  }
  
  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th 
                key={column.id}
                className={`table-header ${column.align ? `align-${column.align}` : ''}`}
                onClick={column.sortable ? () => requestSort(column.id) : undefined}
                style={{ cursor: column.sortable ? 'pointer' : 'default' }}
              >
                {column.label}
                {column.sortable && getSortIndicator(column.id)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item, index) => (
            <tr 
              key={item.id || index}
              onClick={() => handleRowClick(item, index)}
              className={onRowClick ? 'clickable-row' : ''}
            >
              {columns.map((column) => (
                <td 
                  key={`${item.id || index}-${column.id}`}
                  className={column.align ? `align-${column.align}` : ''}
                >
                  {item[column.id]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
