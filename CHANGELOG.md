# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-11-13

Third delivery: the Angular frontend is now linked to the ParkShare Spring Boot backend (`ParkShare-Platform`), deployed on Render with a Neon PostgreSQL database. The frontend is published on GitHub Pages.

### Added
- **Backend Integration**: Frontend consumes the real REST API (`/api/v1`) for profiles, verification documents, parking listings, bookings, ratings, reputations, notifications, owner payouts, payment transactions, incidents and emergency alerts.
- **Photo Upload**: Added `FileUploadService` in the shared layer that uploads photos (multipart) to `/files` and resolves `data:` URLs to stored file URLs.
- **Parking Space HTTP Repository**: Added `HttpParkingSpaceRepository` backed by `/parking-listings`, supporting create, update, availability, pricing and publication status through `POST` and `PATCH`.
- **Server-calculated Owner Dashboard**: Added `OwnerDashboardResponse` and `OwnerDashboardAssembler` to consume `GET /owner-dashboard`, with KPIs, weekly income and recent activity calculated by the backend.
- **Driver History View**: Replaced the placeholder at `/driver/history` with `DriverHistoryView`, listing finished and rejected reservations with total stays, hours parked, total spent and status filters, plus `driverHistory` selector in `BookingStore`.
- **Shared Current User Constants**: Added `current-user.ts` exposing `CURRENT_OWNER_ID` and `CURRENT_DRIVER_ID` until authentication is wired.
- **Continuous Deployment**: Added GitHub Actions workflow (`deploy.yml`) that builds the production configuration with the repository base href and publishes to GitHub Pages, including an SPA fallback (`404.html`).
- **Internationalization**: Added history view translations to `en.json` and `es.json`.

### Changed
- **Environments**: Production points to the Render backend (`https://parkshare-platform.onrender.com/api/v1`) and development to `http://localhost:8080/api/v1`. Endpoint paths now use kebab-case (`/verification-documents`, `/user-reputations`, `/owner-payouts`, `/payment-transactions`, `/parking-listings`, `/emergency-alerts`) and include the new `/files` and `/owner-dashboard` paths.
- **Incident Reporting**: Photos are uploaded to the backend before the incident is created.
- **Payments**: Identifiers are numeric, and payout transfers are requested through `POST /owner-payouts/{id}/transfer`.
- **Profile**: `ProfileStore` selects the driver profile by `CURRENT_DRIVER_ID` instead of taking the first profile returned.
- **Booking Routes**: `/driver/history` is served by the booking routes instead of the shared placeholder.

### Removed
- Removed client-side dashboard calculation (`OwnerListing` entity, owner listings and bookings endpoints, assembler and response) now that the backend computes the dashboard.
- Local mock data in `db.json` is no longer used by the default configuration.

## [1.1.0] - 2026-10-11

Second delivery: the frontend consumes a fake API deployed on Render and the safety bounded contexts are added.

### Added
- **Fake API Deployment**: Mock backend powered by `json-server` deployed on Render and configured in the production environment, replacing the local mock server.
- **Emergency Alerts Bounded Context**:
  - Domain model for emergency alerts with kind, notes, location and status.
  - Infrastructure with `EmergencyAlertsApiEndpoint`, resources and assembler.
  - Application state via `EmergencyAlertsStore` using Angular Signals.
  - Owner emergency view to raise and resolve alerts, with alert history.
- **Incident Reporting Bounded Context**:
  - Domain model for incidents with multiple incident types, photos and status lifecycle (open, in review, resolved).
  - Infrastructure with `IncidentsApiEndpoint`, resources and assembler.
  - Application state via `IncidentReportingStore`.
  - Presentation with `IncidentForm`, `IncidentCard`, `DriverIncidentsView` and `OwnerIncidentsView`.
- **Seed Data**: Extended `db.json` with bookings, incidents and emergency alerts for the fake API.

### Changed
- **Booking Flow**: Fixed errors in parking reservation and photo handling, and resolved inconsistencies between bounded contexts, ids and fake API data.

## [1.0.0] - 2026-09-11

First delivery: frontend progress with the main application flows, running only against local mock data (no deployed API).

### Added
- **Project Foundation**:
  - Angular 22 project with Angular Material, signals, `inject()` and standalone components.
  - Environment configuration and Domain-Driven Design structure per bounded context (domain, application, infrastructure, presentation).
  - Shared base architecture (`BaseEntity`, `BaseResource`, `BaseResponse`, `BaseAssembler`, `BaseApiEndpoint`, `BaseApi`) and application layout with navigation, nav badges and language switcher.
  - Internationalization via `@ngx-translate` with English (`en.json`) and Spanish (`es.json`).
- **Profile Bounded Context**: Driver profile, vehicle registration form, verification document list and user chip.
- **Parking Space Management Bounded Context**: Owner parking space management flow with in-memory repository, space cards, availability and pricing.
- **Booking Bounded Context**: Driver search with filters, listing cards and map (Leaflet), reservation tracker with stepper, and owner requests view.
- **Reputation and Notifications Bounded Context**: Rating form, reputation summary, notification bell with unread count, repositories, endpoints and assemblers.
- **Payments Bounded Context**: Owner balance card, transaction list and payout details.
- **Report Analytics Bounded Context**: Owner dashboard with KPI cards, weekly income chart and recent activity.
- **Local Mock Backend**: `db.json` consumed through `json-server` for development.
