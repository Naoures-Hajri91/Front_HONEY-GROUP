import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TourismeService, Prestation, Session, BookingRequest } from '../../services/tourisme';
import { Auth } from '../../services/auth';
import { ToastrService } from 'ngx-toastr';
import { TypePayment } from '../../models/payment';
import { TypeReservation } from '../../models/reservation';

@Component({
  selector: 'app-tourisme-reservation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tourisme-reservation.html',
  styleUrl: './tourisme-reservation.css',
})

export class TourismeReservation implements OnInit {

  // Injection moderne des dépendances d'Angular
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tourismeService = inject(TourismeService);
  private authService = inject(Auth);
  private toastr = inject(ToastrService);

  // Passerelle pour rendre l'énumération accessible dans le fichier HTML
  protected readonly TypePayment = TypePayment;

  quantite: number = 1;
  modeSelectionne: TypePayment = TypePayment.CARTE_BANCAIRE; // Initialisation propre et typée via l'enum
  
  // Objets d'API initialisés proprement à null (Le catalogue commence à blanc)
  prestation: Prestation | null = null;
  sessionSelectionnee: Session | null = null;
  placesRestantes: number = 0;

  // Modales légales
  modalLegaleOuverte: boolean = false;
  titreModalLegale: 'remboursement' | 'confidentialite' | 'conditions' | '' = '';
  
  ngOnInit(): void {
    const idSessionParam = this.route.snapshot.paramMap.get('idSession');
    const idSession = idSessionParam ? parseInt(idSessionParam, 10) : null;

    if (idSession) {
      this.chargerDonneesSession(idSession);
    }
  }

  /**
   * Se connecte au service en exploitant les endpoints ciblés de ton API Spring Boot
   */
  chargerDonneesSession(idSession: number): void {
    // 1. Récupération directe de LA session via son ID unique
    this.tourismeService.getSessionById(idSession).subscribe({
      next: (session: Session) => {
        this.sessionSelectionnee = session;
        this.placesRestantes = session.capaciteMax - session.nbInscrits;

        // 2. Récupération directe de LA prestation correspondante
        if (session.idPrestation) {
          this.tourismeService.getPrestationById(session.idPrestation).subscribe({
            next: (prestation: Prestation) => {
              this.prestation = prestation;
            },
            error: (err) => console.error('Erreur lors du chargement de la prestation', err)
          });
        }
      },
      error: (err) => console.error('Erreur lors du chargement de la session', err)
    });
  }

  changerQuantite(valeur: number): void {
    const nouvelleQte = this.quantite + valeur;
    if (nouvelleQte >= 1 && nouvelleQte <= this.placesRestantes) {
      this.quantite = nouvelleQte;
    }
  }

  selectionnerMode(mode: TypePayment): void {
    this.modeSelectionne = mode;
  }

  calculerTotal(): number {
    return this.prestation ? this.prestation.prixBase * this.quantite : 0;
  }

  ouvrirModalLegale(type: 'remboursement' | 'confidentialite' | 'conditions'): void {
    this.titreModalLegale = type;
    this.modalLegaleOuverte = true;
  }

  fermerModalLegale(): void {
    this.modalLegaleOuverte = false;
    this.titreModalLegale = '';
  }

  /**
   * Envoie la demande de réservation finale au backend Spring Boot
   */
  confirmerReservation(): void {
    if (!this.sessionSelectionnee) {
      this.toastr.warning("Impossible de réserver, aucune session n'est sélectionnée.");
      return;
    }

    if (!this.authService.isAuthenticated()) {
      this.toastr.info('Connectez-vous pour finaliser votre réservation.');
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url },
      });
      return;
    }

    // Construction du DTO conforme à ton entité Java BookingRequest
    const payload: BookingRequest = {
      sessionId: this.sessionSelectionnee.id,
      nbPersonnes: this.quantite,
      typeReservation: TypeReservation.SESSION // Fixé sur SESSION pour le catalogue écotourisme
    };

    this.tourismeService.creerReservation(payload).subscribe({
      next: () => {
        this.toastr.success('Votre réservation a bien été enregistrée !');
        this.router.navigate(['/tourisme/catalogue']);
      },
      error: (err) => {
        console.error('Erreur lors de la création de la réservation', err);

        if (err.status === 401 || err.status === 403) {
          this.toastr.warning('Session expirée ou accès refusé. Reconnectez-vous pour réserver.');
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: this.router.url },
          });
          return;
        }

        const message =
          err?.error?.message ||
          err?.error ||
          'Une erreur est survenue lors de la validation. Veuillez réessayer.';

        this.toastr.error(message, 'Erreur');
      }
    });
  }
}