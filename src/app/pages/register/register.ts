import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
@Component({
  selector: 'app-register',
  imports: [ ReactiveFormsModule,  CommonModule,],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm: FormGroup;


  constructor(private fb: FormBuilder) {

    this.registerForm = this.fb.group({

      // USER
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

      password: ['', [
        Validators.required,
        Validators.minLength(8)
      ]],

      role: ['USER', Validators.required],

      // PROFILE
      telephone: [''],
      countryCode: ['+33', Validators.required],
      pays: [''],
      adresse: ['']

    });

  }

  onSubmit(): void {

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const form = this.registerForm.value;

    const payload = {
      nom: form.nom,
      prenom: form.prenom,
      email: form.email,
      password: form.password,
      role: form.role,

      profile: {
        telephone: form.telephone,
        pays: form.pays,
        adresse: form.adresse
      }
    };

    console.log("REGISTER PAYLOAD 👉", payload);

    // TODO: call API
    // this.authService.register(payload).subscribe(...)
  }
  }



