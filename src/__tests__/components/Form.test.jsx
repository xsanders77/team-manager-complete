import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Form from '../../components/ui/Form/Form';

describe('Form Component', () => {
  const mockOnSubmit = jest.fn();
  const testChildren = <input type="text" data-testid="test-input" />;

  beforeEach(() => {
    mockOnSubmit.mockReset();
  });

  test('should render form with children', () => {
    render(
      <Form onSubmit={mockOnSubmit}>
        {testChildren}
      </Form>
    );

    expect(screen.getByTestId('test-input')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /speichern/i })).toBeInTheDocument();
  });

  test('should call onSubmit when form is submitted', () => {
    render(
      <Form onSubmit={mockOnSubmit}>
        {testChildren}
      </Form>
    );

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  test('should not call onSubmit when form is submitted and loading is true', () => {
    render(
      <Form onSubmit={mockOnSubmit} loading={true}>
        {testChildren}
      </Form>
    );

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('should display custom submit text', () => {
    render(
      <Form onSubmit={mockOnSubmit} submitText="Anmelden">
        {testChildren}
      </Form>
    );

    expect(screen.getByRole('button', { name: /anmelden/i })).toBeInTheDocument();
  });

  test('should display loading indicator when loading is true', () => {
    render(
      <Form onSubmit={mockOnSubmit} loading={true}>
        {testChildren}
      </Form>
    );

    const submitButton = screen.getByRole('button');
    expect(submitButton).toBeDisabled();
    expect(submitButton.querySelector('.loading-indicator')).toBeInTheDocument();
  });

  test('should display error message when provided', () => {
    const errorMessage = 'Es ist ein Fehler aufgetreten';
    render(
      <Form onSubmit={mockOnSubmit} errorMessage={errorMessage}>
        {testChildren}
      </Form>
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText(errorMessage).closest('.error-message')).toBeInTheDocument();
  });

  test('should display success message when provided', () => {
    const successMessage = 'Erfolgreich gespeichert';
    render(
      <Form onSubmit={mockOnSubmit} successMessage={successMessage}>
        {testChildren}
      </Form>
    );

    expect(screen.getByText(successMessage)).toBeInTheDocument();
    expect(screen.getByText(successMessage).closest('.success-message')).toBeInTheDocument();
  });

  test('should display both error and success messages when provided', () => {
    const errorMessage = 'Es ist ein Fehler aufgetreten';
    const successMessage = 'Erfolgreich gespeichert';
    render(
      <Form 
        onSubmit={mockOnSubmit} 
        errorMessage={errorMessage}
        successMessage={successMessage}
      >
        {testChildren}
      </Form>
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText(successMessage)).toBeInTheDocument();
  });
});
