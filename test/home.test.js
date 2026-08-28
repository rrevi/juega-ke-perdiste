import { expect } from 'expect';
import { h } from 'preact';
import { render, fireEvent, screen, waitFor } from '@testing-library/preact';

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

  test('should add 🦅 hand via drawer and preset', async () => {
    const { container } = render(<Home />);

    // Click "+ Ellos" button to open score drawer
    const themBtn = container.querySelector('#themAddScoreBtn');
    fireEvent.click(themBtn);

    // Select preset "+25"
    fireEvent.click(screen.getByText('+25'));

    // Save
    fireEvent.click(screen.getByText(/Guardar \+25 pts/i));

    await waitFor(() => {
      expect(screen.getByTitle("🦅 Puntaje Total").innerHTML).toMatch('25');
      expect(screen.getByTitle("🐅 Puntaje Total").innerHTML).toMatch('0');
    });
  });

  test('should add 🐅 hand via drawer and keypad', async () => {
    const { container } = render(<Home />);

    // Click "+ Nosotros" button to open score drawer
    const usBtn = container.querySelector('#usAddScoreBtn');
    fireEvent.click(usBtn);

    // Enter digits 3, 0 -> 30 pts
    fireEvent.click(screen.getByRole('button', { name: '3' }));
    fireEvent.click(screen.getByRole('button', { name: '0' }));

    // Save
    fireEvent.click(screen.getByText(/Guardar \+30 pts/i));

    await waitFor(() => {
      expect(screen.getByTitle("🦅 Puntaje Total").innerHTML).toMatch('0');
      expect(screen.getByTitle("🐅 Puntaje Total").innerHTML).toMatch('30');
    });
  });

  test('should clear all hands after "↻" button is clicked and confirmed', async () => {
    const { container } = render(<Home />);

    // Add a hand for Ellos (+25)
    fireEvent.click(container.querySelector('#themAddScoreBtn'));
    fireEvent.click(screen.getByText('+25'));
    fireEvent.click(screen.getByText(/Guardar \+25 pts/i));

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
    fireEvent.click(container.querySelector('#themAddScoreBtn'));
    fireEvent.click(screen.getByText('+10'));
    fireEvent.click(screen.getByText(/Guardar \+10 pts/i));

    await waitFor(() => {
      expect(screen.getByTitle("🦅 Puntaje Total").innerHTML).toMatch('10');
    });

    // Add hand 2 (+20 to Nosotros)
    fireEvent.click(container.querySelector('#usAddScoreBtn'));
    fireEvent.click(screen.getByText('+20'));
    fireEvent.click(screen.getByText(/Guardar \+20 pts/i));

    await waitFor(() => {
      expect(screen.getByTitle("🐅 Puntaje Total").innerHTML).toMatch('20');
    });

    // Delete hand 1
    fireEvent.click(screen.getAllByText("-")[0]);

    await waitFor(() => {
      expect(screen.getByTitle("🦅 Puntaje Total").innerHTML).toMatch('0');
      expect(screen.getByTitle("🐅 Puntaje Total").innerHTML).toMatch('20');
    });
  });
});