import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
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

  user: any = null;

  ngOnInit(): void {

    console.log("HEADER INIT");

    // ✅ PROTECTION SSR
    if (typeof window === 'undefined') {
      return;
    }

    const token = localStorage.getItem('accessToken');

    console.log("TOKEN =", token);

    if (token) {

      this.authService.getCurrentUser().subscribe({

        next: (data) => {
          this.user = data;
          console.log("USER =", this.user);
          this.cd.detectChanges(); // 🔥 FORCE UPDATE UI
        },

        error: (err) => {
          console.log("ERROR /me =", err);
          this.user = null;
        }

      });

    }
  }

  logout(): void {

    this.authService.logout();

    this.user = null;

    // 🔥 refresh pour MAJ navbar immédiate
    window.location.href = '/';
  }
}
