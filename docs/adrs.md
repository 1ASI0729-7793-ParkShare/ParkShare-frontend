# Architectural Decision Records (ADRs)

This document records the principal architectural decisions made for the ParkShare frontend application.

---

## ADR 001: Adoption of Domain-Driven Design (DDD) and Screaming Architecture

### Status
Accepted

### Context
ParkShare serves two roles (drivers and parking-space owners) and covers several business capabilities: profiles, parking-space management, bookings, payments, reputation, incident reporting, emergency alerts and analytics. The codebase must scale across them while keeping high cohesion, low coupling and a clear separation of concerns.

### Decision
Structure the frontend codebase according to Domain-Driven Design (DDD) tactical patterns and bounded contexts:
- **Bounded Contexts**: `profile`, `booking`, `parking-space-management`, `payments`, `reputation-notifications`, `incident-reporting`, `emergency-alerts`, `report-analytics`, and `shared`.
- **Layered Architecture per Context**:
  - `domain/model`: Domain entities, value types and rules free from framework dependencies.
  - `application`: State stores, repository and port abstractions, and application-level orchestration.
  - `infrastructure`: API services, endpoint adapters, assemblers, HTTP resources/responses and repository implementations.
  - `presentation`: Views, pages, components and routing.

### Consequences
- **Positive**: Clear boundaries between domains, high maintainability, isolated testing, and alignment with the business language (booking, reservation, payout, incident).
- **Negative**: Additional boilerplate for mapping between layers (assemblers and resources).

---

## ADR 002: Signal-Based State Management for Application Stores

### Status
Accepted

### Context
State management in modern Angular applications requires fine-grained reactivity, predictable state mutations and minimal boilerplate. Several views share the same data (for example, the driver profile or the booking list).

### Decision
Use lightweight, context-scoped application stores (`ProfileStore`, `BookingStore`, `PaymentsStore`, `IncidentReportingStore`, `EmergencyAlertsStore`, `ReportAnalyticsStore`, among others) built with Angular Signals (`signal`, `computed`) and `inject()`, registered with the `@Service()` decorator:
- Internal mutable state is kept private in writable signals.
- Public state is exposed as read-only signals and derived `computed` values (for example `searchResults`, `driverHistory`, `activeReservation`).
- Asynchronous API calls update the signals reactively, with `loading` and `error` signals exposed to the views.
- Stores of one context may depend on stores of another through their public signals (for example `BookingStore` reads the driver from `ProfileStore`).

### Consequences
- **Positive**: Native integration with Angular reactivity and `OnPush` change detection; no external state library dependency.
- **Negative**: Developers must follow conventions for immutable updates inside store methods, and avoid circular dependencies between stores.

---

## ADR 003: Assembler Pattern and Layered REST Infrastructure

### Status
Accepted

### Context
API contracts (backend resources and responses) frequently differ from the internal frontend domain models in naming, structure or data types. The API also moved from a fake `json-server` to a real Spring Boot backend without changing the domain.

### Decision
Implement the Assembler pattern using generic base infrastructure abstractions in the `shared` context:
- `BaseEntity`: Marker interface for domain entities with an identifier.
- `BaseResource` / `BaseResponse`: Contracts for wire DTOs.
- `BaseAssembler<TEntity, TResource, TResponse>`: Pure transformation between resources and domain entities.
- `BaseApiEndpoint`: Generic HTTP endpoint wrapper providing CRUD operations and unified error handling. List endpoints accept both plain arrays and wrapped responses.
- `BaseApi`: Base class of the services that compose one or more endpoints for application consumption (for example `BookingService`, `ProfileService`).

### Consequences
- **Positive**: Decouples domain logic from backend schema changes; standardizes CRUD operations and error handling across endpoints.
- **Negative**: Requires writing an assembler and resource types for every entity.

---

## ADR 004: Repository and Port Abstractions in the Application Layer

### Status
Accepted

### Context
Some contexts need to swap their data source (for example an in-memory repository for tests and an HTTP repository for the real backend), and the reputation context needs information owned by the booking context without depending on it.

### Decision
Define abstractions in the application or domain layer and implement them in infrastructure:
- Abstract repositories: `ParkingSpaceRepository` (implemented by `HttpParkingSpaceRepository` and `InMemoryParkingSpaceRepository`) and `PaymentRepository` (implemented by `PaymentApi`).
- Ports and repositories in `reputation-notifications`: `RatingRepository`, `NotificationRepository` and `BookingVerificationPort`, implemented by HTTP adapters.
- Stores depend on the abstraction and receive the implementation through Angular dependency injection providers configured in the context routes.

### Consequences
- **Positive**: The application layer does not depend on HTTP details; implementations can be replaced in tests; cross-context communication is explicit.
- **Negative**: One extra abstraction and provider configuration per replaceable dependency.

---

## ADR 005: Immutable Domain Entities with Explicit State Transitions

### Status
Accepted

### Context
Reservations, incidents and emergency alerts follow a lifecycle with valid and invalid transitions. Mutating objects in place makes signals and `OnPush` views harder to reason about.

### Decision
Model entities as immutable classes with ECMAScript `#` private fields and getters. Each transition returns a new instance and rejects invalid states:
- `Reservation`: requested, confirmed, in-use, completed, or requested, rejected (`accept`, `reject`, `start`, `finish`).
- `Incident`: open, in-review, resolved (`startReview`, `resolve`).
- `EmergencyAlert`: active, resolved (`resolve`).
- Factory methods such as `Incident.report` and `EmergencyAlert.raise` validate input before creating the entity.

### Consequences
- **Positive**: Business rules live in the domain; true runtime encapsulation; safe to use inside signals.
- **Negative**: Updates create new objects, and the changed entity must be replaced in the store lists.

