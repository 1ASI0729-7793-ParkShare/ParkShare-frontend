import { provideHttpClient, withXhr } from '@angular/common/http';
import {
  ApplicationConfig,
  computed,
  inject,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideTranslateService } from '@ngx-translate/core';
import { REPUTATION_NOTIFICATIONS_PROVIDERS } from './reputation-notifications/infrastructure/reputation-notification.providers';
import { routes } from './app.routes';
import { NAV_BADGES } from './shared/presentation/components/layout/nav-badges';
import { ReportAnalyticsStore } from './report-analytics/application/report-analytics.store';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: NAV_BADGES,
      useFactory: () => {
        const store = inject(ReportAnalyticsStore);
        return computed(() => ({ requests: store.pendingRequests() }));
      },
    },
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withXhr()),
    provideTranslateService({
      loader: provideTranslateHttpLoader({ prefix: './i18n/', suffix: '.json' }),
      lang: 'es',
      fallbackLang: 'en',
    }),
    REPUTATION_NOTIFICATIONS_PROVIDERS,
    provideRouter(routes, withComponentInputBinding()),
  ],
};
