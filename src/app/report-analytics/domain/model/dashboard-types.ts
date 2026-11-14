export type BookingStatus = 'requested' | 'confirmed' | 'in-use' | 'completed' | 'rejected';
export { CURRENT_OWNER_ID } from '../../../shared/domain/model/current-user';

export const WEEK_DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
export type WeekDay = (typeof WEEK_DAYS)[number];

export const RECENT_ACTIVITY_LIMIT = 5;
export const RESPONSE_DEADLINE_MINUTES = 10;
export const CURRENCY = { code: 'PEN', symbol: 'S/ ' } as const;
