export type BookingStatus = 'requested' | 'confirmed' | 'in-use' | 'completed' | 'rejected';
export const CURRENT_OWNER_ID = 1;

export const WEEK_DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
export type WeekDay = (typeof WEEK_DAYS)[number];

export const RECENT_ACTIVITY_LIMIT = 5;
export const RESPONSE_DEADLINE_MINUTES = 10;
export const CURRENCY = { code: 'PEN', symbol: 'S/ ' } as const;
