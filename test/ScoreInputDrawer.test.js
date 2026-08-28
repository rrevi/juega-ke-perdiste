import { expect } from 'expect';
import { h } from 'preact';
import { render, fireEvent, screen } from '@testing-library/preact';
import ScoreInputDrawer from '../src/components/ScoreInputDrawer';

describe('ScoreInputDrawer', () => {
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
    expect(screen.getByText('Guardar +25 pts')).toBeTruthy();

    // Click Save
    fireEvent.click(screen.getByText('Guardar +25 pts'));
    expect(handleSubmit).toHaveBeenCalledWith(25);
    expect(handleClose).toHaveBeenCalled();
  });
});
