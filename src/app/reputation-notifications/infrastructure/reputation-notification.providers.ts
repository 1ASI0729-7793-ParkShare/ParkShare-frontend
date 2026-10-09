import { Provider } from '@angular/core';

import {
  RATING_REPOSITORY,
  BOOKING_VERIFICATION,
} from '../application/services/reputation.service';

import { NOTIFICATION_REPOSITORY } from '../application/services/notification.service';

import { HttpRatingRepository } from './repositories/http-rating.repository';
import { HttpNotificationRepository } from './repositories/http-notification.repository';
import { HttpBookingVerificationAdapter } from './adapters/http-booking-verification.adapter';

export const REPUTATION_NOTIFICATIONS_PROVIDERS: Provider[] = [
  {
    provide: RATING_REPOSITORY,
    useClass: HttpRatingRepository,
  },
  {
    provide: NOTIFICATION_REPOSITORY,
    useClass: HttpNotificationRepository,
  },
  {
    provide: BOOKING_VERIFICATION,
    useClass: HttpBookingVerificationAdapter,
  },
];
