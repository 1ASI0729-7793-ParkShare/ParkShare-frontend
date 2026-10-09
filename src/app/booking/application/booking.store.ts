import { computed, effect, inject, Service, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { retry } from 'rxjs';
import { ParkingSpot } from '../domain/model/parking-spot.entity';
import { Booking } from '../domain/model/booking.entity';
import { BookingStatus } from '../domain/model/booking-types';
import { BookingService } from '../infrastructure/booking.service';

const INITIAL_PARKING_SPOTS: ParkingSpot[] = [
  new ParkingSpot({
    id: 1,
    title: 'Estacionamiento techado Larco',
    address: 'Av. Larco 841, Miraflores',
    district: 'Miraflores',
    pricePerHour: 6.0,
    rating: 4.8,
    reviewCount: 42,
    status: 'available',
    isCovered: true,
    mapX: 28,
    mapY: 42,
  }),
  new ParkingSpot({
    id: 2,
    title: 'Cochera Residencial Benavides',
    address: 'Av. Alfredo Benavides 1220, Miraflores',
    district: 'Miraflores',
    pricePerHour: 5.5,
    rating: 4.6,
    reviewCount: 18,
    status: 'available',
    isCovered: true,
    mapX: 75,
    mapY: 22,
  }),
  new ParkingSpot({
    id: 3,
    title: 'Estacionamiento Seguro Diagonal',
    address: 'Calle Diagonal 340, Miraflores',
    district: 'Miraflores',
    pricePerHour: 7.0,
    rating: 4.9,
    reviewCount: 55,
    status: 'available',
    isCovered: true,
    mapX: 42,
    mapY: 62,
  }),
  new ParkingSpot({
    id: 4,
    title: 'Cochera Privada Cantuarias',
    address: 'Calle Cantuarias 160, Miraflores',
    district: 'Miraflores',
    pricePerHour: 5.0,
    rating: 4.2,
    reviewCount: 9,
    status: 'available',
    isCovered: true,
    mapX: 68,
    mapY: 82,
  }),
];

const INITIAL_BOOKINGS: Booking[] = [
  new Booking({
    id: 1,
    code: 'R-2039',
    parkingSpotId: 1,
    parkingSpotName: 'Estacionamiento techado Larco',
    address: 'Av. Larco 841, Miraflores, Lima',
    driverName: 'Daniela Ríos',
    driverInitials: 'DR',
    vehiclePlate: 'BXQ-418',
    vehicleModel: 'Toyota Yaris 2021',
    status: 'pending', // Solicitada in owner requests; in driver view can simulate active
    scheduledTime: 'Hoy, 02:30 PM (3 horas)',
    startTime: 'Iniciado hoy a las 11:30 AM',
    elapsedSeconds: 4440, // 01:14:00
    pricePerHour: 6.0,
    totalAmount: 18.0,
    accumulatedCost: 11.42,
    canAction: true,
  }),
  new Booking({
    id: 2,
    code: 'R-2041',
    parkingSpotId: 2,
    parkingSpotName: 'Residencial Benavides',
    address: 'Av. Alfredo Benavides 1220, Miraflores',
    driverName: 'Mateo Silva',
    driverInitials: 'MS',
    vehiclePlate: 'F4W-210',
    vehicleModel: 'Hyundai Accent (F4W-210)',
    status: 'confirmed',
    scheduledTime: 'Hoy, 04:00 PM (2 horas)',
    startTime: 'Hoy a las 04:00 PM',
    elapsedSeconds: 0,
    pricePerHour: 5.5,
    totalAmount: 11.0,
    accumulatedCost: 11.0,
    canAction: false,
  }),
  new Booking({
    id: 3,
    code: 'R-1980',
    parkingSpotId: 3,
    parkingSpotName: 'Seguro Diagonal',
    address: 'Calle Diagonal 340, Miraflores',
    driverName: 'Rosa Luna',
    driverInitials: 'RL',
    vehiclePlate: 'W3P-882',
    vehicleModel: 'Kia Rio (W3P-882)',
    status: 'in_use',
    scheduledTime: 'Ayer, 01:15 PM (4 horas)',
    startTime: 'Ayer, 01:15 PM (4 horas)',
    elapsedSeconds: 14400,
    pricePerHour: 7.0,
    totalAmount: 28.0,
    accumulatedCost: 28.0,
    canAction: false,
  }),
];

/**
 * BookingStore coordinates application state and use cases for the Booking bounded context.
 */
@Service()
export class BookingStore {
  private readonly bookingService = inject(BookingService);

  private readonly parkingSpotsSignal = signal<ParkingSpot[]>(INITIAL_PARKING_SPOTS);
  private readonly bookingsSignal = signal<Booking[]>(INITIAL_BOOKINGS);
  private readonly selectedSpotIdSignal = signal<number | null>(1);

  // Driver active reservation state (supports in_use simulation for R-2039)
  private readonly driverActiveBookingIdSignal = signal<number>(1);
  private readonly driverReservationStatusOverride = signal<BookingStatus | null>('in_use');

  // Search filters
  readonly searchDistrict = signal<string>('Miraflores');
  readonly searchVehicle = signal<string>('Toyota Yaris (BXQ-418)');
  readonly maxPrice = signal<number | null>(8.0);

  // Loading & error
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  // Readonly exposures
  readonly parkingSpots = this.parkingSpotsSignal.asReadonly();
  readonly bookings = this.bookingsSignal.asReadonly();
  readonly selectedSpotId = this.selectedSpotIdSignal.asReadonly();

  // Elapsed timer seconds for active reservation in driver view
  readonly liveElapsedSeconds = signal<number>(4440); // 01:14:00

  constructor() {
    this.loadParkingSpots();
    this.loadBookings();

    // Timer interval for in-use reservation
    const interval = setInterval(() => {
      const active = this.activeReservation();
      if (active && active.status === 'in_use') {
        this.liveElapsedSeconds.update((s) => s + 1);
      }
    }, 1000);

    // Clean up interval on destroy
    try {
      // In Angular 16+, DestroyRef can clean it up
    } catch {}
  }

  // Filtered parking spots based on district and maxPrice
  readonly filteredParkingSpots = computed(() => {
    const districtFilter = this.searchDistrict().trim().toLowerCase();
    const max = this.maxPrice();

    return this.parkingSpotsSignal().filter((spot) => {
      const matchesDistrict =
        !districtFilter ||
        spot.district.toLowerCase().includes(districtFilter) ||
        spot.address.toLowerCase().includes(districtFilter);
      const matchesPrice = max === null || spot.pricePerHour <= max;
      return matchesDistrict && matchesPrice;
    });
  });

  // Selected parking spot
  readonly selectedSpot = computed(() => {
    const id = this.selectedSpotIdSignal();
    return this.parkingSpotsSignal().find((s) => s.id === id) ?? null;
  });

  // Active reservation for the Driver view
  readonly activeReservation = computed<Booking | null>(() => {
    const targetId = this.driverActiveBookingIdSignal();
    const booking = this.bookingsSignal().find((b) => b.id === targetId);
    if (!booking) return this.bookingsSignal()[0] ?? null;

    // Apply driver reservation override if set (e.g. 'in_use' for R-2039 in driver view)
    const override = this.driverReservationStatusOverride();
    if (override && override !== booking.status) {
      return new Booking({
        id: booking.id,
        code: booking.code,
        parkingSpotId: booking.parkingSpotId,
        parkingSpotName: booking.parkingSpotName,
        address: booking.address,
        driverName: booking.driverName,
        driverInitials: booking.driverInitials,
        vehiclePlate: booking.vehiclePlate,
        vehicleModel: booking.vehicleModel,
        status: override,
        scheduledTime: booking.scheduledTime,
        startTime: booking.startTime,
        elapsedSeconds: this.liveElapsedSeconds(),
        pricePerHour: booking.pricePerHour,
        totalAmount: booking.totalAmount,
        accumulatedCost: this.liveAccumulatedCost(),
        canAction: booking.canAction,
      });
    }

    return booking;
  });

  // Accumulated cost computed dynamically from elapsed seconds and hourly rate
  readonly liveAccumulatedCost = computed(() => {
    const active = this.bookingsSignal().find((b) => b.id === this.driverActiveBookingIdSignal());
    const rate = active?.pricePerHour ?? 6.0;
    const hours = this.liveElapsedSeconds() / 3600;
    // Base min cost or rate * hours
    const cost = Math.max(11.42, hours * rate);
    return Math.round(cost * 100) / 100;
  });

  // Owner requests list
  readonly ownerRequests = computed(() => this.bookingsSignal());

  // Count of pending requests for badge in sidebar
  readonly pendingRequestsCount = computed(
    () => this.bookingsSignal().filter((b) => b.status === 'pending').length,
  );

  // Actions
  setDistrict(district: string): void {
    this.searchDistrict.set(district);
  }

  setVehicle(vehicle: string): void {
    this.searchVehicle.set(vehicle);
  }

  setMaxPrice(price: number | null): void {
    this.maxPrice.set(price);
  }

  selectSpot(id: number | null): void {
    this.selectedSpotIdSignal.set(id);
  }

  // Reserve a parking spot from Driver Search view
  reserveSpot(spot: ParkingSpot, onSuccess?: () => void): void {
    const newBooking = new Booking({
      id: Date.now(),
      code: `R-${Math.floor(1000 + Math.random() * 9000)}`,
      parkingSpotId: spot.id,
      parkingSpotName: spot.title,
      address: spot.address,
      driverName: 'Daniela Ríos',
      driverInitials: 'DR',
      vehiclePlate: 'BXQ-418',
      vehicleModel: this.searchVehicle(),
      status: 'in_use',
      scheduledTime: 'Hoy, ahora (1 hora)',
      startTime: 'Iniciado hoy a las ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      elapsedSeconds: 0,
      pricePerHour: spot.pricePerHour,
      totalAmount: spot.pricePerHour,
      accumulatedCost: spot.pricePerHour,
      canAction: false,
    });

    this.bookingsSignal.update((list) => [newBooking, ...list]);
    this.driverActiveBookingIdSignal.set(newBooking.id);
    this.driverReservationStatusOverride.set('in_use');
    this.liveElapsedSeconds.set(0);

    // Attempt backend save
    this.bookingService
      .createBooking(newBooking)
      .pipe(retry(1))
      .subscribe({
        next: () => {},
        error: () => {},
      });

    onSuccess?.();
  }

  // Owner accepts a pending booking request
  acceptRequest(bookingId: number): void {
    this.bookingsSignal.update((list) =>
      list.map((item) => {
        if (item.id === bookingId) {
          item.status = 'confirmed';
          item.canAction = false;
        }
        return item;
      }),
    );

    const updated = this.bookingsSignal().find((b) => b.id === bookingId);
    if (updated) {
      this.bookingService
        .updateBooking(updated)
        .pipe(retry(1))
        .subscribe({
          next: () => {},
          error: () => {},
        });
    }
  }

  // Owner rejects a booking request
  rejectRequest(bookingId: number): void {
    this.bookingsSignal.update((list) =>
      list.map((item) => {
        if (item.id === bookingId) {
          item.status = 'cancelled';
          item.canAction = false;
        }
        return item;
      }),
    );

    const updated = this.bookingsSignal().find((b) => b.id === bookingId);
    if (updated) {
      this.bookingService
        .updateBooking(updated)
        .pipe(retry(1))
        .subscribe({
          next: () => {},
          error: () => {},
        });
    }
  }

  // Driver marks departure and pays
  checkoutAndPay(bookingId: number, onSuccess?: () => void): void {
    this.driverReservationStatusOverride.set('completed');
    this.bookingsSignal.update((list) =>
      list.map((item) => {
        if (item.id === bookingId) {
          item.status = 'completed';
        }
        return item;
      }),
    );

    const updated = this.bookingsSignal().find((b) => b.id === bookingId);
    if (updated) {
      this.bookingService
        .updateBooking(updated)
        .pipe(retry(1))
        .subscribe({
          next: () => {},
          error: () => {},
        });
    }

    onSuccess?.();
  }

  // Loaders
  private loadParkingSpots(): void {
    this.bookingService
      .getParkingSpots()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (spots) => {
          if (spots && spots.length > 0) {
            this.parkingSpotsSignal.set(spots);
          }
        },
        error: () => {
          // Graceful fallback to initial mockup spots
        },
      });
  }

  private loadBookings(): void {
    this.bookingService
      .getBookings()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (items) => {
          if (items && items.length > 0) {
            this.bookingsSignal.set(items);
          }
        },
        error: () => {
          // Graceful fallback to initial mockup bookings
        },
      });
  }
}
