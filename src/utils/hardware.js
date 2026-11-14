/**
 * Hardware utilities for mobile-first ergonomics (Wake Lock API & Vibration API)
 */

let wakeLockSentinel = null;
let isWakeLockRequested = false;
let pendingWakeLockUpdate = null;
const wakeLockListeners = [];
let lastNotifiedState = null;

export function isWakeLockSupported() {
  return typeof navigator !== 'undefined' && 'wakeLock' in navigator;
}

export function isWakeLockActive() {
  return !!wakeLockSentinel && !wakeLockSentinel.released;
}

export function onWakeLockChange(cb) {
  wakeLockListeners.push(cb);
  return () => {
    const idx = wakeLockListeners.indexOf(cb);
    if (idx !== -1) wakeLockListeners.splice(idx, 1);
  };
}

function notifyWakeLockChange(active) {
  if (lastNotifiedState !== active) {
    lastNotifiedState = active;
    wakeLockListeners.forEach(cb => cb(active));
  }
}

async function updateWakeLock() {
  if (isWakeLockRequested && !isWakeLockActive()) {
    try {
      const sentinel = await navigator.wakeLock.request('screen');
      wakeLockSentinel = sentinel;
      sentinel.addEventListener('release', () => {
        if (wakeLockSentinel === sentinel) {
          wakeLockSentinel = null;
          notifyWakeLockChange(false);
        }
      });
    } catch (err) {
      console.warn('Wake Lock request failed:', err);
    }
  }

  // The user may have switched off while the browser was granting the lock.
  if (!isWakeLockRequested && isWakeLockActive()) {
    try {
      await wakeLockSentinel.release();
      wakeLockSentinel = null;
    } catch (err) {
      console.warn('Wake Lock release failed:', err);
    }
  }

  const active = isWakeLockActive();
  notifyWakeLockChange(active);
  return active;
}

function queueWakeLockUpdate() {
  const update = (pendingWakeLockUpdate || Promise.resolve()).then(updateWakeLock);
  pendingWakeLockUpdate = update;
  return update.finally(() => {
    if (pendingWakeLockUpdate === update) pendingWakeLockUpdate = null;
  });
}

export async function requestWakeLock() {
  if (!isWakeLockSupported()) return false;
  isWakeLockRequested = true;
  return queueWakeLockUpdate();
}

export async function releaseWakeLock() {
  isWakeLockRequested = false;
  await queueWakeLockUpdate();
}

export async function toggleWakeLock() {
  const enabled = pendingWakeLockUpdate ? isWakeLockRequested : isWakeLockActive();
  if (enabled) {
    await releaseWakeLock();
    return isWakeLockActive();
  }
  return requestWakeLock();
}

// Re-acquire wake lock automatically when returning to the tab if active
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState === 'visible' && isWakeLockRequested) {
      await requestWakeLock();
    }
  });
}

/**
 * Haptic feedback using Web Vibration API
 * @param {'tap' | 'success' | 'remove' | 'win' | 'error'} type
 */
export function triggerHaptic(type = 'tap') {
  if (typeof navigator === 'undefined' || !navigator.vibrate) return;

  try {
    switch (type) {
      case 'tap':
        navigator.vibrate(12);
        break;
      case 'success':
        navigator.vibrate([15, 40, 20]);
        break;
      case 'remove':
        navigator.vibrate([25, 20]);
        break;
      case 'win':
        navigator.vibrate([40, 60, 40, 60, 100]);
        break;
      case 'error':
        navigator.vibrate([50, 40, 50]);
        break;
      default:
        navigator.vibrate(10);
    }
  } catch {
    // Ignore devices that block vibrate
  }
}
