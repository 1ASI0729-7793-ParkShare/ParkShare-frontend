import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-placeholder',
  imports: [TranslatePipe],
  templateUrl: './placeholder.html',
})
export class Placeholder {
  protected readonly titleKey = inject(ActivatedRoute).snapshot.data['titleKey'] as string;
}
