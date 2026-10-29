import { expect } from 'expect';
import { h } from 'preact';
import { render, screen, fireEvent } from '@testing-library/preact';
import DominoLogo from '../src/components/DominoLogo';

describe('DominoLogo', () => {
  test('should render JKP! domino tiles logo and trigger click haptic', () => {
    const vibrateMock = jest.fn();
    Object.defineProperty(global, 'navigator', {
      value: { vibrate: vibrateMock },
      configurable: true
    });

    render(<DominoLogo />);

    const logo = screen.getByRole('banner', { name: 'Juega ke perdiste!' });
    expect(logo).toBeTruthy();
    expect(screen.getByTitle('Juega ke perdiste!')).toBeTruthy();

    fireEvent.click(logo);
    expect(vibrateMock).toHaveBeenCalledWith(12);
  });
});
