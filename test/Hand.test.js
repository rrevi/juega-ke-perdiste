import { expect } from 'expect';
import { h } from 'preact';
import { render, screen, fireEvent } from '@testing-library/preact';
import Hand from '../src/components/Hand';

describe('Hand component', () => {
  test('should render hand with default index when index is omitted', () => {
    const onRemove = jest.fn();
    const hand = { _id: '1', themScore: 15, usScore: 0 };
    render(
      <table>
        <tbody>
          <Hand hand={hand} onRemove={onRemove} />
        </tbody>
      </table>
    );

    expect(screen.getByText('#1')).toBeTruthy();
    expect(screen.getByText('15')).toBeTruthy();
    expect(screen.getByText('—')).toBeTruthy();

    const removeBtn = screen.getByRole('button', { name: /Eliminar mano #1/i });
    fireEvent.click(removeBtn);
    expect(onRemove).toHaveBeenCalled();
  });
});
