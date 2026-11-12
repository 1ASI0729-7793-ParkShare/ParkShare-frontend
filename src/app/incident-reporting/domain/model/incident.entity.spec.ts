import { Incident, IncidentReport } from './incident.entity';

const report = (patch: Partial<IncidentReport> = {}): IncidentReport => ({
  reporterId: 1, reporterName: 'Ana', parkingListingId: 2, ownerId: 1,
  spaceName: 'Cochera', spaceAddress: 'Av. 1', types: ['collision', 'overcharge'],
  description: 'Me chocaron el auto en la cochera', photos: [], ...patch,
});

describe('Incident', () => {
  it('should be reported open and allow several types', () => {
    const incident = Incident.report(report());
    expect(incident.status).toBe('open');
    expect(incident.types).toEqual(['collision', 'overcharge']);
  });

  it('should reject a report without type, with short description or too many photos', () => {
    expect(() => Incident.report(report({ types: [] }))).toThrow();
    expect(() => Incident.report(report({ description: 'corto' }))).toThrow();
    expect(() => Incident.report(report({ photos: ['a', 'b', 'c', 'd', 'e'] }))).toThrow();
  });

  it('should go open → in-review → resolved', () => {
    const resolved = Incident.report(report()).startReview().resolve();
    expect(resolved.status).toBe('resolved');
    expect(resolved.resolvedAt).not.toBeNull();
    expect(() => resolved.resolve()).toThrow();
  });
});
