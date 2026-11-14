/** Kinds of problem a driver can report; a single report may combine several. */
export const INCIDENT_TYPES = [
  'collision',
  'theft',
  'overcharge',
  'poor-condition',
  'vandalism',
  'access-problem',
  'other',
] as const;

export type IncidentType = (typeof INCIDENT_TYPES)[number];

export type IncidentStatus = 'open' | 'in-review' | 'resolved';

/** Material icon shown next to each incident type. */
export const INCIDENT_TYPE_ICONS: Record<IncidentType, string> = {
  collision: 'car_crash',
  theft: 'lock_open',
  overcharge: 'payments',
  'poor-condition': 'build',
  vandalism: 'broken_image',
  'access-problem': 'block',
  other: 'help_outline',
};

export const MAX_INCIDENT_PHOTOS = 4;
export const MIN_DESCRIPTION_LENGTH = 10;
export const MAX_DESCRIPTION_LENGTH = 500;
