import { expect } from 'expect';
import { h } from 'preact';
import { render, screen } from '@testing-library/preact';
import NotFound from '../src/pages/_404';

describe('NotFound', () => {
  test('should render 404 message', () => {
    render(<NotFound />);
    expect(screen.getByText('404: Not Found')).toBeTruthy();
    expect(screen.getByText("It's gone :(")).toBeTruthy();
  });
});
