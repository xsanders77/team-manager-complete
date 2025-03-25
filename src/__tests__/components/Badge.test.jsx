import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Badge from '../../components/ui/Badge/Badge';

describe('Badge Component', () => {
  const mockOnClick = jest.fn();
  const testContent = 'Test Badge';

  beforeEach(() => {
    mockOnClick.mockReset();
  });

  test('should render with default props', () => {
    render(<Badge>{testContent}</Badge>);
    
    const badgeElement = screen.getByText(testContent);
    expect(badgeElement).toBeInTheDocument();
    expect(badgeElement).toHaveClass('badge');
    expect(badgeElement).toHaveClass('badge-primary');
    expect(badgeElement).toHaveClass('badge-medium');
    expect(badgeElement).not.toHaveClass('badge-pill');
    expect(badgeElement).not.toHaveClass('badge-outline');
    expect(badgeElement).not.toHaveClass('badge-clickable');
    expect(badgeElement).toHaveAttribute('role', 'status');
  });

  test('should render with different variant', () => {
    render(<Badge variant="success">{testContent}</Badge>);
    
    const badgeElement = screen.getByText(testContent);
    expect(badgeElement).toHaveClass('badge-success');
  });

  test('should render with different size', () => {
    render(<Badge size="small">{testContent}</Badge>);
    
    const badgeElement = screen.getByText(testContent);
    expect(badgeElement).toHaveClass('badge-small');
  });

  test('should render with pill style', () => {
    render(<Badge pill>{testContent}</Badge>);
    
    const badgeElement = screen.getByText(testContent);
    expect(badgeElement).toHaveClass('badge-pill');
  });

  test('should render with outline style', () => {
    render(<Badge outline>{testContent}</Badge>);
    
    const badgeElement = screen.getByText(testContent);
    expect(badgeElement).toHaveClass('badge-outline');
  });

  test('should be clickable when onClick is provided', () => {
    render(<Badge onClick={mockOnClick}>{testContent}</Badge>);
    
    const badgeElement = screen.getByText(testContent);
    expect(badgeElement).toHaveClass('badge-clickable');
    expect(badgeElement).toHaveAttribute('role', 'button');
    expect(badgeElement).toHaveAttribute('tabIndex', '0');
    
    fireEvent.click(badgeElement);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('should combine multiple props correctly', () => {
    render(
      <Badge 
        variant="warning" 
        size="large" 
        pill 
        outline 
        onClick={mockOnClick}
      >
        {testContent}
      </Badge>
    );
    
    const badgeElement = screen.getByText(testContent);
    expect(badgeElement).toHaveClass('badge-warning');
    expect(badgeElement).toHaveClass('badge-large');
    expect(badgeElement).toHaveClass('badge-pill');
    expect(badgeElement).toHaveClass('badge-outline');
    expect(badgeElement).toHaveClass('badge-clickable');
    
    fireEvent.click(badgeElement);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
