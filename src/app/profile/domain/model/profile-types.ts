export const VEHICLE_TYPES = ['sedan', 'suv', 'hatchback', 'pickup', 'van'] as const;
export type VehicleType = (typeof VEHICLE_TYPES)[number];

export type DocumentType = 'national-id' | 'driver-license' | 'vehicle-registration';
export type DocumentStatus = 'verified' | 'in-review' | 'rejected';

export const VERIFIED_STATUS: DocumentStatus = 'verified';
export const IN_REVIEW_STATUS: DocumentStatus = 'in-review';

export const PLATE_PATTERN = /^[A-Za-z0-9]{3}-[A-Za-z0-9]{3}$/;
