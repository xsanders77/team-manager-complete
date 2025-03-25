import React from 'react';
import { render, screen } from '@testing-library/react';
import Loader from '../../components/ui/Loader/Loader';

describe('Loader Component', () => {
  test('should render with default props', () => {
    render(<Loader />);
    
    const loaderElement = screen.getByRole('generic', { name: '' });
    expect(loaderElement).toBeInTheDocument();
    expect(loaderElement).toHaveClass('loader');
    expect(loaderElement).toHaveClass('loader-medium');
    expect(loaderElement).toHaveClass('loader-primary');
    expect(loaderElement).not.toHaveClass('loader-fullscreen');
  });

  test('should render with small size', () => {
    render(<Loader size="small" />);
    
    const loaderElement = screen.getByRole('generic', { name: '' });
    expect(loaderElement).toHaveClass('loader-small');
  });

  test('should render with large size', () => {
    render(<Loader size="large" />);
    
    const loaderElement = screen.getByRole('generic', { name: '' });
    expect(loaderElement).toHaveClass('loader-large');
  });

  test('should render with custom color', () => {
    render(<Loader color="secondary" />);
    
    const loaderElement = screen.getByRole('generic', { name: '' });
    expect(loaderElement).toHaveClass('loader-secondary');
  });

  test('should render with text', () => {
    const loaderText = 'Loading data...';
    render(<Loader text={loaderText} />);
    
    expect(screen.getByText(loaderText)).toBeInTheDocument();
  });

  test('should render in fullscreen mode', () => {
    render(<Loader fullScreen={true} />);
    
    const loaderElement = screen.getByRole('generic', { name: '' });
    expect(loaderElement).toHaveClass('loader-fullscreen');
  });

  test('should render with multiple custom props', () => {
    const loaderText = 'Please wait...';
    render(
      <Loader 
        size="large" 
        color="secondary" 
        text={loaderText} 
        fullScreen={true} 
      />
    );
    
    const loaderElement = screen.getByRole('generic', { name: '' });
    expect(loaderElement).toHaveClass('loader-large');
    expect(loaderElement).toHaveClass('loader-secondary');
    expect(loaderElement).toHaveClass('loader-fullscreen');
    expect(screen.getByText(loaderText)).toBeInTheDocument();
  });

  test('should render spinner circles', () => {
    render(<Loader />);
    
    const spinnerElement = screen.getByRole('generic', { name: '' }).querySelector('.loader-spinner');
    expect(spinnerElement).toBeInTheDocument();
    
    const circleElements = spinnerElement.querySelectorAll('.loader-circle');
    expect(circleElements.length).toBe(3);
  });
});
