import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Avatar from '../../../components/ui/Avatar/Avatar';

describe('Avatar Component', () => {
  const mockOnClick = jest.fn();
  const testName = 'Max Mustermann';
  const testSrc = 'https://example.com/avatar.jpg';
  const testAlt = 'User Avatar';

  beforeEach(() => {
    mockOnClick.mockReset();
  });

  test('should render with image when src is provided', () => {
    render(
      <Avatar 
        src={testSrc} 
        alt={testAlt} 
        name={testName}
      />
    );

    const imgElement = screen.getByAltText(testAlt);
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', testSrc);
    expect(imgElement).toHaveClass('avatar-image');
  });

  test('should render fallback with initials when src is not provided', () => {
    render(
      <Avatar 
        name={testName}
      />
    );

    const fallbackElement = screen.getByText('MM');
    expect(fallbackElement).toBeInTheDocument();
    expect(fallbackElement.closest('.avatar-fallback')).toBeInTheDocument();
  });

  test('should render fallback with single initial for single name', () => {
    render(
      <Avatar 
        name="Max"
      />
    );

    const fallbackElement = screen.getByText('M');
    expect(fallbackElement).toBeInTheDocument();
  });

  test('should render fallback with question mark when name is not provided', () => {
    render(
      <Avatar />
    );

    const fallbackElement = screen.getByText('?');
    expect(fallbackElement).toBeInTheDocument();
  });

  test('should render with small size', () => {
    render(
      <Avatar 
        name={testName}
        size="small"
      />
    );

    const avatarElement = screen.getByTitle(testName);
    expect(avatarElement).toHaveClass('avatar-small');
  });

  test('should render with large size', () => {
    render(
      <Avatar 
        name={testName}
        size="large"
      />
    );

    const avatarElement = screen.getByTitle(testName);
    expect(avatarElement).toHaveClass('avatar-large');
  });

  test('should render with online status', () => {
    render(
      <Avatar 
        name={testName}
        status="online"
      />
    );

    const statusElement = screen.getByTitle(testName).querySelector('.avatar-status');
    expect(statusElement).toBeInTheDocument();
    expect(statusElement).toHaveClass('avatar-status-online');
  });

  test('should render with offline status', () => {
    render(
      <Avatar 
        name={testName}
        status="offline"
      />
    );

    const statusElement = screen.getByTitle(testName).querySelector('.avatar-status');
    expect(statusElement).toBeInTheDocument();
    expect(statusElement).toHaveClass('avatar-status-offline');
  });

  test('should call onClick when clicked', () => {
    render(
      <Avatar 
        name={testName}
        onClick={mockOnClick}
      />
    );

    const avatarElement = screen.getByTitle(testName);
    expect(avatarElement).toHaveClass('avatar-clickable');
    
    fireEvent.click(avatarElement);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('should handle image load error and show fallback', () => {
    render(
      <Avatar 
        src={testSrc} 
        name={testName}
      />
    );

    const imgElement = screen.getByAltText(testName || 'Avatar');
    fireEvent.error(imgElement);

    const fallbackElement = screen.getByText('MM');
    expect(fallbackElement).toBeInTheDocument();
  });
});
