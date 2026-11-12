export const EMERGENCY_KINDS = ['fire', 'theft', 'accident', 'other'] as const;

export type EmergencyKind = (typeof EMERGENCY_KINDS)[number];

export type EmergencyStatus = 'active' | 'resolved';

/** Where the alert coordinates came from. */
export type LocationSource = 'gps' | 'space';

export const EMERGENCY_KIND_ICONS: Record<EmergencyKind, string> = {
  fire: 'local_fire_department',
  theft: 'local_police',
  accident: 'car_crash',
  other: 'warning',
};

/** Public emergency lines in Peru. */
export const EMERGENCY_NUMBERS = [
  { key: 'fire', number: '116' },
  { key: 'police', number: '105' },
  { key: 'medical', number: '106' },
] as const;

export const MAX_EMERGENCY_NOTES_LENGTH = 300;
