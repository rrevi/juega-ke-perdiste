import { expect } from 'expect';
import { h } from 'preact';
import { render, screen } from '@testing-library/preact';
import { Header } from '../src/components/Header';

describe('Header', () => {
  test('should render logo without actions', () => {
    render(<Header />);
    expect(screen.getByRole('banner', { name: 'Juega ke perdiste!' })).toBeTruthy();
  });

  test('should render rightAction when provided', () => {
    render(
      <Header
        rightAction={<button type="button">Ayuda</button>}
      />
    );
    expect(screen.getByText('Ayuda')).toBeTruthy();
  });
});
