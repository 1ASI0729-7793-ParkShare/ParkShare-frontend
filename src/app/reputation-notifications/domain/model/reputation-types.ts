export const RATING_SCORES = [1, 2, 3, 4, 5] as const;

export type RatingScore = (typeof RATING_SCORES)[number];

export type NotificationType = 'booking' | 'payment' | 'rating' | 'operation' | 'system';

export type NotificationRelatedEntityType =
  'booking' | 'payment' | 'rating' | 'parking-space' | 'user';
