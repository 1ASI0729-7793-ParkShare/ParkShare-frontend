import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserChip } from './profile/presentation/components/user-chip/user-chip';
import { Layout } from './shared/presentation/components/layout/layout';

@Component({
  selector: 'app-root',
  imports: [Layout, UserChip],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('parkshare');
}
