import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tourisme-catalogue',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tourisme-catalogue.html',
  styleUrl: './tourisme-catalogue.css',
})
export class TourismeCatalogue implements OnInit, AfterViewInit {

  @ViewChild('scrollSpy') scrollSpy!: ElementRef;

  // Données globales
  toutesLesPrestations: any[] = [];
  toutesLesSessions: any[] = []; // Ajout du réservoir de sessions BDD
  villesDepart: string[] = [];

  // Gestion de la modale
  modalOuverte: boolean = false;
  adorationPrestationSelectionnee: any = null;

  // Tableaux de filtrage
  prestationsFiltreres: any[] = [];
  prestationsVisibles: any[] = [];

  // Filtres
  rechercheTexte: string = '';
  maxPrix: number = 3000;
  villeSelectionnee: string = '';

  // Pagination
  itemsParPage: number = 6;
  pageActuelle: number = 1;
  private observer!: IntersectionObserver;

  ngOnInit(): void {
    this.genererDonneesFictives();
    this.genererSessionsFictives(); // Initialisation des dates disponibles
    this.extraireVillesDepart();
    this.filtrerPrestations();
  }

  ngAfterViewInit() {
    this.configurerInfiniteScroll();
  }

  // 1. LOGIQUE DE LA MODALE POP-UP
  ouvrirSessions(prestation: any) {
    this.adorationPrestationSelectionnee = prestation;
    this.modalOuverte = true;
  }

  fermerSessions() {
    this.modalOuverte = false;
    this.adorationPrestationSelectionnee = null;
  }

  filtrerSessionsParPrestation(idPrestation: number): any[] {
    return this.toutesLesSessions.filter(s => s.id_prestation === idPrestation);
  }

  // 2. FILTRES DE RECHERCHE CATALOGUE
  filtrerPrestations() {
    this.prestationsFiltreres = this.toutesLesPrestations.filter(p => {
      const matchTexte = p.titre_service.toLowerCase().includes(this.rechercheTexte.toLowerCase()) || 
                         p.description.toLowerCase().includes(this.rechercheTexte.toLowerCase());
      const matchPrix = p.prix_base <= this.maxPrix;
      const matchVille = this.villeSelectionnee === '' || p.metadata?.lieu_depart === this.villeSelectionnee;

      return matchTexte && matchPrix && matchVille;
    });

    this.pageActuelle = 1;
    this.prestationsVisibles = this.prestationsFiltreres.slice(0, this.itemsParPage);

    setTimeout(() => {
      if (this.scrollSpy && this.observer) {
        this.observer.observe(this.scrollSpy.nativeElement);
      }
    }, 50);
  }

  onRecherche(event: any) {
    this.rechercheTexte = event.target.value;
    this.filtrerPrestations();
  }

  onChangementDepart(event: any) {
    this.villeSelectionnee = event.target.value;
    this.filtrerPrestations();
  }

  reinitialiserFiltres() {
    this.rechercheTexte = '';
    this.maxPrix = 3000;
    this.villeSelectionnee = '';
    this.filtrerPrestations();
  }

  // 3. INFINITE SCROLL
  configurerInfiniteScroll() {
    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (this.prestationsVisibles.length < this.prestationsFiltreres.length) {
          this.chargerPlusElements();
        } else {
          if (this.scrollSpy) {
            this.observer.unobserve(this.scrollSpy.nativeElement);
          }
        }
      }
    }, { threshold: 0.1 });

    if (this.scrollSpy) {
      this.observer.observe(this.scrollSpy.nativeElement);
    }
  }

  chargerPlusElements() {
    if (this.prestationsVisibles.length >= this.prestationsFiltreres.length) {
      if (this.scrollSpy && this.observer) {
        this.observer.unobserve(this.scrollSpy.nativeElement);
      }
      return;
    }

    this.pageActuelle++;
    const fin = this.pageActuelle * this.itemsParPage;
    this.prestationsVisibles = this.prestationsFiltreres.slice(0, fin);
  }

  private extraireVillesDepart() {
    const villes = this.toutesLesPrestations
      .map(p => p.metadata?.lieu_depart)
      .filter(v => v !== undefined);
    this.villesDepart = [...new Set(villes)];
  }

  // 4. JEUX DE DONNÉES FICTIFS DE RECONSTITUTION
  private genererDonneesFictives() {
    const dataBase = [
      { id_prestation: 9, titre_service: 'Trek & Découverte : Le Nord Sauvage', description: 'Une aventure immersive de Diego-Suarez à Nosy Be, découvrez les Tsingy et la faune locale.', prix_base: 1200.0, metadata: { lieu_depart: 'Diego-Suarez', lieu_arrivee: 'Nosy Be' }},
      { id_prestation: 10, titre_service: "L'Allée des Baobabs et Majestueux Sud", description: 'Parcours photographique et solidaire à travers Morondava et les parcs nationaux du Sud.', prix_base: 1450.0, metadata: { lieu_depart: 'Morondava', lieu_arrivee: 'Sud-Madagascar' }}
    ];

    this.toutesLesPrestations = [...dataBase];
    const villesFictives = ['Antananarivo', 'Fianarantsoa', 'Majunga', 'Tamatave'];
    
    for (let i = 11; i <= 60; i++) {
      const departFictif = villesFictives[i % villesFictives.length];
      this.toutesLesPrestations.push({
        id_prestation: i,
        titre_service: `Circuit Découverte Expérience n°${i}`,
        description: `Une excursion unique et éco-responsable conçue par Honey Group. Exploration des paysages environnants, guide local francophone inclus et hébergement solidaire en pension complète.`,
        prix_base: Math.floor(Math.random() * (2500 - 400 + 1)) + 400,
        metadata: { lieu_depart: departFictif, lieu_arrivee: 'Destination Mystère' }
      });
    }
  }

  private genererSessionsFictives() {
    // On génère des sessions ouvertes pour les ID 9 et 10, et quelques-unes pour le reste
    this.toutesLesSessions = [
      { id_prestation: 9, date_debut: new Date('2026-07-15'), date_fin: new Date('2026-07-28'), capacite_max: 12, nb_inscrits: 4, statut_session: 'OUVERT' },
      { id_prestation: 9, date_debut: new Date('2026-08-10'), date_fin: new Date('2026-08-23'), capacite_max: 12, nb_inscrits: 12, statut_session: 'COMPLET' },
      { id_prestation: 10, date_debut: new Date('2026-09-01'), date_fin: new Date('2026-09-14'), capacite_max: 15, nb_inscrits: 10, statut_session: 'OUVERT' }
    ];

    // Génération automatique pour alimenter les autres circuits du catalogue
    for (let i = 11; i <= 60; i++) {
      if (i % 3 !== 0) { // On laisse quelques circuits vides volontairement pour tester l'état vide
        this.toutesLesSessions.push({
          id_prestation: i,
          date_debut: new Date('2026-07-20'),
          date_fin: new Date('2026-08-03'),
          capacite_max: 10,
          nb_inscrits: Math.floor(Math.random() * 10),
          statut_session: Math.random() > 0.2 ? 'OUVERT' : 'EN_COURS'
        });
      }
    }
  }
}