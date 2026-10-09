import { Reservation } from './reservation.entity';

const requested = () =>
  new Reservation({
    id: 2039, parkingListingId: 1, ownerId: 1, driverId: 1, driverName: 'Daniela Ríos',
    vehiclePlate: 'BXQ-418', vehicleModel: 'Toyota Yaris', spaceName: 'Larco', spaceAddress: 'Av. Larco 841',
    hourlyRate: 6, plannedEntry: '2026-10-08T14:30:00.000Z', plannedHours: 3, status: 'requested',
    startedAt: null, endedAt: null, totalCost: null,
  });

describe('Reservation', () => {
  it('should estimate what the owner receives', () => {
    expect(requested().estimatedAmount).toBe(18);
    expect(requested().code).toBe('R-2039');
  });

  it('should follow requested → confirmed → in-use → completed', () => {
    const start = new Date('2026-10-08T15:00:00.000Z');
    const end = new Date('2026-10-08T16:30:00.000Z');
    const done = requested().accept().start(start).finish(end);
    expect(done.status).toBe('completed');
    expect(done.totalCost).toBe(9);
    expect(done.costAt(new Date('2026-10-09T00:00:00.000Z'))).toBe(9);
  });

  it('should charge proportionally while in use', () => {
    const started = new Date('2026-10-08T15:00:00.000Z');
    const inUse = requested().accept().start(started);
    expect(inUse.costAt(new Date(started.getTime() + 74 * 60 * 1000))).toBe(7.4);
  });

  it('should reject invalid transitions', () => {
    expect(() => requested().start(new Date())).toThrow();
    expect(() => requested().reject().accept()).toThrow();
  });

  it('should not mutate the original reservation', () => {
    const original = requested();
    original.accept();
    expect(original.status).toBe('requested');
  });
});
