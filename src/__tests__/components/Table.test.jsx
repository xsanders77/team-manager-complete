import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Table from '../../../components/ui/Table/Table';

describe('Table Component', () => {
  const mockColumns = [
    { id: 'name', label: 'Name', sortable: true },
    { id: 'age', label: 'Alter', sortable: true },
    { id: 'position', label: 'Position', sortable: false, align: 'center' }
  ];

  const mockData = [
    { id: 1, name: 'Max Mustermann', age: 25, position: 'Stürmer' },
    { id: 2, name: 'Anna Schmidt', age: 22, position: 'Verteidiger' },
    { id: 3, name: 'Tom Müller', age: 28, position: 'Torwart' }
  ];

  const mockOnRowClick = jest.fn();

  beforeEach(() => {
    mockOnRowClick.mockReset();
  });

  test('should render loading state when isLoading is true', () => {
    render(
      <Table 
        columns={mockColumns} 
        data={mockData} 
        isLoading={true}
      />
    );

    expect(screen.getByText('Daten werden geladen...')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  test('should render empty message when data is empty', () => {
    render(
      <Table 
        columns={mockColumns} 
        data={[]} 
        emptyMessage="Keine Spieler gefunden"
      />
    );

    expect(screen.getByText('Keine Spieler gefunden')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  test('should render table with correct data', () => {
    render(
      <Table 
        columns={mockColumns} 
        data={mockData}
      />
    );

    // Check column headers
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Alter')).toBeInTheDocument();
    expect(screen.getByText('Position')).toBeInTheDocument();

    // Check data rows
    expect(screen.getByText('Max Mustermann')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('Stürmer')).toBeInTheDocument();
    
    expect(screen.getByText('Anna Schmidt')).toBeInTheDocument();
    expect(screen.getByText('22')).toBeInTheDocument();
    expect(screen.getByText('Verteidiger')).toBeInTheDocument();
    
    expect(screen.getByText('Tom Müller')).toBeInTheDocument();
    expect(screen.getByText('28')).toBeInTheDocument();
    expect(screen.getByText('Torwart')).toBeInTheDocument();
  });

  test('should call onRowClick when a row is clicked', () => {
    render(
      <Table 
        columns={mockColumns} 
        data={mockData}
        onRowClick={mockOnRowClick}
      />
    );

    // Click on the first row
    const firstRowCells = screen.getAllByText('Max Mustermann');
    fireEvent.click(firstRowCells[0]);

    // Check if onRowClick was called with the correct arguments
    expect(mockOnRowClick).toHaveBeenCalledTimes(1);
    expect(mockOnRowClick).toHaveBeenCalledWith(mockData[0], 0);
  });

  test('should sort data when sortable column header is clicked', () => {
    render(
      <Table 
        columns={mockColumns} 
        data={mockData}
      />
    );

    // Get the "Age" column header
    const ageHeader = screen.getByText('Alter');
    
    // Click to sort by age ascending
    fireEvent.click(ageHeader);
    
    // Check if the data is sorted by age ascending
    const rows = screen.getAllByRole('row');
    // First row is header, so we start from index 1
    expect(rows[1]).toHaveTextContent('Anna Schmidt');
    expect(rows[2]).toHaveTextContent('Max Mustermann');
    expect(rows[3]).toHaveTextContent('Tom Müller');
    
    // Click again to sort by age descending
    fireEvent.click(ageHeader);
    
    // Check if the data is sorted by age descending
    const rowsAfterSecondClick = screen.getAllByRole('row');
    expect(rowsAfterSecondClick[1]).toHaveTextContent('Tom Müller');
    expect(rowsAfterSecondClick[2]).toHaveTextContent('Max Mustermann');
    expect(rowsAfterSecondClick[3]).toHaveTextContent('Anna Schmidt');
  });

  test('should not sort when non-sortable column header is clicked', () => {
    render(
      <Table 
        columns={mockColumns} 
        data={mockData}
      />
    );

    // Get the "Position" column header (non-sortable)
    const positionHeader = screen.getByText('Position');
    
    // Click the non-sortable header
    fireEvent.click(positionHeader);
    
    // Check if the data order remains unchanged
    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('Max Mustermann');
    expect(rows[2]).toHaveTextContent('Anna Schmidt');
    expect(rows[3]).toHaveTextContent('Tom Müller');
  });

  test('should apply correct alignment classes', () => {
    render(
      <Table 
        columns={mockColumns} 
        data={mockData}
      />
    );

    // Check if the "Position" column has the center alignment class
    const positionHeader = screen.getByText('Position');
    expect(positionHeader).toHaveClass('align-center');
    
    // Check if the cells in the "Position" column have the center alignment class
    const positionCells = [
      screen.getByText('Stürmer'),
      screen.getByText('Verteidiger'),
      screen.getByText('Torwart')
    ];
    
    positionCells.forEach(cell => {
      expect(cell).toHaveClass('align-center');
    });
  });
});
