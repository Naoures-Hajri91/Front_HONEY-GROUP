import { ChangeDetectorRef, Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
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

  user: any = null;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId) || !this.authService.isAuthenticated()) {
      return;
    }

    this.authService.getCurrentUser().subscribe({
      next: (data) => {
        this.user = data;
        this.cd.markForCheck();
      },
      error: () => {
        this.user = null;
      },
    });
  }

  logout(): void {

    this.authService.logout();

    this.user = null;

    // 🔥 refresh pour MAJ navbar immédiate
    window.location.href = '/';
  }
}
