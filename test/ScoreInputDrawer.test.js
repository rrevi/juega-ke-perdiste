import { expect } from 'expect';
import { h } from 'preact';
import { render, fireEvent, screen } from '@testing-library/preact';
import ScoreInputDrawer from '../src/components/ScoreInputDrawer';

describe('ScoreInputDrawer', () => {
  beforeAll(() => {
    if (typeof window !== 'undefined' && window.HTMLElement) {
      window.HTMLElement.prototype.ontouchstart = null;
      window.HTMLElement.prototype.ontouchmove = null;
      window.HTMLElement.prototype.ontouchend = null;
    }
  });

  test('should render when isOpen is true and handle keypad & preset clicks', () => {
    const handleSubmit = jest.fn();
    const handleClose = jest.fn();

    const { rerender } = render(
      <ScoreInputDrawer
        isOpen={false}
        team="them"
        teamName="Ellos"
        teamEmoji="🦅"
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    );

    expect(screen.queryByText('Sumar a')).toBeNull();

    rerender(
      <ScoreInputDrawer
        isOpen={true}
        team="them"
        teamName="Ellos"
        teamEmoji="🦅"
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    );

    expect(screen.getByText('Ellos')).toBeTruthy();

    // Click preset "+25"
    fireEvent.click(screen.getByText('+25'));
    expect(screen.getByText('Anotar +25 pts')).toBeTruthy();

    // Click Save
    fireEvent.click(screen.getByText('Anotar +25 pts'));
    expect(handleSubmit).toHaveBeenCalledWith(25);
    expect(handleClose).toHaveBeenCalled();
  });

  test('should handle backspace and clear buttons', () => {
    render(
      <ScoreInputDrawer
        isOpen={true}
        team="us"
        teamName="Nosotros"
        teamEmoji="🐅"
        onClose={jest.fn()}
        onSubmit={jest.fn()}
      />
    );

    // Enter digits 4, 5 -> 45
    fireEvent.click(screen.getByRole('button', { name: '4' }));
    fireEvent.click(screen.getByRole('button', { name: '5' }));
    expect(screen.getByText('Anotar +45 pts')).toBeTruthy();

    // Click backspace -> 4
    fireEvent.click(screen.getByRole('button', { name: 'Borrar' }));
    expect(screen.getByText('Anotar +4 pts')).toBeTruthy();

    // Click clear -> 0
    fireEvent.click(screen.getByRole('button', { name: 'C' }));
    expect(screen.getByText('Anotar +0 pts').disabled).toBe(true);
  });

  test('should show error and disable save when score exceeds max score', () => {
    render(
      <ScoreInputDrawer
        isOpen={true}
        team="them"
        teamName="Ellos"
        teamEmoji="🦅"
        maxScore={168}
        onClose={jest.fn()}
        onSubmit={jest.fn()}
      />
    );

    // Enter 2, 0, 0 -> 200 (> 168)
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    fireEvent.click(screen.getByRole('button', { name: '0' }));
    fireEvent.click(screen.getByRole('button', { name: '0' }));

    expect(screen.getByText(/Máximo: 168 pts/i)).toBeTruthy();
    expect(screen.getByText('Anotar +200 pts').disabled).toBe(true);
  });

  test('should cap at max score when preset overflows and close on ✕', () => {
    const handleClose = jest.fn();
    render(
      <ScoreInputDrawer
        isOpen={true}
        team="us"
        teamName="Nosotros"
        teamEmoji="🐅"
        maxScore={168}
        onClose={handleClose}
        onSubmit={jest.fn()}
      />
    );

    // Preset +50 three times (150)
    fireEvent.click(screen.getByText('+50'));
    fireEvent.click(screen.getByText('+50'));
    fireEvent.click(screen.getByText('+50'));

    // Preset +50 again -> 200 > 168, should cap at 168
    fireEvent.click(screen.getByText('+50'));
    expect(screen.getByText(/Máximo: 168 pts/i)).toBeTruthy();
    expect(screen.getByText('Anotar +168 pts')).toBeTruthy();

    // Click close button
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar' }));
    expect(handleClose).toHaveBeenCalled();
  });

  test('should defensively guard against saving zero or overflow if button is clicked', () => {
    const handleSubmit = jest.fn();
    render(
      <ScoreInputDrawer
        isOpen={true}
        team="them"
        teamName="Ellos"
        teamEmoji="🦅"
        maxScore={100}
        onClose={jest.fn()}
        onSubmit={handleSubmit}
      />
    );

    const saveBtn = screen.getByText('Anotar +0 pts');
    saveBtn.removeAttribute('disabled');
    fireEvent.click(saveBtn);
    expect(handleSubmit).not.toHaveBeenCalled();

    // Type 150 (> 100)
    fireEvent.click(screen.getByRole('button', { name: '1' }));
    fireEvent.click(screen.getByRole('button', { name: '5' }));
    fireEvent.click(screen.getByRole('button', { name: '0' }));

    const overflowSaveBtn = screen.getByText('Anotar +150 pts');
    overflowSaveBtn.removeAttribute('disabled');
    fireEvent.click(overflowSaveBtn);
    expect(handleSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/Máximo: 100 pts/i)).toBeTruthy();
  });

  test('should dismiss drawer on swipe down beyond threshold and spring back on small drag', () => {
    const handleClose = jest.fn();
    const { container } = render(
      <ScoreInputDrawer
        isOpen={true}
        team="them"
        teamName="Ellos"
        teamEmoji="🦅"
        onClose={handleClose}
        onSubmit={jest.fn()}
      />
    );

    const handle = container.querySelector('.drawerDragHandleArea');

    // Small drag: deltaY = 30 (< 80)
    fireEvent.touchStart(handle, { touches: [{ clientY: 100 }] });
    fireEvent.touchMove(handle, { touches: [{ clientY: 130 }] });
    fireEvent.touchEnd(handle);
    expect(handleClose).not.toHaveBeenCalled();

    // Large drag: deltaY = 120 (> 80)
    fireEvent.touchStart(handle, { touches: [{ clientY: 100 }] });
    fireEvent.touchMove(handle, { touches: [{ clientY: 220 }] });
    fireEvent.touchEnd(handle);
    expect(handleClose).toHaveBeenCalledTimes(1);

    // Upward drag with dampened resistance
    fireEvent.touchStart(handle, { touches: [{ clientY: 100 }] });
    fireEvent.touchMove(handle, { touches: [{ clientY: 80 }] });
    fireEvent.touchEnd(handle);
  });
});
