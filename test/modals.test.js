import { expect } from 'expect';
import { h } from 'preact';
import { render, fireEvent, screen } from '@testing-library/preact';
import ConfirmModal from '../src/components/ConfirmModal';
import SettingsModal from '../src/components/SettingsModal';

describe('ConfirmModal', () => {
  test('should render and call onConfirm and onCancel', () => {
    const handleConfirm = jest.fn();
    const handleCancel = jest.fn();

    const { rerender } = render(
      <ConfirmModal
        isOpen={true}
        title="¿Reiniciar?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    );

    expect(screen.getByText('¿Reiniciar?')).toBeTruthy();
    fireEvent.click(screen.getByText('Confirmar'));
    expect(handleConfirm).toHaveBeenCalled();

    fireEvent.click(screen.getByText('Cancelar'));
    expect(handleCancel).toHaveBeenCalled();
  });
});

describe('SettingsModal', () => {
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
});