---

## ADR 006: Integration with the Spring Boot Backend

### Status
Accepted

### Context
The first deliveries used local mock data and a fake API deployed on Render. The project now has its own Spring Boot backend (`ParkShare-Platform`) deployed on Render with a Neon PostgreSQL database, exposing a REST API under `/api/v1`.

### Decision
- **Environments**: `environment.development.ts` points to `http://localhost:8080/api/v1` and `environment.ts` (production) points to the deployed backend. Endpoint paths are declared once per environment, in kebab-case, and consumed by the endpoint classes.
- **Server-side calculation**: Values derived from several entities, such as the owner dashboard (income, occupancy, rating), are calculated by the backend (`GET /owner-dashboard`) instead of being recomputed in the browser. Listing rating and review count are also calculated by the backend.
- **Photo upload**: `FileUploadService` uploads photos (multipart) to `/files` and returns stored URLs, so that incidents and parking spaces store URLs instead of base64 images.
- **Retries**: Idempotent reads and updates may be retried; creations are never retried automatically to avoid duplicates.
- **Current user**: Until authentication is wired, `current-user.ts` exposes `CURRENT_OWNER_ID` and `CURRENT_DRIVER_ID`.

### Consequences
- **Positive**: A single source of truth in the backend, smaller payload processing in the browser and consistent business rules.
- **Negative**: The frontend depends on the backend availability (the free Render tier sleeps after inactivity), and authentication is still pending.

---

## ADR 007: Material 3 (M3) Theming System

### Status
Accepted

### Context
The application requires a modern, accessible and customizable UI component library adhering to current design standards.

### Decision
Adopt Angular Material with Material 3 theming:
- Use `@use '@angular/material' as mat;` and the `mat.theme(...)` API in `src/custom-theme.scss`, with the `$azure-palette` (primary) and `$blue-palette` (tertiary) and the Roboto typography.
- Use system design tokens (`var(--mat-sys-primary)`, `var(--mat-sys-surface-container-low)`, among others) in component styles.
- Reference the style entry points in `angular.json`.

### Consequences
- **Positive**: Modern UI, built-in accessibility, and a consistent design language across all views.
- **Negative**: Requires familiarity with M3 token names and the Sass mixin APIs.

---

## ADR 008: Standalone Components Architecture

### Status
Accepted

### Context
Standalone components remove the need for `NgModule` boilerplate and simplify dependency graphs.

### Decision
All components, directives and pipes are standalone (default in Angular 22). Dependencies and Material modules are imported directly in each component `imports`. Routes are lazy loaded with functional `loadComponent` and `loadChildren`, one route file per context.

### Consequences
- **Positive**: Tree-shakable bundles, explicit dependencies, simpler testing and lazy loading per feature.
- **Negative**: Each component must list its imports explicitly.

---

## ADR 009: Internationalization (i18n) via `@ngx-translate`

### Status
Accepted

### Context
The application must support English and Spanish with runtime language switching and without page reloads.

### Decision
Use `@ngx-translate/core` and `@ngx-translate/http-loader` with translation files in `public/i18n/` (`en.json` and `es.json`):
- The loader is configured in `app.config.ts` with a relative prefix, so it works under a GitHub Pages base href.
- The `LanguageSwitcher` shared component toggles the language at runtime.
- Translation keys are grouped by context (for example `booking.history.*`).

### Consequences
- **Positive**: Dynamic translation switching and centralized keys.
- **Negative**: Translation files load asynchronously, and both languages must be kept in sync.

---

## ADR 010: Interactive Maps with Leaflet

### Status
Accepted

### Context
Drivers search for parking spaces by location, and owners can attach coordinates to emergency alerts.

### Decision
Use Leaflet with OpenStreetMap tiles in the `ListingMap` component to display parking listings, and the browser Geolocation API to obtain the device position for emergency alerts.

### Consequences
- **Positive**: Lightweight, free map solution with no API key.
- **Negative**: Requires careful lifecycle handling of the map instance inside Angular components.

---

## ADR 011: TypeScript ES2022 Target and Strict Compilation

### Status
Accepted

### Context
Modern browsers and the Angular build pipeline support modern JavaScript natively, reducing polyfill overhead.

### Decision
Configure `tsconfig.json` with `target: ES2022`, `module: preserve` and strict type checking, including strict injection parameters and strict input access modifiers. ECMAScript `#` private fields are used in domain entities.

### Consequences
- **Positive**: Cleaner bundles and early detection of type and injection errors.
- **Negative**: Requires modern browsers, aligned with the Angular 22 baseline.

---

## ADR 012: Unit Testing with Vitest

### Status
Accepted

### Context
Domain rules, stores and components need fast automated tests integrated with the Angular build.

### Decision
Use the Angular unit test builder with Vitest. Domain entities, stores and presentation components have `*.spec.ts` files next to the code. The in-memory repositories allow testing stores without HTTP.

### Consequences
- **Positive**: Fast test runs and tests close to the code they verify.
- **Negative**: Test coverage must be maintained as new features are added.

---

## ADR 013: Continuous Deployment to GitHub Pages

### Status
Accepted

### Context
The frontend must be publicly available for the course deliveries, and the deployed build must use the production backend.

### Decision
Publish the frontend on GitHub Pages with a GitHub Actions workflow (`.github/workflows/deploy.yml`) triggered on pushes to `main`:
- Build with the production configuration and the repository base href.
- Copy `index.html` to `404.html` so deep links and page reloads work with the Angular router.
- The backend is deployed separately on Render, with CORS enabled for the frontend origin.

### Consequences
- **Positive**: Every release to `main` is published automatically with the production environment.
- **Negative**: The first request can be slow because the free backend tier sleeps after inactivity.
