import { computed, inject, Service, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { retry } from 'rxjs';
import { Profile } from '../domain/model/profile.entity';
import { VerificationDocument } from '../domain/model/verification-document.entity';
import { IN_REVIEW_STATUS, VERIFIED_STATUS } from '../domain/model/profile-types';
import { ProfileService } from '../infrastructure/profile.service';

/** Holds profile application state and coordinates profile use cases. */
@Service()
export class ProfileStore {
  private readonly profileService = inject(ProfileService);

  private readonly profileSignal = signal<Profile | null>(null);
  private readonly documentsSignal = signal<VerificationDocument[]>([]);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly profile = this.profileSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  readonly documents = computed(() =>
    this.documentsSignal().filter((d) => d.profileId === this.profile()?.id),
  );
  readonly documentCount = computed(() => this.documents().length);
  readonly verifiedCount = computed(
    () => this.documents().filter((d) => d.status === VERIFIED_STATUS).length,
  );

  constructor() {
    this.loadProfile();
    this.loadDocuments();
  }

  updateProfile = (profile: Profile, onSuccess?: () => void): void => {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.profileService
      .updateProfile(profile)
      .pipe(retry(2))
      .subscribe({
        next: (updated) => {
          this.profileSignal.set(updated);
          this.loadingSignal.set(false);
          onSuccess?.();
        },
        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Failed to update profile'));
          this.loadingSignal.set(false);
        },
      });
  };

  uploadDocument = (document: VerificationDocument, fileName: string): void => {
    const submitted = new VerificationDocument({
      id: document.id,
      profileId: document.profileId,
      type: document.type,
      status: IN_REVIEW_STATUS,
      updatedAt: new Date().toISOString(),
      fileName,
    });
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.profileService
      .updateVerificationDocument(submitted)
      .pipe(retry(2))
      .subscribe({
        next: (updated) => {
          this.documentsSignal.update((docs) =>
            docs.map((d) => (d.id === updated.id ? updated : d)),
          );
          this.loadingSignal.set(false);
        },
        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Failed to update document'));
          this.loadingSignal.set(false);
        },
      });
  };

  private loadProfile = (): void => {
    this.loadingSignal.set(true);
    this.profileService
      .getProfiles()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (profiles) => {
          this.profileSignal.set(profiles[0] ?? null);
          this.loadingSignal.set(false);
        },
        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Failed to load profile'));
          this.loadingSignal.set(false);
        },
      });
  };

  private loadDocuments = (): void => {
    this.profileService
      .getVerificationDocuments()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (documents) => this.documentsSignal.set(documents),
        error: (err) => this.errorSignal.set(this.formatError(err, 'Failed to load documents')),
      });
  };

  private formatError = (error: unknown, fallback: string): string =>
    error instanceof Error ? error.message : fallback;
}
