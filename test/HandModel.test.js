import { expect } from 'expect';
import HandModel from '../src/models/HandModel';

describe('HandModel', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('should initialize with empty array when localStorage is empty', () => {
    const model = new HandModel('test-hands');
    expect(model.hands).toEqual([]);
    expect(model.totalScores()).toEqual([0, 0]);
  });

  test('should initialize with existing hands from localStorage', () => {
    localStorage.setItem('test-hands', JSON.stringify([{ _id: '1', themScore: 20, usScore: 0 }]));
    const model = new HandModel('test-hands');
    expect(model.hands.length).toBe(1);
    expect(model.totalScores()).toEqual([20, 0]);
  });

  test('should recover gracefully when localStorage contains corrupted JSON', () => {
    localStorage.setItem('test-hands', 'invalid json{');
    const model = new HandModel('test-hands');
    expect(model.hands).toEqual([]);
  });

  test('should add hands, persist, and notify subscribers', () => {
    const model = new HandModel('test-hands');
    const subscriber = jest.fn();
    const unsubscribe = model.subscribe(subscriber);

    model.add(25, 0);
    expect(subscriber).toHaveBeenCalledTimes(1);
    expect(model.hands.length).toBe(1);
    expect(model.hands[0].themScore).toBe(25);
    expect(model.hands[0].usScore).toBe(0);

    model.add(0, 30);
    expect(subscriber).toHaveBeenCalledTimes(2);
    expect(model.totalScores()).toEqual([25, 30]);

    unsubscribe();
    model.add(10, 0);
    expect(subscriber).toHaveBeenCalledTimes(2); // no new calls after unsubscribe
  });

  test('should destroy individual hands and destroyAll', () => {
    const model = new HandModel('test-hands');
    model.add(15, 0);
    model.add(0, 25);
    expect(model.hands.length).toBe(2);

    const firstHand = model.hands[0];
    model.destroy(firstHand);
    expect(model.hands.length).toBe(1);
    expect(model.hands[0].usScore).toBe(25);

    model.destroyAll();
    expect(model.hands.length).toBe(0);
    expect(model.totalScores()).toEqual([0, 0]);
  });

  test('should dispose listeners', () => {
    const model = new HandModel('test-hands');
    const subscriber = jest.fn();
    model.subscribe(subscriber);
    model.dispose();
    model.inform();
    expect(subscriber).not.toHaveBeenCalled();
  });
});
