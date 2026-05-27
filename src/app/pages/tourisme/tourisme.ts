import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Important pour le pipe | date
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tourisme',
  imports: [CommonModule, RouterModule],
  templateUrl: './tourisme.html',
  styleUrl: './tourisme.css',
})
export class Tourisme {
  // Variables de gestion de la Pop-up
  modalOuverte: boolean = false;
  prestationSelectionnee: any = null;

  // Jeu de données fictif calqué sur tes insertions SQL (id_pole = 2)
  prestationsTourisme: any[] = [
    {
      id_prestation: 9,
      id_pole: 2,
      titre_service: 'Trek & Découverte : Le Nord Sauvage',
      description: 'Une aventure immersive de Diego-Suarez à Nosy Be, découvrez les Tsingy et la faune locale.',
      prix_base: 1200.0,
      metadata: { lieu_depart: 'Diego-Suarez', lieu_arrivee: 'Nosy Be' }
    },
    {
      id_prestation: 10,
      id_pole: 2,
      titre_service: "L'Allée des Baobabs et Majestueux Sud",
      description: 'Parcours photographique et solidaire à travers Morondava et les parcs nationaux du Sud.',
      prix_base: 1450.0,
      metadata: { lieu_depart: 'Morondava', lieu_arrivee: 'Sud-Madagascar' }
    }
  ];

  // Liste des sessions (calquée sur ton SQL)
  listeSessions: any[] = [
    { prestation_id: 9, date_debut: new Date('2026-05-15T08:00:00'), date_fin: new Date('2026-05-30T18:00:00'), capacite_max: 12, nb_inscrits: 2, statut_session: 'EN_COURS' },
    { prestation_id: 9, date_debut: new Date('2026-09-10T08:00:00'), date_fin: new Date('2026-09-24T18:00:00'), capacite_max: 15, nb_inscrits: 0, statut_session: 'OUVERT' },
    { prestation_id: 10, date_debut: new Date('2026-08-05T07:00:00'), date_fin: new Date('2026-08-20T19:00:00'), capacite_max: 8, nb_inscrits: 1, statut_session: 'OUVERT' }
  ];

  // Ouvre la pop-up et stocke la prestation cliquée
  ouvrirSessions(prestation: any) {
    this.prestationSelectionnee = prestation;
    this.modalOuverte = true;
  }

  // Ferme la pop-up
  fermerSessions() {
    this.modalOuverte = false;
    this.prestationSelectionnee = null;
  }

  // Filtre les sessions qui appartiennent à la prestation sélectionnée
  filtrerSessionsParPrestation(prestationId: number): any[] {
    return this.listeSessions.filter(s => s.prestation_id === prestationId);
  }
}
