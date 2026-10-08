import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-page-not-found',
  imports: [MatButtonModule],
  templateUrl: './page-not-found.html',
  styleUrl: './page-not-found.css',
})
export class PageNotFound implements OnInit {
  protected invalidPath = '';
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.invalidPath = this.route.snapshot.url.map((url) => url.path).join('/');
  }

  protected navigateToHome(): void {
    this.router.navigate(['home']).then();
  }
}
