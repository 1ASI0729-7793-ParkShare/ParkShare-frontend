import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DriverProfile } from '../domain/model/driver-profile.entity';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { DriverProfileApiEndpoint } from './driver-profile-api-endpoint';
import { Vehicle } from '../domain/model/vehicle.entity';

@Injectable({
  providedIn: 'root',
})
export class IdentityAndAccessService extends BaseApi {
  private readonly http = inject(HttpClient);
  private readonly endpoint = new DriverProfileApiEndpoint(this.http);

  private readonly initialProfile: DriverProfile = {
    id: 1,
    fullName: 'Daniela Ríos',
    role: 'conductor',
    isVerified: true,
    verificationStatusText: 'Conductora verificada',
    vehicle: {
      id: 1,
      plate: 'BXQ-418',
      model: 'Toyota Yaris 2021',
      vehicleType: 'Sedán',
    },
    documents: [
      {
        id: 1,
        name: 'Documento Nacional de Identidad (DNI)',
        status: 'VERIFIED',
        statusLabel: 'Verificado',
        lastUpdated: 'hace 3 meses',
      },
      {
        id: 2,
        name: 'Licencia de conducir',
        status: 'VERIFIED',
        statusLabel: 'Verificado',
        lastUpdated: 'hace 3 meses',
      },
      {
        id: 3,
        name: 'Tarjeta de propiedad vehicular',
        status: 'UNDER_REVIEW',
        statusLabel: 'En revisión',
        lastUpdated: 'hace 3 meses',
      },
    ],
  };

  /**
   * Retrieves the driver profile, with fallback to initial mock profile.
   */
  getDriverProfile(id: number = 1): Observable<DriverProfile> {
    return this.endpoint.getById(id).pipe(
      catchError(() => {
        return of(this.initialProfile);
      })
    );
  }

  /**
   * Updates vehicle details for the driver profile.
   */
  updateVehicle(profileId: number, vehicle: Vehicle): Observable<DriverProfile> {
    const updated = {
      ...this.initialProfile,
      vehicle,
    };
    return this.endpoint.update(updated, profileId).pipe(
      catchError(() => {
        this.initialProfile.vehicle = vehicle;
        return of(this.initialProfile);
      })
    );
  }

  /**
   * Updates verification document status or re-upload.
   */
  updateDocument(profileId: number, documentId: number): Observable<DriverProfile> {
    const doc = this.initialProfile.documents.find((d) => d.id === documentId);
    if (doc) {
      doc.status = 'UNDER_REVIEW';
      doc.statusLabel = 'En revisión';
      doc.lastUpdated = 'hace un momento';
    }
    return this.endpoint.update(this.initialProfile, profileId).pipe(
      catchError(() => {
        return of(this.initialProfile);
      })
    );
  }
}
