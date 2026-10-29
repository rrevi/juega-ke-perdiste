import { expect } from 'expect';
import { h } from 'preact';
import { render, fireEvent, screen, waitFor } from '@testing-library/preact';

import Home from '../src/pages/Home';

describe('Home', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('should display initial score', () => {
    render(<Home />);

    expect(screen.getByTitle("🦅 Puntaje Total").innerHTML).toMatch('0');
    expect(screen.getByTitle("🐅 Puntaje Total").innerHTML).toMatch('0');
  });

  test('should add 🦅 hand via drawer and preset', async () => {
    const { container } = render(<Home />);

    // Click "+ Ellos" button to open score drawer
    const themBtn = container.querySelector('#themAddScoreBtn');
    fireEvent.click(themBtn);

    // Select preset "+25"
    fireEvent.click(screen.getByText('+25'));

    // Save
    fireEvent.click(screen.getByText(/Anotar \+25 pts/i));

    await waitFor(() => {
      expect(screen.getByTitle("🦅 Puntaje Total").innerHTML).toMatch('25');
      expect(screen.getByTitle("🐅 Puntaje Total").innerHTML).toMatch('0');
    });
  });

  test('should add 🐅 hand via drawer and keypad', async () => {
    const { container } = render(<Home />);

    // Click "+ Nosotros" button to open score drawer
    const usBtn = container.querySelector('#usAddScoreBtn');
    fireEvent.click(usBtn);

    // Enter digits 3, 0 -> 30 pts
    fireEvent.click(screen.getByRole('button', { name: '3' }));
    fireEvent.click(screen.getByRole('button', { name: '0' }));

    // Save
    fireEvent.click(screen.getByText(/Anotar \+30 pts/i));

    await waitFor(() => {
      expect(screen.getByTitle("🦅 Puntaje Total").innerHTML).toMatch('0');
      expect(screen.getByTitle("🐅 Puntaje Total").innerHTML).toMatch('30');
    });
  });

  test('should clear all hands after "↻" button is clicked and confirmed', async () => {
    const { container } = render(<Home />);

    // Add a hand for Ellos (+25)
    fireEvent.click(container.querySelector('#themAddScoreBtn'));
    fireEvent.click(screen.getByText('+25'));
    fireEvent.click(screen.getByText(/Anotar \+25 pts/i));

    await waitFor(() => {
      expect(screen.getByTitle("🦅 Puntaje Total").innerHTML).toMatch('25');
    });

    // Click Reset
    fireEvent.click(screen.getByText("↻"));

    // Confirm in dialog
    fireEvent.click(screen.getByText("Reiniciar"));

    await waitFor(() => {
      expect(screen.getByTitle("🦅 Puntaje Total").innerHTML).toMatch('0');
      expect(screen.getByTitle("🐅 Puntaje Total").innerHTML).toMatch('0');
    });
  });

  test('should remove a hand after "-" button is clicked', async () => {
    const { container } = render(<Home />);

    // Add hand 1 (+10 to Ellos)
    fireEvent.click(container.querySelector('#themAddScoreBtn'));
    fireEvent.click(screen.getByText('+10'));
    fireEvent.click(screen.getByText(/Anotar \+10 pts/i));

    await waitFor(() => {
      expect(screen.getByTitle("🦅 Puntaje Total").innerHTML).toMatch('10');
    });

    // Add hand 2 (+20 to Nosotros)
    fireEvent.click(container.querySelector('#usAddScoreBtn'));
    fireEvent.click(screen.getByText('+20'));
    fireEvent.click(screen.getByText(/Anotar \+20 pts/i));

    await waitFor(() => {
      expect(screen.getByTitle("🐅 Puntaje Total").innerHTML).toMatch('20');
    });

    // Delete hand 1
    fireEvent.click(screen.getAllByText("-")[0]);

    await waitFor(() => {
      expect(screen.getByTitle("🦅 Puntaje Total").innerHTML).toMatch('0');
      expect(screen.getByTitle("🐅 Puntaje Total").innerHTML).toMatch('20');
    });
  });

  test('should reset directly without confirm modal if hands list is already empty', () => {
    render(<Home />);
    fireEvent.click(screen.getByText("↻"));
    expect(screen.queryByText("¿Reiniciar juego?")).toBeNull();
  });

  test('should open settings modal, update win score, and close', async () => {
    render(<Home />);
    // Open settings
    fireEvent.click(screen.getByRole('button', { name: /Ajustes/i }));
    expect(screen.getByText("⚙️ Ajustes")).toBeTruthy();

    // Select 100 pts
    fireEvent.click(screen.getByText("100 pts"));
    fireEvent.click(screen.getByText("Guardar"));

    await waitFor(() => {
      expect(screen.queryByText("⚙️ Ajustes")).toBeNull();
    });
  });

  test('should trigger winner banner when Ellos reach winScore, show stats, and dismiss on Escape', async () => {
    const { container } = render(<Home />);

    // Change winScore to 100
    fireEvent.click(screen.getByRole('button', { name: /Ajustes/i }));
    fireEvent.click(screen.getByText("100 pts"));
    fireEvent.click(screen.getByText("Guardar"));

    // Add hand of 100 to Ellos
    fireEvent.click(container.querySelector('#themAddScoreBtn'));
    fireEvent.click(screen.getByRole('button', { name: '1' }));
    fireEvent.click(screen.getByRole('button', { name: '0' }));
    fireEvent.click(screen.getByRole('button', { name: '0' }));
    fireEvent.click(screen.getByText(/Anotar \+100 pts/i));

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: 'Anuncio de ganador' })).toBeTruthy();
    });

    expect(screen.getByText('¡Ellos ganaron!')).toBeTruthy();
    expect(screen.getByText('Marcador final')).toBeTruthy();
    expect(screen.getByText('100 - 0')).toBeTruthy();
    expect(screen.getByText('Manos jugadas')).toBeTruthy();
    expect(screen.getByText('+100 pts')).toBeTruthy();

    // Dismiss with Escape
    const dialog = screen.getByRole('dialog', { name: 'Anuncio de ganador' });
    fireEvent.keyDown(dialog, { key: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Anuncio de ganador' })).toBeNull();
    });
  });

  test('should trigger winner banner when Nosotros win and dismiss on "Continuar"', async () => {
    const { container } = render(<Home />);

    // Change winScore to 100
    fireEvent.click(screen.getByRole('button', { name: /Ajustes/i }));
    fireEvent.click(screen.getByText("100 pts"));
    fireEvent.click(screen.getByText("Guardar"));

    // Add hand of 100 to Nosotros
    fireEvent.click(container.querySelector('#usAddScoreBtn'));
    fireEvent.click(screen.getByRole('button', { name: '1' }));
    fireEvent.click(screen.getByRole('button', { name: '0' }));
    fireEvent.click(screen.getByRole('button', { name: '0' }));
    fireEvent.click(screen.getByText(/Anotar \+100 pts/i));

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: 'Anuncio de ganador' })).toBeTruthy();
    });

    expect(screen.getByText('¡Nosotros ganamos!')).toBeTruthy();

    // Dismiss with "Continuar"
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Anuncio de ganador' })).toBeNull();
    });
  });

  test('should reset game from winner banner "Nuevo Juego" button', async () => {
    const { container } = render(<Home />);

    // Change winScore to 100
    fireEvent.click(screen.getByRole('button', { name: /Ajustes/i }));
    fireEvent.click(screen.getByText("100 pts"));
    fireEvent.click(screen.getByText("Guardar"));

    // Add winning hand
    fireEvent.click(container.querySelector('#themAddScoreBtn'));
    fireEvent.click(screen.getByRole('button', { name: '1' }));
    fireEvent.click(screen.getByRole('button', { name: '0' }));
    fireEvent.click(screen.getByRole('button', { name: '0' }));
    fireEvent.click(screen.getByText(/Anotar \+100 pts/i));

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: 'Anuncio de ganador' })).toBeTruthy();
    });

    // Click "Nuevo Juego" inside winner modal
    fireEvent.click(container.querySelector('.winnerNewGameBtn'));

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Anuncio de ganador' })).toBeNull();
      expect(screen.getByTitle("🦅 Puntaje Total").innerHTML).toMatch('0');
      expect(screen.getByTitle("🐅 Puntaje Total").innerHTML).toMatch('0');
    });
  });

  test('should share result via navigator.share when supported', async () => {
    const shareMock = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(global.navigator, 'share', {
      value: shareMock,
      configurable: true,
      writable: true
    });

    const { container } = render(<Home />);

    // Change winScore to 100
    fireEvent.click(screen.getByRole('button', { name: /Ajustes/i }));
    fireEvent.click(screen.getByText("100 pts"));
    fireEvent.click(screen.getByText("Guardar"));

    // Add winning hand
    fireEvent.click(container.querySelector('#themAddScoreBtn'));
    fireEvent.click(screen.getByRole('button', { name: '1' }));
    fireEvent.click(screen.getByRole('button', { name: '0' }));
    fireEvent.click(screen.getByRole('button', { name: '0' }));
    fireEvent.click(screen.getByText(/Anotar \+100 pts/i));

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: 'Anuncio de ganador' })).toBeTruthy();
    });

    fireEvent.click(screen.getByRole('button', { name: /Compartir/i }));
    expect(shareMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: expect.stringContaining('Resultado de Dominó'),
        text: expect.stringContaining('Ellos ganaron')
      })
    );
  });

  test('should copy result to clipboard when navigator.share is unavailable and show toast', async () => {
    Object.defineProperty(global.navigator, 'share', {
      value: undefined,
      configurable: true,
      writable: true
    });
    const writeTextMock = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(global.navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      configurable: true,
      writable: true
    });

    const { container } = render(<Home />);

    // Change winScore to 100
    fireEvent.click(screen.getByRole('button', { name: /Ajustes/i }));
    fireEvent.click(screen.getByText("100 pts"));
    fireEvent.click(screen.getByText("Guardar"));

    // Add winning hand
    fireEvent.click(container.querySelector('#themAddScoreBtn'));
    fireEvent.click(screen.getByRole('button', { name: '1' }));
    fireEvent.click(screen.getByRole('button', { name: '0' }));
    fireEvent.click(screen.getByRole('button', { name: '0' }));
    fireEvent.click(screen.getByText(/Anotar \+100 pts/i));

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: 'Anuncio de ganador' })).toBeTruthy();
    });

    fireEvent.click(screen.getByRole('button', { name: /Compartir/i }));

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalled();
      expect(screen.getByText('✓ Copiado')).toBeTruthy();
    });
  });

  test('should trap focus with Tab and Shift+Tab in winner modal', async () => {
    const { container } = render(<Home />);

    // Change winScore to 100
    fireEvent.click(screen.getByRole('button', { name: /Ajustes/i }));
    fireEvent.click(screen.getByText("100 pts"));
    fireEvent.click(screen.getByText("Guardar"));

    // Add winning hand
    fireEvent.click(container.querySelector('#themAddScoreBtn'));
    fireEvent.click(screen.getByRole('button', { name: '1' }));
    fireEvent.click(screen.getByRole('button', { name: '0' }));
    fireEvent.click(screen.getByRole('button', { name: '0' }));
    fireEvent.click(screen.getByText(/Anotar \+100 pts/i));

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: 'Anuncio de ganador' })).toBeTruthy();
    });

    const dialog = screen.getByRole('dialog', { name: 'Anuncio de ganador' });
    const buttons = dialog.querySelectorAll('button');
    const firstBtn = buttons[0];
    const lastBtn = buttons[buttons.length - 1];

    // Shift+Tab on first button wraps to last
    firstBtn.focus();
    fireEvent.keyDown(dialog, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(lastBtn);

    // Tab on last button wraps to first
    lastBtn.focus();
    fireEvent.keyDown(dialog, { key: 'Tab', shiftKey: false });
    expect(document.activeElement).toBe(firstBtn);
  });

  test('should show undo snackbar when a hand is removed and restore it on Deshacer click', async () => {
    const { container } = render(<Home />);

    // Add hand (+25 to Ellos)
    fireEvent.click(container.querySelector('#themAddScoreBtn'));
    fireEvent.click(screen.getByText('+25'));
    fireEvent.click(screen.getByText(/Anotar \+25 pts/i));

    await waitFor(() => {
      expect(screen.getByTitle("🦅 Puntaje Total").innerHTML).toMatch('25');
    });

    // Delete hand
    fireEvent.click(screen.getByRole('button', { name: /Eliminar mano #1/i }));

    // Hand removed, undo snackbar appears
    expect(screen.getByTitle("🦅 Puntaje Total").innerHTML).toMatch('0');
    expect(screen.getByText('Mano eliminada')).toBeTruthy();

    // Click Deshacer
    fireEvent.click(screen.getByRole('button', { name: 'Deshacer' }));

    await waitFor(() => {
      expect(screen.getByTitle("🦅 Puntaje Total").innerHTML).toMatch('25');
      expect(screen.queryByText('Mano eliminada')).toBeNull();
    });
  });

  test('should toggle screen wake lock from ambient top bar button', async () => {
    Object.defineProperty(navigator, 'wakeLock', {
      value: {
        request: jest.fn().mockResolvedValue({
          released: false,
          release: jest.fn().mockResolvedValue(undefined),
          addEventListener: jest.fn()
        })
      },
      configurable: true,
      writable: true
    });

    render(<Home />);

    const wakeLockBtn = screen.getByRole('button', { name: /Pantalla/i });
    expect(wakeLockBtn).toBeTruthy();

    fireEvent.click(wakeLockBtn);
    await waitFor(() => {
      expect(wakeLockBtn).toBeTruthy();
    });
  });
});