import {
  Component,
  inject,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-devis',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './devis.html',
  styleUrl: './devis.css',
})
export class Devis implements OnInit {

  private route = inject(ActivatedRoute);
  private userService = inject(Auth);
  private cdr = inject(ChangeDetectorRef);

  pole: string = '';
  userConnected = false;

  form: any = {
    nom: '',
    email: '',
    pole: '',

    // 🔥 AJOUT NAMECHEAP (IT)
    domaine: '',
    hebergement: ''
  };

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {

      // 🔥 NORMALISATION ULTRA IMPORTANTE
      const rawPole = params.get('pole') || '';

      this.pole = rawPole
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      console.log("RAW POLE =>", rawPole);
      console.log("FINAL POLE =>", this.pole);

      this.userConnected = this.userService.isAuthenticated();

      this.form.pole = this.pole;

      // ================= USER =================
      if (this.userConnected) {

        this.userService.getCurrentUser().subscribe({

          next: (user: any) => {

            console.log('USER =>', user);

            this.form.nom = user?.nom || '';
            this.form.email = user?.email || '';

            this.cdr.detectChanges();
          },

          error: (err) => {

            console.log('ERROR USER =>', err);

            this.form.nom = '';
            this.form.email = '';

            this.cdr.detectChanges();
          }

        });

      }

      // ================= FIELDS =================
      this.initFields();
      this.setAutoValues();

    });

  }

  // 🔥 AUTO FILL selon pôle
  setAutoValues(): void {

    if (this.pole.includes('tour')) {

      this.form.circuit = 'Nosy Be';
    }
  }

  // ================= FORM DYNAMIQUE =================
  initFields(): void {

    const p = this.pole;

    // ===== TOURISME =====
    if (p === 'tourisme' || p === 'eco') {

      this.form.circuit = '';
      this.form.dateDepart = '';
      this.form.adultes = 1;
      this.form.enfants = 0;
      this.form.confort = '';
      this.form.notes = '';
    }

    // ===== IT =====
    else if (p === 'it' || p === 'digital') {

      this.form.typeProjet = '';
      this.form.urgence = '';
      this.form.cahierCharges = '';

      // 🔥 NAMECHEAP FIELDS
      this.form.domaine = '';
      this.form.hebergement = '';
    }

    // ===== FORMATION =====
    else if (p === 'formation') {

      this.form.langue = '';
      this.form.niveau = '';
      this.form.creneaux = '';
    }

    // ===== EVENT =====
    else if (p === 'event' || p === 'evenementiel') {

      this.form.typeEvent = '';
      this.form.lieu = '';
      this.form.volume = 0;
    }
  }

  // ================= SUBMIT =================
  submit(): void {
    console.log('DEMANDE DEVIS =>', this.form);
  }

}
