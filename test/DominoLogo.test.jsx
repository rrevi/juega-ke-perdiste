import { describe, test, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/preact';
import DominoLogo from '../src/components/DominoLogo';

describe('DominoLogo', () => {
  const originalVibrate = navigator.vibrate;

  afterEach(() => {
    if (originalVibrate !== undefined) {
      navigator.vibrate = originalVibrate;
    } else {
      delete navigator.vibrate;
    }
  });

  test('should render JKP! domino tiles logo and trigger click haptic', () => {
    const vibrateMock = vi.fn();
    navigator.vibrate = vibrateMock;

    render(<DominoLogo />);

    const logo = screen.getByRole('banner', { name: 'Juega ke perdiste!' });
    expect(logo).toBeTruthy();
    expect(screen.getByTitle('Juega ke perdiste!')).toBeTruthy();

    fireEvent.click(logo);
    expect(vibrateMock).toHaveBeenCalledWith(12);
  });
});
