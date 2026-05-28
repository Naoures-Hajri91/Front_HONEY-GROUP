import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

export interface PrestationMetadata {
  id_metadata?: number; // Clé spécifique à ton convertisseur ou ta table metadata si existante
  lieu_depart: string;
  lieu_arrivee: string;
}

export interface Prestation {
  id: number; // Mappé sur private Long id;
  titreService: string; // Mappé sur private String titreService;
  description: string; // Mappé sur private String description;
  prixBase: number; // Mappé sur private Double prixBase;
  metadata?: PrestationMetadata; // Mappé sur private Map<String, Object> metadata;
  statut: string; // Mappé sur private StatutPrestation statut;
}

export interface Session {
  id: number; // Mappé sur private Long id;
  dateDebut: Date | string; // Mappé sur private LocalDateTime dateDebut;
  dateFin: Date | string; // Mappé sur private LocalDateTime dateFin;
  capaciteMax: number; // Mappé sur private Integer capaciteMax;
  nbInscrits: number; // Mappé sur private Integer nbInscrits;
  statutSession: 'OUVERT' | 'COMPLET' | 'EN_COURS' | 'CLOTURE' | 'ANNULE'; // Mappé sur private StatutSession statutSession;
  idPrestation: number; // Clé ou ID de l'objet Prestation associé lors de la sérialisation REST
}

@Component({
  selector: 'app-tourisme-catalogue',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tourisme-catalogue.html',
  styleUrl: './tourisme-catalogue.css',
})
export class TourismeCatalogue implements OnInit, AfterViewInit {

  @ViewChild('scrollSpy') scrollSpy!: ElementRef;

  // Données globales issues de la BDD
  toutesLesPrestations: Prestation[] = [];
  toutesLesSessions: Session[] = []; 
  villesDepart: string[] = [];

  // Gestion de la modale
  modalOuverte: boolean = false;
  adorationPrestationSelectionnee: Prestation | null = null;

  // Tableaux de filtrage
  prestationsFiltreres: Prestation[] = [];
  prestationsVisibles: Prestation[] = [];

  // Filtres
  rechercheTexte: string = '';
  maxPrix: number = 3000;
  villeSelectionnee: string = '';

  // Pagination
  itemsParPage: number = 6;
  pageActuelle: number = 1;
  private observer!: IntersectionObserver;

  constructor() {}

  ngOnInit(): void {
    this.chargerDonneesDepuisServeur();
  }

  ngAfterViewInit() {
    this.configurerInfiniteScroll();
  }

  /**
   * Méthode à interconnecter avec ton service API (ex: `this.tourismeService.getPrestations().subscribe(...)`)
   */
  chargerDonneesDepuisServeur(): void {
    // TODO: Alimenter ces tableaux via des appels API de ton service HTTP depuis Spring Boot
    // Exemples :
    // this.tourismeService.getPrestationsActives().subscribe(data => { this.toutesLesPrestations = data; });
    // this.tourismeService.getSessionsActives().subscribe(data => { this.toutesLesSessions = data; });
    
    this.initialiserCatalogue();
  }

  initialiserCatalogue(): void {
    this.extraireVillesDepart();
    this.filtrerPrestations();
  }

  // 1. LOGIQUE DE LA MODALE POP-UP
  ouvrirSessions(prestation: Prestation) {
    this.adorationPrestationSelectionnee = prestation;
    this.modalOuverte = true;
  }

  fermerSessions() {
    this.modalOuverte = false;
    this.adorationPrestationSelectionnee = null;
  }

  filtrerSessionsParPrestation(idPrestation: number): Session[] {
    return this.toutesLesSessions.filter(s => s.idPrestation === idPrestation);
  }

  // 2. FILTRES DE RECHERCHE CATALOGUE
  filtrerPrestations() {
    this.prestationsFiltreres = this.toutesLesPrestations.filter(p => {
      const matchTexte = p.titreService.toLowerCase().includes(this.rechercheTexte.toLowerCase()) || 
                         p.description.toLowerCase().includes(this.rechercheTexte.toLowerCase());
      const matchPrix = p.prixBase <= this.maxPrix;
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
      .filter((v): v is string => v !== undefined && v !== null);
    this.villesDepart = [...new Set(villes)];
  }
}
