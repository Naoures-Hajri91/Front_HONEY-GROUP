import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TourismeService, Prestation, Session } from '../../services/tourisme';

@Component({
  selector: 'app-tourisme-catalogue',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tourisme-catalogue.html',
  styleUrl: './tourisme-catalogue.css',
})
export class TourismeCatalogue implements OnInit, AfterViewInit {

  // Injection moderne du service écotourisme
  private tourismeService = inject(TourismeService);

  @ViewChild('scrollSpy') scrollSpy!: ElementRef;

  // Données globales issues de la BDD Honey Group
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

  // Pagination / Infinite Scroll
  itemsParPage: number = 6;
  pageActuelle: number = 1;
  private observer!: IntersectionObserver;


  ngOnInit(): void {
    this.chargerDonneesDepuisServeur();
  }

  ngAfterViewInit() {
    this.configurerInfiniteScroll();
  }

  /**
   * Consomme simultanément les requêtes HTTP de ton backend Spring Boot
   */
  chargerDonneesDepuisServeur(): void {
    // 1. Récupération des sessions (pour alimenter les pop-ups de réservation du catalogue)
    this.tourismeService.getSessions().subscribe({
      next: (sessions: Session[]) => {
        this.toutesLesSessions = sessions;
        
        // 2. Une fois les sessions prêtes, on récupère le catalogue de prestations
        this.tourismeService.getPrestations().subscribe({
          next: (prestations: Prestation[]) => {
            this.toutesLesPrestations = prestations;
            this.initialiserCatalogue();
          },
          error: (err) => console.error('Erreur lors du chargement des prestations', err)
        });
      },
      error: (err) => console.error('Erreur lors du chargement des sessions', err)
    });
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
