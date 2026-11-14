import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  DEFAULT_DISTRICT,
} from '../../booking/domain/model/booking-types';
import { ParkingListingResource } from '../../booking/infrastructure/parking-listings-response';
import { FileUploadService } from '../../shared/infrastructure/file-upload.service';
import {
  CreateParkingSpaceCommand,
  PARKING_SPACE_OWNER_ID,
  ParkingSpaceRepository,
  UpdateParkingSpaceCommand,
} from '../application/parking-space.repository';
import { AvailabilityPeriod } from '../domain/model/availability-period.entity';
import {
  PARKING_SPACE_FEATURES,
  ParkingSpace,
  ParkingSpaceFeature,
  ParkingSpacePublicationStatus,
} from '../domain/model/parking-space.entity';

/** Approximate centre of the default district, used until addresses are geocoded. */
const DEFAULT_COORDINATES = { latitude: -12.1219, longitude: -77.0297 };

/**
 * Persists parking spaces in the same `/parkingListings` collection that drivers search,
 * so the owner's space and the driver's listing are one resource instead of two copies.
 */
@Injectable()
export class HttpParkingSpaceRepository extends ParkingSpaceRepository {
  private readonly http = inject(HttpClient);
  private readonly ownerId = inject(PARKING_SPACE_OWNER_ID);
  private readonly uploads = inject(FileUploadService);
  private readonly url = `${environment.platformProviderApiBaseUrl}${environment.platformProviderParkingListingsEndpointPath}`;

  override getAll(): Observable<ParkingSpace[]> {
    return this.http
      .get<ParkingListingResource[]>(this.url, { params: { ownerId: String(this.ownerId) } })
      .pipe(map((resources) => resources.map((resource) => this.toEntity(resource))));
  }

  override getById(id: number): Observable<ParkingSpace> {
    return this.http
      .get<ParkingListingResource>(`${this.url}/${id}`)
      .pipe(map((resource) => this.toEntity(resource)));
  }

  override create(command: CreateParkingSpaceCommand): Observable<ParkingSpace> {
    return this.uploads.resolvePhotos(command.photos).pipe(
      switchMap((photos) => this.http.post<ParkingListingResource>(this.url, this.toNewListing(command, photos))),
      map((resource) => this.toEntity(resource)),
    );
  }

  private toNewListing(
    command: CreateParkingSpaceCommand,
    photos: string[],
  ): Omit<ParkingListingResource, 'id'> {
    return {
      ownerId: this.ownerId,
      name: command.name,
      address: command.address,
      district: DEFAULT_DISTRICT,
      hourlyRate: command.hourlyRate,
      covered: command.features.includes('covered'),
      rating: 0,
      reviewCount: 0,
      availability: 'available',
      ...DEFAULT_COORDINATES,
      photos,
      features: [...command.features],
      publicationStatus: 'published',
      availabilityPeriods: command.availability.map((period) => ({ ...period })),
    };
  }

  override update(id: number, command: UpdateParkingSpaceCommand): Observable<ParkingSpace> {
    return this.uploads
      .resolvePhotos(command.photos)
      .pipe(switchMap((photos) => this.patch(id, { address: command.address, photos })));
  }

  override updateAvailability(
    id: number,
    availability: AvailabilityPeriod[],
  ): Observable<ParkingSpace> {
    return this.patch(id, { availabilityPeriods: availability.map((period) => ({ ...period })) });
  }

  override updatePricing(id: number, hourlyRate: number): Observable<ParkingSpace> {
    return this.patch(id, { hourlyRate });
  }

  override updatePublicationStatus(
    id: number,
    status: ParkingSpacePublicationStatus,
  ): Observable<ParkingSpace> {
    return this.patch(id, {
      publicationStatus: status,
      availability: status === 'published' ? 'available' : 'occupied',
    });
  }

  private patch(id: number, changes: Partial<ParkingListingResource>): Observable<ParkingSpace> {
    return this.http
      .patch<ParkingListingResource>(`${this.url}/${id}`, changes)
      .pipe(map((resource) => this.toEntity(resource)));
  }

  private toEntity(resource: ParkingListingResource): ParkingSpace {
    const features = (resource.features ?? (resource.covered ? ['covered'] : [])).filter(
      (feature): feature is ParkingSpaceFeature =>
        (PARKING_SPACE_FEATURES as readonly string[]).includes(feature),
    );
    return new ParkingSpace(
      resource.id,
      resource.ownerId,
      resource.address,
      [...(resource.photos ?? [])],
      resource.hourlyRate,
      (resource.availabilityPeriods ?? []).map((period) => ({ ...period })),
      resource.name,
      features,
      resource.publicationStatus ?? 'published',
    );
  }
}
