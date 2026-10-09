import { Component, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ProfileStore } from '../../../application/profile.store';
import { Profile } from '../../../domain/model/profile.entity';
import { VerificationDocument } from '../../../domain/model/verification-document.entity';
import { VehicleForm } from '../../components/vehicle-form/vehicle-form';
import { DocumentList } from '../../components/document-list/document-list';

/** How long the "saved" confirmation stays visible. */
const SNACKBAR_DURATION_MS = 3000;

/** Driver profile view: registered vehicle and verification documents. */
@Component({
  selector: 'app-profile-view',
  imports: [VehicleForm, DocumentList, MatProgressSpinner, TranslatePipe],
  templateUrl: './profile-view.html',
  styleUrl: './profile-view.css',
})
export class ProfileView {
  protected readonly store = inject(ProfileStore);
  private readonly snackBar = inject(MatSnackBar);
  private readonly translate = inject(TranslateService);

  protected onProfileSubmitted(profile: Profile): void {
    this.store.updateProfile(profile, () =>
      this.snackBar.open(this.translate.instant('profile.saved'), undefined, {
        duration: SNACKBAR_DURATION_MS,
      }),
    );
  }

  protected onDocumentUploaded(event: { document: VerificationDocument; fileName: string }): void {
    this.store.uploadDocument(event.document, event.fileName);
  }
}
