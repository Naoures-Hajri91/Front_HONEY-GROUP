import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TourismeService, Prestation, Session } from '../../services/tourisme';

@Component({
  selector: 'app-tourisme',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tourisme.html',
  styleUrl: './tourisme.css',
})

export class Tourisme implements OnInit {
  
  // Injection moderne de ton service écotourisme
  private tourismeService = inject(TourismeService);

  // Tableaux de données alimentés par la BDD de Honey Group
  prestationsTourisme: Prestation[] = [];
  listeSessions: Session[] = [];

  // Variables de gestion de la Pop-up
  modalOuverte: boolean = false;
  prestationSelectionnee: Prestation | null = null;

  
  ngOnInit(): void {
    this.chargerDonneesPoleTourisme();
  }

  /**
   * Consomme les endpoints de ton API Spring Boot pour initialiser la page d'accueil du pôle
   */
  chargerDonneesPoleTourisme(): void {
    // 1. Récupération de l'ensemble des sessions pour la modale
    this.tourismeService.getSessions().subscribe({
      next: (sessions: Session[]) => {
        this.listeSessions = sessions;

        // 2. Récupération des prestations du catalogue
        this.tourismeService.getPrestations().subscribe({
          next: (prestations: Prestation[]) => {
            // Optionnel : Si tu veux afficher uniquement les 3 premières sur la page d'accueil,
            // tu peux faire : this.prestationsTourisme = prestations.slice(0, 3);
            this.prestationsTourisme = prestations;
          },
          error: (err) => console.error('Erreur lors du chargement des prestations (accueil)', err)
        });
      },
      error: (err) => console.error('Erreur lors du chargement des sessions (accueil)', err)
    });
  }

  // Ouvre la pop-up et stocke la prestation cliquée
  ouvrirSessions(prestation: Prestation): void {
    this.prestationSelectionnee = prestation;
    this.modalOuverte = true;
  }

  // Ferme la pop-up
  fermerSessions(): void {
    this.modalOuverte = false;
    this.prestationSelectionnee = null;
  }

  // Filtre les sessions qui appartiennent à la prestation sélectionnée
  filtrerSessionsParPrestation(prestationId: number): Session[] {
    return this.listeSessions.filter(s => s.idPrestation === prestationId);
  }
}
