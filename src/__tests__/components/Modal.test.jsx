import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from '../../components/ui/Modal/Modal';

describe('Modal Component', () => {
  const mockOnClose = jest.fn();
  const modalTitle = 'Test Modal';
  const modalContent = 'This is a test modal content';

  beforeEach(() => {
    // Reset mocks before each test
    mockOnClose.mockReset();
  });

  test('should not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={mockOnClose} title={modalTitle}>
        {modalContent}
      </Modal>
    );

    // Modal should not be in the document
    expect(screen.queryByText(modalTitle)).not.toBeInTheDocument();
    expect(screen.queryByText(modalContent)).not.toBeInTheDocument();
  });

  test('should render when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title={modalTitle}>
        {modalContent}
      </Modal>
    );

    // Modal should be in the document
    expect(screen.getByText(modalTitle)).toBeInTheDocument();
    expect(screen.getByText(modalContent)).toBeInTheDocument();
  });

  test('should call onClose when close button is clicked', async () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title={modalTitle}>
        {modalContent}
      </Modal>
    );

    // Click the close button
    const closeButton = screen.getByRole('button', { name: /schließen/i });
    await userEvent.click(closeButton);

    // onClose should be called
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('should call onClose when clicking outside if closeOnOutsideClick is true', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title={modalTitle} closeOnOutsideClick={true}>
        {modalContent}
      </Modal>
    );

    // Click the overlay (outside the modal content)
    const overlay = screen.getByClassName('modal-overlay');
    fireEvent.click(overlay);

    // onClose should be called
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('should not call onClose when clicking outside if closeOnOutsideClick is false', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title={modalTitle} closeOnOutsideClick={false}>
        {modalContent}
      </Modal>
    );

    // Click the overlay (outside the modal content)
    const overlay = screen.getByClassName('modal-overlay');
    fireEvent.click(overlay);

    // onClose should not be called
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test('should call onClose when Escape key is pressed', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title={modalTitle}>
        {modalContent}
      </Modal>
    );

    // Press Escape key
    fireEvent.keyDown(document, { key: 'Escape' });

    // onClose should be called
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('should apply the correct size class', () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={mockOnClose} title={modalTitle} size="small">
        {modalContent}
      </Modal>
    );

    // Check for small size class
    expect(screen.getByRole('dialog')).toHaveClass('modal-small');

    // Rerender with medium size
    rerender(
      <Modal isOpen={true} onClose={mockOnClose} title={modalTitle} size="medium">
        {modalContent}
      </Modal>
    );

    // Check for medium size class
    expect(screen.getByRole('dialog')).toHaveClass('modal-medium');

    // Rerender with large size
    rerender(
      <Modal isOpen={true} onClose={mockOnClose} title={modalTitle} size="large">
        {modalContent}
      </Modal>
    );

    // Check for large size class
    expect(screen.getByRole('dialog')).toHaveClass('modal-large');
  });
});
