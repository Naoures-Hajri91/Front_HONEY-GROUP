import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TourismeService, Prestation } from '../../services/tourisme';
import { Poles } from '../../services/poles';
import { getTourismePoleId } from '../../utils/pole.util';
import { SessionsPrestationModal } from '../../components/sessions-prestation-modal/sessions-prestation-modal';

@Component({
  selector: 'app-tourisme',
  standalone: true,
  imports: [CommonModule, RouterModule, SessionsPrestationModal],
  templateUrl: './tourisme.html',
  styleUrl: './tourisme.css',
})
export class Tourisme implements OnInit {
  private tourismeService = inject(TourismeService);
  private poleService = inject(Poles);

  prestationsTourisme: Prestation[] = [];
  modalOuverte = false;
  prestationSelectionnee: Prestation | null = null;

  ngOnInit(): void {
    this.chargerDonneesPoleTourisme();
  }

  chargerDonneesPoleTourisme(): void {
    this.poleService.getAllPoles().subscribe({
      next: (poles) => {
        const idPole = getTourismePoleId(poles);
        if (idPole == null) {
          console.error('Pôle écotourisme introuvable');
          return;
        }

        this.tourismeService.getPrestationsByPole(idPole).subscribe({
          next: (prestations) => {
            this.prestationsTourisme = prestations;
          },
          error: (err) => console.error('Erreur lors du chargement des prestations (accueil)', err),
        });
      },
      error: (err) => console.error('Erreur lors du chargement des pôles (accueil)', err),
    });
  }

  ouvrirSessions(prestation: Prestation): void {
    this.prestationSelectionnee = prestation;
    this.modalOuverte = true;
  }

  fermerSessions(): void {
    this.modalOuverte = false;
    this.prestationSelectionnee = null;
  }
}
