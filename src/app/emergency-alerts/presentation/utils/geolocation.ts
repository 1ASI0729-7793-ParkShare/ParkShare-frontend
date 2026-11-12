export interface DevicePosition {
  latitude: number;
  longitude: number;
}

/** Current device position, or null when unavailable, denied or too slow. */
export const locateDevice = (timeoutMs = 6000): Promise<DevicePosition | null> =>
  new Promise((resolve) => {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ latitude: p.coords.latitude, longitude: p.coords.longitude }),
      () => resolve(null),
      { timeout: timeoutMs, enableHighAccuracy: true, maximumAge: 30000 },
    );
  });
