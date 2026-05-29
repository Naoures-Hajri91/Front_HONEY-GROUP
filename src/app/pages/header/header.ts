import { ChangeDetectorRef, Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {

  logoPath = 'assets/images/logo-honey-group.jpg';

  private authService = inject(Auth);
  private cd = inject(ChangeDetectorRef);
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);

  get user() {
    return this.authService.currentUser();
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId) && this.authService.isAuthenticated()) {
      this.authService.getCurrentUser().subscribe({
        next: () => {
          this.cd.markForCheck();
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
