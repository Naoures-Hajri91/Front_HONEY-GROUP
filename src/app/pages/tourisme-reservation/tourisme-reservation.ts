import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

// On simule l'enum côté front pour la liaison
export enum TypePayment {
  VIREMENT_BANCAIRE = 'VIREMENT_BANCAIRE',
  MOBILE_MONEY = 'MOBILE_MONEY',
  PAYPAL = 'PAYPAL',
  CARTE_BANCAIRE = 'CARTE_BANCAIRE'
}

@Component({
  selector: 'app-tourisme-reservation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tourisme-reservation.html',
  styleUrl: './tourisme-reservation.css',
})

export class TourismeReservation implements OnInit {

  quantite: number = 1;
  modeSelectionne: keyof typeof TypePayment = 'CARTE_BANCAIRE'; // Mode par défaut
  
  circuit: any = {
    titre: 'Trek & Découverte : Le Nord Sauvage',
    prixBase: 1200
  };

  sessionSelectionnee: any = {
    debut: new Date('2026-07-15'),
    fin: new Date('2026-07-28'),
    placesRestantes: 8
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Récupération de l'ID passé dans l'URL pour plus tard requêter le bon circuit
    const idSession = this.route.snapshot.paramMap.get('idSession');
  }

  changerQuantite(valeur: number) {
    const nouvelleQte = this.quantite + valeur;
    if (nouvelleQte >= 1 && nouvelleQte <= this.sessionSelectionnee.placesRestantes) {
      this.quantite = nouvelleQte;
    }
  }

  selectionnerMode(mode: keyof typeof TypePayment) {
    this.modeSelectionne = mode;
  }

  calculerTotal(): number {
    return this.circuit.prixBase * this.quantite;
  }

  // Ajoute ces propriétés dans ton composant :
modalLegaleOuverte: boolean = false;
titreModalLegale: 'remboursement' | 'confidentialite' | 'conditions' | '' = '';

// Ajoute ces méthodes juste en dessous de tes fonctions existantes :
ouvrirModalLegale(type: 'remboursement' | 'confidentialite' | 'conditions') {
  this.titreModalLegale = type;
  this.modalLegaleOuverte = true;
}

fermerModalLegale() {
  this.modalLegaleOuverte = false;
  this.titreModalLegale = '';
}
}
