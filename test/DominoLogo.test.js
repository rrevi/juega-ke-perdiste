import { expect } from 'expect';
import { h } from 'preact';
import { render, screen } from '@testing-library/preact';
import DominoLogo from '../src/components/DominoLogo';

describe('DominoLogo', () => {
  test('should render JKP! domino tiles and brand title', () => {
    render(<DominoLogo />);

    expect(screen.getByText('Juega ke perdiste!')).toBeTruthy();
    expect(screen.getByTitle('J-K-P-!')).toBeTruthy();
  });
});
