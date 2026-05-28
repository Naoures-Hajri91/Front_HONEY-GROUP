import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {Auth} from '../../services/auth';
import {ToastrService} from 'ngx-toastr';
@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(Auth);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastr = inject(ToastrService);

  loginQueryParams: { returnUrl?: string } = {};

  errorMessage: string | null = null;

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/mon-compte']);
      return;
    }

    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

    if (returnUrl?.startsWith('/')) {
      this.loginQueryParams = { returnUrl };
    }
  }

  registerForm: FormGroup = this.fb.group({

    nom: ['', [
      Validators.required,
      Validators.pattern('^[A-Za-zÀ-ÖØ-öø-ÿ -]{2,100}$')
    ]],

    prenom: ['', [
      Validators.required,
      Validators.pattern('^[A-Za-zÀ-ÖØ-öø-ÿ -]{2,100}$')
    ]],

    email: ['', [
      Validators.required,
      Validators.email
    ]],

    countryCode: ['+33', [
      Validators.required
    ]],

    telephone: ['', [
      Validators.required,
      Validators.pattern('^[0-9]{6,15}$')
    ]],

    password: ['', [
      Validators.required,
      Validators.minLength(8)
    ]],

    adresse: ['', [
      Validators.required,
      Validators.minLength(5)
    ]],

    pays: ['', [
      Validators.required
    ]],

    preferences: ['']

  });

  onSubmit(): void {

    if (this.registerForm.invalid) {
      this.toastr.warning('Formulaire invalide ❌');
      this.registerForm.markAllAsTouched();
      return;
    }

    const form = this.registerForm.value;

    const payload = {
      nom: form.nom,
      prenom: form.prenom,
      email: form.email,
      telephone: `${form.countryCode}${form.telephone}`,
      password: form.password,
      adresse: form.adresse,
      pays: form.pays,
      preferences: form.preferences
    };

    this.authService.register(payload).subscribe({

      next: (res) => {

        console.log("SUCCESS =>", res);

        this.toastr.success(
          'Compte créé avec succès 🎉',
          'Succès'
        );

        this.router.navigate(['/login'], { queryParams: this.loginQueryParams });
      },

      error: (err: any) => {

        console.log("FULL ERROR => ", err);
        console.log("BACKEND RESPONSE => ", err.error);

        const message =
          err?.error?.message ||   // JSON backend
          err?.error ||            // string backend
          err?.message ||          // fallback Angular
          "Erreur lors de l'inscription";

        this.toastr.error(message, 'Erreur ❌');
      }

    });
  }

  // GETTERS
  get nom() { return this.registerForm.get('nom'); }
  get prenom() { return this.registerForm.get('prenom'); }
  get email() { return this.registerForm.get('email'); }
  get telephone() { return this.registerForm.get('telephone'); }
  get countryCode() { return this.registerForm.get('countryCode'); }
  get password() { return this.registerForm.get('password'); }
  get adresse() { return this.registerForm.get('adresse'); }
  get pays() { return this.registerForm.get('pays'); }
}



