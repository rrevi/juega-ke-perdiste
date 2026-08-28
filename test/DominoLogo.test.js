import { expect } from 'expect';
import { h } from 'preact';
import { render, screen } from '@testing-library/preact';
import DominoLogo from '../src/components/DominoLogo';

describe('DominoLogo', () => {
  test('should render JKP! domino tiles logo', () => {
    render(<DominoLogo />);

    expect(screen.getByRole('banner', { name: 'Juega ke perdiste!' })).toBeTruthy();
    expect(screen.getByTitle('Juega ke perdiste!')).toBeTruthy();
  });
});
