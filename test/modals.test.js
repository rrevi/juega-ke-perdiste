import { expect } from 'expect';
import { h } from 'preact';
import { render, fireEvent, screen } from '@testing-library/preact';
import ConfirmModal from '../src/components/ConfirmModal';
import SettingsModal from '../src/components/SettingsModal';

describe('ConfirmModal', () => {
  test('should return null when isOpen is false', () => {
    const { container } = render(
      <ConfirmModal isOpen={false} onConfirm={jest.fn()} onCancel={jest.fn()} />
    );
    expect(container.innerHTML).toBe('');
  });

  test('should render default texts and call onConfirm and onCancel', () => {
    const handleConfirm = jest.fn();
    const handleCancel = jest.fn();

    const { rerender } = render(
      <ConfirmModal
        isOpen={true}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    );

    expect(screen.getByText('¿Confirmar acción?')).toBeTruthy();
    expect(screen.getByText('Esta acción no se puede deshacer.')).toBeTruthy();
    expect(screen.getByText('Confirmar')).toBeTruthy();
    expect(screen.getByText('Cancelar')).toBeTruthy();

    fireEvent.click(screen.getByText('Confirmar'));
    expect(handleConfirm).toHaveBeenCalled();

    // Backdrop click cancels
    fireEvent.click(screen.getByRole('dialog'));
    expect(handleCancel).toHaveBeenCalled();
  });
});

describe('SettingsModal', () => {
  test('should return null when isOpen is false', () => {
    const { container } = render(
      <SettingsModal isOpen={false} onSave={jest.fn()} onClose={jest.fn()} />
    );
    expect(container.innerHTML).toBe('');
  });

  test('should render, allow changing win score and save', () => {
    const handleSave = jest.fn();
    const handleClose = jest.fn();

    render(
      <SettingsModal
        isOpen={true}
        currentWinScore={200}
        team1={{ name: 'Ellos', emoji: '🦅' }}
        team2={{ name: 'Nosotros', emoji: '🐅' }}
        onClose={handleClose}
        onSave={handleSave}
      />
    );

    expect(screen.getByText('⚙️ Ajustes del Juego')).toBeTruthy();

    // Select 150 pts
    fireEvent.click(screen.getByText('150 pts'));

    // Save
    fireEvent.click(screen.getByText('Guardar Cambios'));
    expect(handleSave).toHaveBeenCalledWith(
      expect.objectContaining({
        winScore: 150
      })
    );
  });

  test('should allow customizing team names and emojis and closing', () => {
    const handleSave = jest.fn();
    const handleClose = jest.fn();

    render(
      <SettingsModal
        isOpen={true}
        currentWinScore={200}
        team1={{ name: 'Ellos', emoji: '🦅' }}
        team2={{ name: 'Nosotros', emoji: '🐅' }}
        onClose={handleClose}
        onSave={handleSave}
      />
    );

    // Edit Team 1 Name
    const team1Input = screen.getByPlaceholderText('Nombre Equipo 1');
    fireEvent.change(team1Input, { target: { value: 'Águilas' } });

    // Select Team 1 Emoji
    fireEvent.click(screen.getByText('🦁'));

    // Edit Team 2 Name
    const team2Input = screen.getByPlaceholderText('Nombre Equipo 2');
    fireEvent.change(team2Input, { target: { value: 'Tigres' } });

    // Select Team 2 Emoji
    fireEvent.click(screen.getByText('🐉'));

    // Save
    fireEvent.click(screen.getByText('Guardar Cambios'));
    expect(handleSave).toHaveBeenCalledWith({
      winScore: 200,
      team1: { name: 'Águilas', emoji: '🦁' },
      team2: { name: 'Tigres', emoji: '🐉' }
    });

    // Close button
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar' }));
    expect(handleClose).toHaveBeenCalled();
  });

  test('should fallback to default team names when empty, and close on backdrop click', () => {
    const handleSave = jest.fn();
    const handleClose = jest.fn();

    render(
      <SettingsModal
        isOpen={true}
        onClose={handleClose}
        onSave={handleSave}
      />
    );

    const team1Input = screen.getByPlaceholderText('Nombre Equipo 1');
    fireEvent.change(team1Input, { target: { value: '   ' } });
    const team2Input = screen.getByPlaceholderText('Nombre Equipo 2');
    fireEvent.change(team2Input, { target: { value: '   ' } });

    fireEvent.click(screen.getByText('Guardar Cambios'));
    expect(handleSave).toHaveBeenCalledWith({
      winScore: 200,
      team1: { name: 'Ellos', emoji: '🦅' },
      team2: { name: 'Nosotros', emoji: '🐅' }
    });

    // Backdrop click
    fireEvent.click(screen.getByRole('dialog'));
    expect(handleClose).toHaveBeenCalled();
  });
});
