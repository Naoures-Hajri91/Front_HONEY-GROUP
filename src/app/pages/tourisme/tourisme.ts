import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Réutilisation des interfaces alignées sur ton backend Spring Boot
export interface PrestationMetadata {
  id_metadata?: number;
  lieu_depart: string;
  lieu_arrivee: string;
}

export interface Prestation {
  id: number; // private Long id;
  titreService: string; // private String titreService;
  description: string; // private String description;
  prixBase: number; // private Double prixBase;
  metadata?: PrestationMetadata;
  statut: string; // private StatutPrestation statut;
}

export interface Session {
  id: number; // private Long id;
  dateDebut: Date | string; // private LocalDateTime dateDebut;
  dateFin: Date | string; // private LocalDateTime dateFin;
  capaciteMax: number; // private Integer capaciteMax;
  nbInscrits: number; // private Integer nbInscrits;
  statutSession: 'OUVERT' | 'COMPLET' | 'EN_COURS' | 'CLOTURE' | 'ANNULE';
  idPrestation: number; // ID de la prestation associée pour le filtrage
}

@Component({
  selector: 'app-tourisme',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tourisme.html',
  styleUrl: './tourisme.css',
})

export class Tourisme implements OnInit {
  
  // Tableaux de données initialisés vides, en attente de la BDD
  prestationsTourisme: Prestation[] = [];
  listeSessions: Session[] = [];

  // Variables de gestion de la Pop-up
  modalOuverte: boolean = false;
  prestationSelectionnee: Prestation | null = null;

  constructor() {}

  ngOnInit(): void {
    this.chargerDonneesPoleTourisme();
  }

  /**
   * Méthode à interconnecter avec ton service API pour Honey Group
   */
  chargerDonneesPoleTourisme(): void {
    // TODO: Appel de ton service HTTP (ex: filtré sur l'id_pole = 2 ou via un endpoint dédié)
    // Example:
    // this.tourismeService.getPrestationsByPole(2).subscribe(data => this.prestationsTourisme = data);
    // this.tourismeService.getSessionsActives().subscribe(data => this.listeSessions = data);
  }

  // Ouvre la pop-up et stocke la prestation cliquée
  ouvrirSessions(prestation: Prestation) {
    this.prestationSelectionnee = prestation;
    this.modalOuverte = true;
  }

  // Ferme la pop-up
  fermerSessions() {
    this.modalOuverte = false;
    this.prestationSelectionnee = null;
  }

  // Filtre les sessions qui appartiennent à la prestation sélectionnée (basé sur p.id et s.idPrestation)
  filtrerSessionsParPrestation(prestationId: number): Session[] {
    return this.listeSessions.filter(s => s.idPrestation === prestationId);
  }
}
