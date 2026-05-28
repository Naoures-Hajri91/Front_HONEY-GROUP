import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

// Alignement strict avec l'entité Java Prestation.java
export interface Prestation {
  id: number; // private Long id;
  titreService: string; // private String titreService;
  description: string; // private String description;
  prixBase: number; // private Double prixBase;
  metadata?: {
    lieu_depart?: string;
    lieu_arrivee?: string;
  };
  statut: string; // private StatutPrestation statut;
  dateCreation?: string | Date; // private LocalDateTime dateCreation;
}

// Alignement strict avec l'entité Java Session.java
export interface Session {
  id: number; // private Long id;
  dateDebut: Date | string; // private LocalDateTime dateDebut;
  dateFin: Date | string; // private LocalDateTime dateFin;
  capaciteMax: number; // private Integer capaciteMax;
  nbInscrits: number; // private Integer nbInscrits;
  statutSession: string; // private StatutSession statutSession;
}

export enum TypePayment {
  VIREMENT_BANCAIRE = 'VIREMENT_BANCAIRE',
  MOBILE_MONEY = 'MOBILE_MONEY',
  PAYPAL = 'PAYPAL',
  CARTE_BANCAIRE = 'CARTE_BANCAIRE'
}

@Component({
  selector: 'app-tourisme-reservation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tourisme-reservation.html',
  styleUrl: './tourisme-reservation.css',
})

export class TourismeReservation implements OnInit {

  quantite: number = 1;
  modeSelectionne: keyof typeof TypePayment = 'CARTE_BANCAIRE'; // Mode par défaut
  
  // Objets d'API initialisés proprement à null (Zéro données en dur)
  prestation: Prestation | null = null;
  sessionSelectionnee: Session | null = null;
  placesRestantes: number = 0;

  // Modales légales
  modalLegaleOuverte: boolean = false;
  titreModalLegale: 'remboursement' | 'confidentialite' | 'conditions' | '' = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const idSessionParam = this.route.snapshot.paramMap.get('idSession');
    const idSession = idSessionParam ? parseInt(idSessionParam, 10) : null;

    if (idSession) {
      this.chargerDonneesSession(idSession);
    }
  }

  /**
   * Point de connexion pour requêter ton contrôleur Spring Boot
   */
  chargerDonneesSession(idSession: number): void {
    // TODO: Appel de ton service HTTP
    // Exemple de traitement attendu :
    // this.tourismeService.getSessionDetail(idSession).subscribe(res => {
    //   this.sessionSelectionnee = res.session;
    //   this.prestation = res.prestation;
    //   // Calcul basé sur les attributs réels de l'entité Session :
    //   this.placesRestantes = res.session.capaciteMax - res.session.nbInscrits;
    // });
  }

  changerQuantite(valeur: number) {
    const nouvelleQte = this.quantite + valeur;
    if (nouvelleQte >= 1 && nouvelleQte <= this.placesRestantes) {
      this.quantite = nouvelleQte;
    }
  }

  selectionnerMode(mode: keyof typeof TypePayment) {
    this.modeSelectionne = mode;
  }

  calculerTotal(): number {
    return this.prestation ? this.prestation.prixBase * this.quantite : 0;
  }

  ouvrirModalLegale(type: 'remboursement' | 'confidentialite' | 'conditions') {
    this.titreModalLegale = type;
    this.modalLegaleOuverte = true;
  }

  fermerModalLegale() {
    this.modalLegaleOuverte = false;
    this.titreModalLegale = '';
  }
}

