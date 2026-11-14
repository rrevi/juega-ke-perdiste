import { expect } from 'expect';
import {
  isWakeLockSupported,
  isWakeLockActive,
  requestWakeLock,
  releaseWakeLock,
  toggleWakeLock,
  onWakeLockChange,
  triggerHaptic
} from '../src/utils/hardware';

describe('hardware utils', () => {
  const originalVibrate = navigator.vibrate;
  const originalWakeLock = navigator.wakeLock;

  afterEach(() => {
    if (originalVibrate !== undefined) {
      navigator.vibrate = originalVibrate;
    } else {
      delete navigator.vibrate;
    }
    if (originalWakeLock !== undefined) {
      navigator.wakeLock = originalWakeLock;
    } else {
      delete navigator.wakeLock;
    }
    jest.restoreAllMocks();
  });

  describe('isWakeLockSupported', () => {
    test('should return true when wakeLock exists in navigator', () => {
      Object.defineProperty(navigator, 'wakeLock', {
        value: {},
        configurable: true,
        writable: true
      });
      expect(isWakeLockSupported()).toBe(true);
    });

    test('should return false when wakeLock is absent', () => {
      delete navigator.wakeLock;
      expect(isWakeLockSupported()).toBe(false);
    });
  });

  describe('requestWakeLock and releaseWakeLock', () => {
    test('should request wake lock and release it safely', async () => {
      const releaseMock = jest.fn().mockResolvedValue(undefined);
      const sentinel = {
        released: false,
        release: releaseMock,
        addEventListener: jest.fn()
      };

      const requestMock = jest.fn().mockResolvedValue(sentinel);
      Object.defineProperty(navigator, 'wakeLock', {
        value: { request: requestMock },
        configurable: true,
        writable: true
      });

      const acquired = await requestWakeLock();
      expect(acquired).toBe(true);
      expect(requestMock).toHaveBeenCalledWith('screen');

      // Re-requesting when active should return true without calling request again
      const reacquired = await requestWakeLock();
      expect(reacquired).toBe(true);
      expect(requestMock).toHaveBeenCalledTimes(1);

      // Release
      await releaseWakeLock();
      expect(releaseMock).toHaveBeenCalled();
    });

    test('should handle requestWakeLock rejection gracefully', async () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      Object.defineProperty(navigator, 'wakeLock', {
        value: {
          request: jest.fn().mockRejectedValue(new Error('Permission denied'))
        },
        configurable: true,
        writable: true
      });

      const acquired = await requestWakeLock();
      expect(acquired).toBe(false);
      expect(warnSpy).toHaveBeenCalled();
    });

    test('should return false from requestWakeLock when wakeLock is not supported', async () => {
      delete navigator.wakeLock;
      const acquired = await requestWakeLock();
      expect(acquired).toBe(false);
    });

    test('should handle releaseWakeLock rejection gracefully', async () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const sentinel = {
        released: false,
        release: jest.fn().mockRejectedValueOnce(new Error('Release failed')).mockResolvedValue(undefined),
        addEventListener: jest.fn()
      };
      Object.defineProperty(navigator, 'wakeLock', {
        value: { request: jest.fn().mockResolvedValue(sentinel) },
        configurable: true,
        writable: true
      });

      await requestWakeLock();
      await releaseWakeLock();
      expect(warnSpy).toHaveBeenCalledWith('Wake Lock release failed:', expect.any(Error));
      expect(isWakeLockActive()).toBe(true);
      await releaseWakeLock();
      expect(isWakeLockActive()).toBe(false);
    });
  });

  describe('isWakeLockActive and onWakeLockChange', () => {
    test('should track wake lock state and notify subscribers', async () => {
      let releaseListener = null;
      const sentinel = {
        released: false,
        release: jest.fn().mockImplementation(async () => {
          sentinel.released = true;
          if (releaseListener) releaseListener();
        }),
        addEventListener: jest.fn((evt, cb) => {
          if (evt === 'release') releaseListener = cb;
        })
      };

      Object.defineProperty(navigator, 'wakeLock', {
        value: {
          request: jest.fn(async () => {
            sentinel.released = false;
            return sentinel;
          })
        },
        configurable: true,
        writable: true
      });

      const listener = jest.fn();
      const unsubscribe = onWakeLockChange(listener);

      expect(isWakeLockActive()).toBe(false);

      await requestWakeLock();
      expect(isWakeLockActive()).toBe(true);
      expect(listener).toHaveBeenCalledWith(true);

      // Trigger sentinel release event
      await releaseWakeLock();
      expect(isWakeLockActive()).toBe(false);
      expect(listener).toHaveBeenCalledWith(false);

      // Unsubscribe check
      unsubscribe();
      await requestWakeLock();
      // listener shouldn't receive new calls
      expect(listener).toHaveBeenCalledTimes(2);

      await releaseWakeLock();
    });
  });

  describe('toggleWakeLock', () => {
    test('should toggle wake lock active state', async () => {
      const releaseMock = jest.fn().mockResolvedValue(undefined);
      const sentinel = {
        released: false,
        release: releaseMock,
        addEventListener: jest.fn()
      };

      Object.defineProperty(navigator, 'wakeLock', {
        value: { request: jest.fn().mockResolvedValue(sentinel) },
        configurable: true,
        writable: true
      });

      // Initially inactive, toggling should activate
      const activated = await toggleWakeLock();
      expect(activated).toBe(true);
      expect(isWakeLockActive()).toBe(true);

      // Active now, toggling should deactivate
      const deactivated = await toggleWakeLock();
      expect(deactivated).toBe(false);
      expect(isWakeLockActive()).toBe(false);
      expect(releaseMock).toHaveBeenCalled();
    });

    test('should release a pending lock when toggled off before it is granted', async () => {
      let resolveRequest;
      const request = jest.fn(() => new Promise(resolve => { resolveRequest = resolve; }));
      const sentinel = {
        released: false,
        release: jest.fn().mockResolvedValue(undefined),
        addEventListener: jest.fn()
      };
      Object.defineProperty(navigator, 'wakeLock', {
        value: { request },
        configurable: true,
        writable: true
      });
      const listener = jest.fn();
      const unsubscribe = onWakeLockChange(listener);

      const enabling = toggleWakeLock();
      await Promise.resolve();
      const overlappingRequest = requestWakeLock();
      const disabling = toggleWakeLock();
      resolveRequest(sentinel);

      expect(await Promise.all([enabling, overlappingRequest, disabling])).toEqual([false, false, false]);
      expect(request).toHaveBeenCalledTimes(1);
      expect(sentinel.release).toHaveBeenCalledTimes(1);
      expect(isWakeLockActive()).toBe(false);
      expect(listener).not.toHaveBeenCalledWith(true);
      unsubscribe();
    });

    test('should wait for a release before acquiring a new lock', async () => {
      let resolveRelease;
      const firstLock = {
        released: false,
        release: jest.fn(() => new Promise(resolve => { resolveRelease = resolve; })),
        addEventListener: jest.fn()
      };
      const secondLock = {
        released: false,
        release: jest.fn().mockResolvedValue(undefined),
        addEventListener: jest.fn()
      };
      const request = jest.fn().mockResolvedValueOnce(firstLock).mockResolvedValueOnce(secondLock);
      Object.defineProperty(navigator, 'wakeLock', {
        value: { request },
        configurable: true,
        writable: true
      });

      await toggleWakeLock();
      const disabling = toggleWakeLock();
      await Promise.resolve();
      const enabling = toggleWakeLock();
      expect(request).toHaveBeenCalledTimes(1);
      resolveRelease();
      await disabling;

      expect(await enabling).toBe(true);
      expect(request).toHaveBeenCalledTimes(2);
      const [, handleOldRelease] = firstLock.addEventListener.mock.calls[0];
      handleOldRelease();
      expect(isWakeLockActive()).toBe(true);
      await releaseWakeLock();
      expect(secondLock.release).toHaveBeenCalledTimes(1);
    });
  });

  describe('triggerHaptic', () => {
    test('should call navigator.vibrate with correct patterns for all haptic types', () => {
      const vibrateMock = jest.fn();
      navigator.vibrate = vibrateMock;

      triggerHaptic('tap');
      expect(vibrateMock).toHaveBeenLastCalledWith(12);

      triggerHaptic('success');
      expect(vibrateMock).toHaveBeenLastCalledWith([15, 40, 20]);

      triggerHaptic('remove');
      expect(vibrateMock).toHaveBeenLastCalledWith([25, 20]);

      triggerHaptic('win');
      expect(vibrateMock).toHaveBeenLastCalledWith([40, 60, 40, 60, 100]);

      triggerHaptic('error');
      expect(vibrateMock).toHaveBeenLastCalledWith([50, 40, 50]);

      triggerHaptic('unknown_type');
      expect(vibrateMock).toHaveBeenLastCalledWith(10);
    });

    test('should handle navigator without vibrate safely', () => {
      delete navigator.vibrate;
      expect(() => triggerHaptic('tap')).not.toThrow();
    });

    test('should catch and suppress vibration exceptions', () => {
      navigator.vibrate = jest.fn().mockImplementation(() => {
        throw new Error('Vibrate blocked');
      });
      expect(() => triggerHaptic('tap')).not.toThrow();
    });
  });
});
