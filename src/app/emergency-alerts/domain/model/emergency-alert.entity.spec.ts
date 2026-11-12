import { EmergencyAlert } from './emergency-alert.entity';

const raise = (latitude: number | null = -12.1, longitude: number | null = -77) =>
  EmergencyAlert.raise({
    ownerId: 1, parkingListingId: 1, spaceName: 'Cochera', kind: 'fire', notes: ' humo ',
    latitude, longitude, locationSource: 'gps',
  });

describe('EmergencyAlert', () => {
  it('should be raised active with trimmed notes and a map link', () => {
    const alert = raise();
    expect(alert.isActive).toBe(true);
    expect(alert.notes).toBe('humo');
    expect(alert.mapUrl).toContain('mlat=-12.1');
  });

  it('should have no map link without coordinates', () => {
    expect(raise(null, null).mapUrl).toBeNull();
  });

  it('should resolve once', () => {
    const resolved = raise().resolve();
    expect(resolved.status).toBe('resolved');
    expect(() => resolved.resolve()).toThrow();
  });
});
