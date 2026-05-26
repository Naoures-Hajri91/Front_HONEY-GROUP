import {
  Component,
  inject,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {ActivatedRoute, Router} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';
import { DevisService } from '../../services/devis-service';
import {ToastrService} from 'ngx-toastr';
import {Header} from '../header/header';

@Component({
  selector: 'app-devis',
  standalone: true,
  imports: [FormsModule, Header],
  templateUrl: './devis.html',
  styleUrl: './devis.css',
})
export class Devis implements OnInit {

  private route = inject(ActivatedRoute);
  private userService = inject(Auth);
  private devisService = inject(DevisService);
  private cdr = inject(ChangeDetectorRef);
  private toastr= inject(ToastrService);
  private router = inject(Router);

  pole: string = '';
  userConnected = false;

  currentUser: any = null;
  currentUserId: number | null = null;

  form: any = {
    nom: '',
    email: '',
    pole: '',

    // TOURISME
    circuit: '',
    dateDepart: '',
    adultes: '',
    enfants: '',
    confort: '',
    notes: '',

    // IT
    typeProjet: '',
    urgence: '',
    cahierCharges: '',
    domaine: '',
    hebergement: '',

    // FORMATION
    langue: '',
    niveau: '',
    creneaux: '',

    // EVENT
    typeEvent: '',
    lieu: '',
    volume: ''
  };

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {

      const rawPole = params.get('pole') || '';

      this.pole = rawPole
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      this.userConnected = this.userService.isAuthenticated();
      this.form.pole = this.pole;

      // ================= USER =================
      if (this.userConnected) {

        this.userService.getCurrentUser().subscribe({
          next: (user: any) => {

            this.currentUser = user;
            this.currentUserId = user?.id || null;

            this.form.nom = user?.nom || '';
            this.form.email = user?.email || '';

            this.cdr.detectChanges();
          },
          error: () => {
            this.currentUser = null;
            this.currentUserId = null;
            this.form.nom = '';
            this.form.email = '';
            this.cdr.detectChanges();
          }
        });

      }

      this.initFields();
      this.setAutoValues();

    });

  }

  // ================= AUTO =================
  setAutoValues(): void {
    if (this.pole.includes('tour')) {
      this.form.circuit = 'Nosy Be';
    }
  }

  // ================= INIT FIELDS =================
  initFields(): void {

    const p = this.pole;

    if (p === 'tourisme' || p === 'eco') {
      this.form.circuit = '';
      this.form.dateDepart = '';
      this.form.adultes = 1;
      this.form.enfants = 0;
      this.form.confort = '';
      this.form.notes = '';
    }

    else if (p === 'it' || p === 'digital') {
      this.form.typeProjet = '';
      this.form.urgence = '';
      this.form.cahierCharges = '';
      this.form.domaine = '';
      this.form.hebergement = '';
    }

    else if (p === 'formation') {
      this.form.langue = '';
      this.form.niveau = '';
      this.form.creneaux = '';
    }

    else if (p === 'event' || p === 'evenementiel') {
      this.form.typeEvent = '';
      this.form.lieu = '';
      this.form.volume = 0;
    }
  }

  // ================= POLE ID =================
  getPoleId(): number {

    switch (this.pole) {

      case 'it':
      case 'digital':
      case 'it & digital':
        return 1;

      case 'eco':
      case 'ecotourisme':
      case 'tourisme':
        return 2;

      case 'event':
      case 'evenementiel':
        return 3;

      case 'formation':
        return 4;

      default:
        return 0;
    }
  }

  // ================= SUBMIT =================
  /*submit(): void {

    const specificDetails: any = {};

    Object.keys(this.form)
      .filter(key =>
        this.form[key] !== null &&
        this.form[key] !== '' &&
        key !== 'nom' &&
        key !== 'email' &&
        key !== 'pole'
      )
      .forEach(key => {
        specificDetails[key] = String(this.form[key]);
      });

    const payload = {
      nom: this.form.nom,
      email: this.form.email,
      userId: this.currentUserId,   // ✅ FIX IMPORTANT
      poleId: this.getPoleId(),
      source: 'Website',
      specificDetails: specificDetails
    };

    console.log("🚀 PAYLOAD FINAL =>", payload);

    this.devisService.envoyerDevis(payload).subscribe({
      next: (res) => {
        console.log("✅ SUCCESS =>", res);
        alert("Devis envoyé avec succès 🚀");
      },
      error: (err) => {
        console.log("❌ ERROR =>", err);
        alert("Erreur lors de l’envoi");
      }
    });
  }*/
  submit(): void {

    const specificDetails: any = {};

    Object.keys(this.form)
      .filter(key =>
        this.form[key] !== null &&
        this.form[key] !== '' &&
        key !== 'nom' &&
        key !== 'email' &&
        key !== 'pole'
      )
      .forEach(key => {
        specificDetails[key] = String(this.form[key]);
      });

    const payload = {
      userId: this.currentUser?.id || null,

      // 👤 guest only
      nom: this.currentUser ? null : this.form.nom,
      email: this.currentUser ? null : this.form.email,

      poleId: this.getPoleId(),
      source: 'Website',

      specificDetails
    };

    console.log("🚀 PAYLOAD FINAL =>", payload);

    this.devisService.envoyerDevis(payload).subscribe({
      next: (res) => {
        console.log("SUCCESS", res);

        this.toastr.success(
          'Votre devis a été envoyé avec succès 🚀',
          'Succès'
        );
        // 🔥 redirection vers home
        setTimeout(() => {
          this.router.navigate(['']);
        }, 1000);
      },


      error: (err) => {
        console.error("ERROR", err);

        this.toastr.error(
          'Erreur lors de l’envoi du devis ❌',
          'Erreur'
        );
      }
    });
  }
}
