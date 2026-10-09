import { Component } from '@angular/core';
import { UserChip } from './profile/presentation/components/user-chip/user-chip';
import { Layout } from './shared/presentation/components/layout/layout';

@Component({
  imports: [Layout, UserChip],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {}
