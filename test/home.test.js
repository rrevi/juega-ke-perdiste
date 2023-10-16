import { expect } from 'expect';
import { h } from 'preact';
import { render, fireEvent, screen, waitFor } from '@testing-library/preact';

import { Home } from '../src/pages/Home';

describe('Home', () => {
  test('should display initial score', () => {
    render(<Home />);

    expect(screen.getByTitle("Them Total Score").innerHTML).toMatch('0');
    expect(screen.getByTitle("Us Total Score").innerHTML).toMatch('0');
  });

  test('should not add empty hand after "+" button is clicked', async () => {
    render(<Home />);

    fireEvent.click(screen.getByText('+'));
    await waitFor(() => {
      expect(screen.getByTitle("Them Total Score").innerHTML).toMatch('0');
      expect(screen.getByTitle("Us Total Score").innerHTML).toMatch('0');
    });
  });

  test('should add them hand after "+" button is clicked', async () => {
    render(<Home />);

    const themHandScore = await screen.getByTitle("Them Hand Score");
    fireEvent.change(themHandScore, { target: { value: 5 } });

    fireEvent.click(screen.getByText('+'));
    await waitFor(() => {
        expect(screen.getByTitle("Them Total Score").innerHTML).toMatch('5');
        expect(screen.getByTitle("Us Total Score").innerHTML).toMatch('0');
    });
  });

  test('should add us hand after "+" button is clicked', async () => {
    render(<Home />);

    const usHandScore = await screen.getByTitle("Us Hand Score");
    fireEvent.change(usHandScore, { target: { value: 5 } });

    fireEvent.click(screen.getByText('+'));
    await waitFor(() => {
        expect(screen.getByTitle("Them Total Score").innerHTML).toMatch('0');
        expect(screen.getByTitle("Us Total Score").innerHTML).toMatch('5');
    });
  });

  test('should clear all hands after "↻" button is clicked', async () => {
    render(<Home />);

    const themHandScore = await screen.getByTitle("Them Hand Score");
    fireEvent.change(themHandScore, { target: { value: 5 } });

    fireEvent.click(screen.getByText('+'));
    await waitFor(() => {
        expect(screen.getByTitle("Them Total Score").innerHTML).toMatch('5');
        expect(screen.getByTitle("Us Total Score").innerHTML).toMatch('0');
    });

    const usHandScore = await screen.getByTitle("Us Hand Score");
    fireEvent.change(usHandScore, { target: { value: 25 } });

    fireEvent.click(screen.getByText('+'));
    await waitFor(() => {
        expect(screen.getByTitle("Them Total Score").innerHTML).toMatch('5');
        expect(screen.getByTitle("Us Total Score").innerHTML).toMatch('25');
    });

    fireEvent.click(screen.getByText("↻"));
    await waitFor(() => {
        expect(screen.getByTitle("Them Total Score").innerHTML).toMatch('0');
        expect(screen.getByTitle("Us Total Score").innerHTML).toMatch('0');
    });
  });
});