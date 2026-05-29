import { Component, OnInit, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Auth } from '../../services/auth';
import { BookingService } from '../../services/booking.service';
import { PaymentService, Payment } from '../../services/payment.service';
import { ToastrService } from 'ngx-toastr';
import { UserProfile } from '../../models/user-profile';
import { Booking } from '../../models/booking';
import { Role, StatutBooking, StatutPayment } from '../../models/role';

type OngletCompte = 'infos' | 'dashboard';

@Component({
  selector: 'app-mon-compte',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './mon-compte.html',
  styleUrl: './mon-compte.css',
})
export class MonCompte implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(Auth);
  private bookingService = inject(BookingService);
  private paymentService = inject(PaymentService);
  protected toastr = inject(ToastrService);
  private platformId = inject(PLATFORM_ID);
  private cd = inject(ChangeDetectorRef);

  ongletActif: OngletCompte = 'infos';
  chargementProfil = true;
  chargementReservations = false;
  chargementPaiements = false;
  envoiProfil = false;
  envoiResetMdp = false;

  protected readonly Role = Role;
  protected readonly StatutPayment = StatutPayment;
  protected readonly StatutBooking = StatutBooking;
  userRole: Role | null = null;

  profil: UserProfile | null = null;
  reservations: Booking[] = [];
  reservationsFiltrees: Booking[] = [];
  paiements: Payment[] = [];
  paiementsFiltres: Payment[] = [];
  
  // Pour la vue STAFF
  clientsFichiersList: Booking[] = [];
  clientsSelectionnes: Map<number, Booking[]> = new Map();

  Math = Math;
  pageReservations = 1;
  itemsParPageReservations = 5;
  pagePaiements = 1;
  itemsParPagePaiements = 5;

  filtreDestination = '';
  filtreDateDebut = '';
  filtreDateFin = '';
  filtreMontantMin: number | null = null;
  filtreMontantMax: number | null = null;
  filtrePaiementStatut = '';
  filtrePaiementClient = '';

  profileForm: FormGroup = this.fb.group({
    nom: ['', [Validators.required, Validators.pattern('^[A-Za-zÀ-ÖØ-öø-ÿ -]{2,100}$')]],
    prenom: ['', [Validators.required, Validators.pattern('^[A-Za-zÀ-ÖØ-öø-ÿ -]{2,100}$')]],
    adresse: ['', [Validators.required, Validators.minLength(5)]],
    telephone: ['', [Validators.required, Validators.pattern('^\\+?[1-9]\\d{7,14}$')]],
    pays: ['', [Validators.required]],
    preferences: [''],
  });

  ngOnInit(): void {
    this.chargerProfil();
  }

  changerOnglet(onglet: OngletCompte): void {
    this.ongletActif = onglet;
    if (onglet === 'dashboard' && this.reservations.length === 0 && !this.chargementReservations) {
      if (this.userRole === Role.CLIENT) {
        this.chargerReservations();
      } else {
        this.chargerDashboardStaff();
      }
    }
  }

  chargerProfil(): void {
    this.chargementProfil = true;
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.profil = user;
        this.userRole = user.role as Role;
        this.profileForm.patchValue({
          nom: user.nom ?? '',
          prenom: user.prenom ?? '',
          adresse: user.adresse ?? '',
          telephone: user.telephone ?? '',
          pays: user.pays ?? '',
          preferences: user.preferences ?? '',
        });
        this.chargementProfil = false;
        this.cd.markForCheck();
      },
      error: () => {
        if (isPlatformBrowser(this.platformId)) {
          this.toastr.error("Impossible de charger votre profil.", 'Erreur');
        }
        this.chargementProfil = false;
        this.cd.markForCheck();
      },
    });
  }

  enregistrerProfil(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      this.toastr.warning('Veuillez corriger le formulaire.');
      return;
    }

    this.envoiProfil = true;
    const v = this.profileForm.value;

    this.authService
      .updateProfile({
        nom: v.nom,
        prenom: v.prenom,
        adresse: v.adresse,
        telephone: v.telephone,
        pays: v.pays,
        preferences: v.preferences || undefined,
      })
      .subscribe({
        next: (user) => {
          this.profil = user;
          this.toastr.success('Profil mis à jour.');
          this.envoiProfil = false;
        },
        error: (err) => {
          const message =
            err?.error?.message || err?.error || 'Échec de la mise à jour du profil.';
          this.toastr.error(message, 'Erreur');
          this.envoiProfil = false;
        },
      });
  }

  demanderReinitialisationMotDePasse(): void {
    if (!this.profil?.email) {
      return;
    }

    this.envoiResetMdp = true;
    this.authService.forgotPassword(this.profil.email).subscribe({
      next: () => {
        this.toastr.success(
          'Un e-mail de réinitialisation a été envoyé si le compte existe.',
          'Mot de passe',
        );
        this.envoiResetMdp = false;
      },
      error: () => {
        this.toastr.error("Impossible d'envoyer la demande pour le moment.", 'Erreur');
        this.envoiResetMdp = false;
      },
    });
  }

  // ================== VUE CLIENT ==================

  chargerReservations(): void {
    if (this.userRole !== Role.CLIENT) return;

    this.chargementReservations = true;
    this.bookingService.getMyBookings().subscribe({
      next: (bookings) => {
        this.reservations = bookings ?? [];
        this.appliquerFiltresReservations();
        this.chargementReservations = false;
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Impossible de charger vos réservations.', 'Erreur');
        this.chargementReservations = false;
      },
    });
  }

  appliquerFiltresReservations(): void {
    const dest = this.filtreDestination.trim().toLowerCase();
    const min = this.filtreMontantMin;
    const max = this.filtreMontantMax;

    this.reservationsFiltrees = this.reservations.filter((r) => {
      const libelle = `${r.prestationTitre ?? ''} ${r.poleNom ?? ''}`.toLowerCase();
      const matchDest = !dest || libelle.includes(dest);

      const dateRef = r.dateDebutSession || r.dateResa;
      let matchDate = true;
      if (dateRef && (this.filtreDateDebut || this.filtreDateFin)) {
        const d = new Date(dateRef).toISOString().split('T')[0];
        if (this.filtreDateDebut && d < this.filtreDateDebut) {
          matchDate = false;
        }
        if (this.filtreDateFin && d > this.filtreDateFin) {
          matchDate = false;
        }
      } else if (this.filtreDateDebut || this.filtreDateFin) {
        matchDate = false;
      }

      const montant = r.montantTotal != null ? Number(r.montantTotal) : null;
      let matchMontant = true;
      if (montant != null) {
        if (min != null && montant < min) {
          matchMontant = false;
        }
        if (max != null && montant > max) {
          matchMontant = false;
        }
      } else if (min != null || max != null) {
        matchMontant = false;
      }

      return matchDest && matchDate && matchMontant;
    });

    this.pageReservations = 1;
  }

  reinitialiserFiltresReservations(): void {
    this.filtreDestination = '';
    this.filtreDateDebut = '';
    this.filtreDateFin = '';
    this.filtreMontantMin = null;
    this.filtreMontantMax = null;
    this.appliquerFiltresReservations();
  }

  // ================== VUE STAFF (MANAGER/ADMIN) ==================

  chargerDashboardStaff(): void {
    this.chargementReservations = true;
    this.chargementPaiements = true;

    this.bookingService.getMyBookings().subscribe({
      next: (bookings) => {
        this.reservations = bookings ?? [];
        this.clientsFichiersList = this.extractClientsUniques(bookings);
        this.appliquerFiltresReservations();
        this.chargementReservations = false;
      },
      error: (err) => {
        console.error(err);
        this.chargementReservations = false;
      },
    });

    this.chargerPaiementsStaff();
  }

  extractClientsUniques(bookings: Booking[]): Booking[] {
    const seen = new Set<number>();
    const uniques: Booking[] = [];
    for (const b of bookings) {
      if (b.userId && !seen.has(b.userId)) {
        seen.add(b.userId);
        uniques.push(b);
      }
    }
    return uniques;
  }

  chargerPaiementsStaff(): void {
    this.chargementPaiements = true;
    this.paymentService.getMyPayments().subscribe({
      next: (paiements) => {
        this.paiements = paiements ?? [];
        this.appliquerFiltrePaiements();
        this.chargementPaiements = false;
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Impossible de charger les paiements.', 'Erreur');
        this.chargementPaiements = false;
      },
    });
  }

  appliquerFiltrePaiements(): void {
    const statutRecherche = this.filtrePaiementStatut;
    const clientFilter = this.filtrePaiementClient.toLowerCase();

    this.paiementsFiltres = this.paiements.filter((p) => {
      const matchStatut = !statutRecherche || p.statut === statutRecherche;
      const matchClient =
        !clientFilter ||
        `${p.clientNom} ${p.clientPrenom}`.toLowerCase().includes(clientFilter) ||
        p.clientEmail.toLowerCase().includes(clientFilter);
      return matchStatut && matchClient;
    });

    this.pagePaiements = 1;
  }

  validerPaiement(payment: Payment): void {
    if (confirm(`Valider le paiement de ${payment.clientNom} ${payment.clientPrenom} (${payment.montant}€) ?`)) {
      this.paymentService.validerPaiement(payment.id).subscribe({
        next: () => {
          this.toastr.success(`Paiement #${payment.id} validé`, 'Succès');
        payment.statut = StatutPayment.VALIDE;
          this.appliquerFiltrePaiements();
        },
        error: (err) => {
          this.toastr.error('Erreur lors de la validation', 'Erreur');
          console.error(err);
        },
      });
    }
  }

  rejeterPaiement(payment: Payment): void {
    if (confirm(`Rejeter le paiement de ${payment.clientNom} ${payment.clientPrenom} ?`)) {
      this.paymentService.rejeterPaiement(payment.id).subscribe({
        next: () => {
          this.toastr.success(`Paiement #${payment.id} rejeté`, 'Succès');
        payment.statut = StatutPayment.REJETE;
          this.appliquerFiltrePaiements();
        },
        error: (err) => {
          this.toastr.error('Erreur lors du rejet', 'Erreur');
          console.error(err);
        },
      });
    }
  }

  approuverAnnulation(booking: Booking): void {
    if (confirm(`Approuver l'annulation pour ${booking.userNomComplet} (Réservation #${booking.id}) ?`)) {
      this.bookingService.approuverAnnulation(booking.id).subscribe({
        next: () => {
          this.toastr.success(`Annulation approuvée`, 'Succès');
          booking.statut = StatutBooking.ANNULE;
        },
        error: (err) => {
          this.toastr.error("Erreur lors de l'approbation", 'Erreur');
          console.error(err);
        },
      });
    }
  }

  // ================== FORMATEURS ==================

  formatDate(value?: string): string {
    if (!value) {
      return '—';
    }
    return new Date(value).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  formatMontant(montant?: number): string {
    if (montant == null) {
      return '—';
    }
    return `${montant} €`;
  }

  obtenirLibelleStatutPaiement(statut: string): string {
    const labels: { [key: string]: string } = {
      [StatutPayment.EN_VERIFICATION]: '⏳ En vérification',
      [StatutPayment.VALIDE]: '✓ Validé',
      [StatutPayment.REJETE]: '✗ Rejeté',
      [StatutPayment.EN_ATTENTE_PREUVE]: '🕒 Attente preuve'
    };
    return labels[statut] || statut;
  }

  obtenirCouleurStatutPaiement(statut: string): string {
    const colors: { [key: string]: string } = {
      [StatutPayment.EN_VERIFICATION]: 'bg-warning-subtle text-warning',
      [StatutPayment.VALIDE]: 'bg-success-subtle text-success',
      [StatutPayment.REJETE]: 'bg-danger-subtle text-danger',
    };
    return colors[statut] || 'bg-secondary-subtle text-secondary';
  }

  // ================== PAGINATEURS ==================

  get reservationsPaginees(): Booking[] {
    const start = (this.pageReservations - 1) * this.itemsParPageReservations;
    return this.reservationsFiltrees.slice(start, start + this.itemsParPageReservations);
  }

  get totalPagesReservations(): number {
    if (this.reservationsFiltrees.length === 0) {
      return 1;
    }
    return Math.ceil(this.reservationsFiltrees.length / this.itemsParPageReservations);
  }

  get paiementsPaginees(): Payment[] {
    const start = (this.pagePaiements - 1) * this.itemsParPagePaiements;
    return this.paiementsFiltres.slice(start, start + this.itemsParPagePaiements);
  }

  get totalPagesPaiements(): number {
    if (this.paiementsFiltres.length === 0) {
      return 1;
    }
    return Math.ceil(this.paiementsFiltres.length / this.itemsParPagePaiements);
  }

  // ================== NAVIGATION STAFF ==================

  allerVersAuditPaiements(): void {
    this.toastr.info('Redirection vers la validation des paiements...');
  }

  allerVersGestionAnnulations(): void {
    this.toastr.info('Redirection vers la gestion des annulations...');
  }
}
