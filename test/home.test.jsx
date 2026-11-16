import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, screen, waitFor } from '@testing-library/preact';
import renderToString from 'preact-render-to-string';

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

  test('should hydrate the prerender before applying saved scores and browser capabilities', async () => {
    const container = document.body.appendChild(document.createElement('div'));
    container.innerHTML = renderToString(<Home />);

    localStorage.setItem('jkp-hands', JSON.stringify([{ _id: 'saved', themScore: 25, usScore: 0 }]));
    localStorage.setItem('jkp-win-score', '150');
    localStorage.setItem('jkp-team1', JSON.stringify({ name: 'Águilas', emoji: '🦁' }));
    const wakeLock = {
      request: vi.fn().mockResolvedValue({
        released: false,
        release: vi.fn().mockResolvedValue(undefined),
        addEventListener: vi.fn()
      })
    };
    Object.defineProperty(navigator, 'wakeLock', { configurable: true, value: wakeLock });

    try {
      const options = { container, hydrate: true };
      render(<Home />, options);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Ajustes (Meta: 150)' })).toBeTruthy();
        expect(screen.getByRole('img', { name: 'Águilas' })).toBeTruthy();
        expect(container.querySelector('#wakeLockButton')).toBeTruthy();
        expect(container.querySelectorAll('#newGameButton')).toHaveLength(1);
        expect(container.querySelector('.handRow td').getAttribute('colspan')).toBeNull();
        expect(container.querySelector('.handRow td').textContent).toBe('25');
        expect(container.querySelector('.emptyHandsRow')).toBeNull();
      });
    } finally {
      Reflect.deleteProperty(navigator, 'wakeLock');
    }
  });

  test('should allow scoring and undo when site storage is denied', () => {
    const storage = vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
      throw new DOMException('Site storage is disabled', 'SecurityError');
    });

    try {
      render(<Home />);
      expect(screen.getByRole('button', { name: 'Ajustes (Meta: 200)' })).toBeTruthy();
      fireEvent.click(screen.getByRole('button', { name: /\+ Ellos/ }));
      fireEvent.click(screen.getByRole('button', { name: '+25' }));
      fireEvent.click(screen.getByRole('button', { name: 'Anotar +25 pts' }));
      expect(screen.getByTitle('🦅 Puntaje Total').textContent).toBe('25');

      fireEvent.click(screen.getByRole('button', { name: /Eliminar mano #1/ }));
      expect(screen.getByTitle('🦅 Puntaje Total').textContent).toBe('0');
      fireEvent.click(screen.getByRole('button', { name: 'Deshacer' }));
      expect(screen.getByTitle('🦅 Puntaje Total').textContent).toBe('25');
      fireEvent.click(screen.getByRole('button', { name: 'Nuevo juego' }));
      fireEvent.click(screen.getByRole('button', { name: 'Reiniciar' }));
      expect(screen.getByTitle('🦅 Puntaje Total').textContent).toBe('0');
    } finally {
      storage.mockRestore();
    }
  });

  test('should add 🦅 hand via drawer and preset', async () => {
    const { container } = render(<Home />);

    // Click "+ Ellos" button to open score drawer
    const themBtn = screen.getByRole('button', { name: /\+ Ellos/i });
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
    const usBtn = screen.getByRole('button', { name: /\+ Nosotros/i });
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
    fireEvent.click(screen.getByRole('button', { name: /\+ Ellos/i }));
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
    fireEvent.click(screen.getByRole('button', { name: /\+ Ellos/i }));
    fireEvent.click(screen.getByText('+10'));
    fireEvent.click(screen.getByText(/Anotar \+10 pts/i));

    await waitFor(() => {
      expect(screen.getByTitle("🦅 Puntaje Total").innerHTML).toMatch('10');
    });

    // Add hand 2 (+20 to Nosotros)
    fireEvent.click(screen.getByRole('button', { name: /\+ Nosotros/i }));
    fireEvent.click(screen.getByText('+20'));
    fireEvent.click(screen.getByText(/Anotar \+20 pts/i));

    await waitFor(() => {
      expect(screen.getByTitle("🐅 Puntaje Total").innerHTML).toMatch('20');
    });

    // Delete hand 1
    fireEvent.click(screen.getByRole('button', { name: /Eliminar mano #1/i }));

    await waitFor(() => {
      expect(screen.getByTitle("🦅 Puntaje Total").innerHTML).toMatch('0');
      expect(screen.getByTitle("🐅 Puntaje Total").innerHTML).toMatch('20');
    });
  });

  test('should display hands in inverted order with newest hand on top', async () => {
    const { container } = render(<Home />);

    // Add hand 1 (+10 to Ellos)
    fireEvent.click(screen.getByRole('button', { name: /\+ Ellos/i }));
    fireEvent.click(screen.getByText('+10'));
    fireEvent.click(screen.getByText(/Anotar \+10 pts/i));

    // Add hand 2 (+20 to Nosotros)
    fireEvent.click(screen.getByRole('button', { name: /\+ Nosotros/i }));
    fireEvent.click(screen.getByText('+20'));
    fireEvent.click(screen.getByText(/Anotar \+20 pts/i));

    await waitFor(() => {
      const rows = container.querySelectorAll('.handRow');
      expect(rows.length).toBe(2);
      // Newest hand (Hand #2) is on top
      expect(rows[0].textContent).toContain('#2');
      expect(rows[0].textContent).toContain('20');
      // Oldest hand (Hand #1) is at the bottom
      expect(rows[1].textContent).toContain('#1');
      expect(rows[1].textContent).toContain('10');
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
    fireEvent.click(screen.getByRole('button', { name: /\+ Ellos/i }));
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
    fireEvent.click(screen.getByRole('button', { name: /\+ Nosotros/i }));
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
    fireEvent.click(screen.getByRole('button', { name: /\+ Ellos/i }));
    fireEvent.click(screen.getByRole('button', { name: '1' }));
    fireEvent.click(screen.getByRole('button', { name: '0' }));
    fireEvent.click(screen.getByRole('button', { name: '0' }));
    fireEvent.click(screen.getByText(/Anotar \+100 pts/i));

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: 'Anuncio de ganador' })).toBeTruthy();
    });

    // Click "Nuevo Juego" inside winner modal
    fireEvent.click(/** @type {HTMLElement} */ (container.querySelector('.winnerNewGameBtn')));

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Anuncio de ganador' })).toBeNull();
      expect(screen.getByTitle("🦅 Puntaje Total").innerHTML).toMatch('0');
      expect(screen.getByTitle("🐅 Puntaje Total").innerHTML).toMatch('0');
    });
  });

  test('should share result via navigator.share when supported', async () => {
    const shareMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(globalThis.navigator, 'share', {
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
    fireEvent.click(screen.getByRole('button', { name: /\+ Ellos/i }));
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
    Object.defineProperty(globalThis.navigator, 'share', {
      value: undefined,
      configurable: true,
      writable: true
    });
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(globalThis.navigator, 'clipboard', {
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
    fireEvent.click(screen.getByRole('button', { name: /\+ Ellos/i }));
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
    fireEvent.click(screen.getByRole('button', { name: /\+ Ellos/i }));
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
    fireEvent.click(screen.getByRole('button', { name: /\+ Ellos/i }));
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

  test('should keep keyboard focus in the score drawer and restore it after dismissal', () => {
    render(<Home />);

    const themButton = screen.getByRole('button', { name: /\+ Ellos/ });
    const usButton = screen.getByRole('button', { name: /\+ Nosotros/ });
    themButton.focus();
    fireEvent.click(usButton);
    const closeButton = screen.getByRole('button', { name: 'Cerrar' });
    expect(document.activeElement).toBe(closeButton);

    fireEvent.keyDown(closeButton, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Borrar' }));
    fireEvent.keyDown(/** @type {Element} */ (document.activeElement), { key: 'Tab' });
    expect(document.activeElement).toBe(closeButton);

    fireEvent.keyDown(closeButton, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(usButton);
  });

  test('should return focus to the trigger after dismissing settings and reset confirmation', () => {
    localStorage.setItem('jkp-hands', JSON.stringify([{ _id: 'saved', themScore: 25, usScore: 0 }]));
    render(<Home />);

    const settings = screen.getByRole('button', { name: /Ajustes/ });
    fireEvent.click(settings);
    const close = screen.getByRole('button', { name: 'Cerrar' });
    close.focus();
    fireEvent.keyDown(close, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(settings);

    const reset = screen.getByRole('button', { name: 'Nuevo juego' });
    fireEvent.click(reset);
    const cancel = screen.getByRole('button', { name: 'Cancelar' });
    cancel.focus();
    fireEvent.click(cancel);
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(reset);
  });

  test('should toggle screen wake lock from ambient top bar button', async () => {
    Object.defineProperty(navigator, 'wakeLock', {
      value: {
        request: vi.fn().mockResolvedValue({
          released: false,
          release: vi.fn().mockResolvedValue(undefined),
          addEventListener: vi.fn()
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

  test('should clear undo snackbar on game reset', async () => {
    const { container } = render(<Home />);

    // Add 2 hands so deleting 1 leaves hands > 0 to trigger confirm reset
    fireEvent.click(screen.getByRole('button', { name: /\+ Ellos/i }));
    fireEvent.click(screen.getByText('+25'));
    fireEvent.click(screen.getByText(/Anotar \+25 pts/i));

    fireEvent.click(screen.getByRole('button', { name: /\+ Nosotros/i }));
    fireEvent.click(screen.getByText('+10'));
    fireEvent.click(screen.getByText(/Anotar \+10 pts/i));

    await waitFor(() => {
      expect(screen.getByTitle("🦅 Puntaje Total").innerHTML).toMatch('25');
    });

    // Delete hand #1 -> undo snackbar appears
    fireEvent.click(screen.getByRole('button', { name: /Eliminar mano #1/i }));
    expect(screen.getByText('Mano eliminada')).toBeTruthy();

    // Reset game
    fireEvent.click(screen.getByText("↻"));
    fireEvent.click(screen.getByText("Reiniciar"));

    await waitFor(() => {
      expect(screen.queryByText('Mano eliminada')).toBeNull();
      expect(screen.getByTitle("🦅 Puntaje Total").innerHTML).toMatch('0');
      expect(screen.getByTitle("🐅 Puntaje Total").innerHTML).toMatch('0');
    });
  });

  test('should fallback safely on malformed localStorage settings and trigger winner when winScore is lowered', async () => {
    localStorage.setItem('jkp-win-score', '0');
    localStorage.setItem('jkp-team1', 'null');

    const { container } = render(<Home />);

    // Default fallback team1 and winScore=200 (not an instant win at 0)
    expect(screen.queryByRole('dialog', { name: 'Anuncio de ganador' })).toBeNull();
    expect(screen.getByRole('button', { name: /Ajustes \(Meta: 200\)/i })).toBeTruthy();

    // Add 100 pts to Ellos (still below 200)
    fireEvent.click(screen.getByRole('button', { name: /\+ Ellos/i }));
    fireEvent.click(screen.getByText('+50'));
    fireEvent.click(screen.getByText('+50'));
    fireEvent.click(screen.getByText(/Anotar \+100 pts/i));

    await waitFor(() => {
      expect(screen.getByTitle("🦅 Puntaje Total").innerHTML).toMatch('100');
    });
    expect(screen.queryByRole('dialog', { name: 'Anuncio de ganador' })).toBeNull();

    // Lower winScore to 100 -> winner banner triggers immediately
    fireEvent.click(screen.getByRole('button', { name: /Ajustes/i }));
    fireEvent.click(screen.getByText("100 pts"));
    fireEvent.click(screen.getByText("Guardar"));

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: 'Anuncio de ganador' })).toBeTruthy();
    });
  });
});
