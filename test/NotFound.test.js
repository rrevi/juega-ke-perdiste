import { expect } from 'expect';
import { h } from 'preact';
import { render, screen } from '@testing-library/preact';
import NotFound from '../src/pages/_404';

describe('NotFound', () => {
  test('should render 404 message', () => {
    render(<NotFound />);
    expect(screen.getByText('404: No encontrado')).toBeTruthy();
    expect(screen.getByText('Página no encontrada')).toBeTruthy();
  });
});
