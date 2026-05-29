import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../services/auth';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {

  private fb = inject(FormBuilder);
  private authService = inject(Auth);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastr = inject(ToastrService);

  /** Message affiché lorsqu'une réservation attend une connexion. */
  connexionPourReservation = false;

  /** Query params transmis au lien d'inscription. */
  registerQueryParams: { returnUrl?: string } = {};

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/mon-compte']);
      return;
    }

    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

    if (returnUrl?.startsWith('/')) {
      this.registerQueryParams = { returnUrl };
      this.connexionPourReservation = returnUrl.includes('/tourisme/reservation');
    }
  }

  private navigateAfterAuth(): void {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

    if (returnUrl?.startsWith('/')) {
      this.router.navigateByUrl(returnUrl);
      return;
    }

    this.router.navigate(['/']);
  }

  onSubmit(): void {

    if (this.loginForm.invalid) {
      this.toastr.warning('Formulaire invalide ❌');
      this.loginForm.markAllAsTouched();
      return;
    }

    const payload = this.loginForm.value;

    this.authService.login(payload).subscribe({

      next: (res) => {

        console.log("LOGIN SUCCESS =>", res);

        // 🔐 STOCKAGE TOKENS
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);

        this.toastr.success('Connexion réussie 🎉');

        this.navigateAfterAuth();
      },

      error: (err: any) => {

        console.log("FULL ERROR =>", err);
        console.log("BACKEND RESPONSE =>", err.error);

        const message =
          err?.error?.message ||   // JSON backend
          err?.error ||            // string backend
          err?.message ||          // fallback Angular
          "Erreur lors de la connexion";

        console.log("💥 MESSAGE FINAL =>", message);

        this.toastr.error(message, 'Erreur ❌');
      }

    });
  }


  // GETTERS
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}
