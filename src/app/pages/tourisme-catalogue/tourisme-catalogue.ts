import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { TourismeService, Prestation } from '../../services/tourisme';
import { Session } from '../../models/session';
import { StatutSession } from '../../models/session-statut';
import { Poles } from '../../services/poles';

@Component({
  selector: 'app-tourisme-catalogue',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tourisme-catalogue.html',
  styleUrl: './tourisme-catalogue.css',
})
export class TourismeCatalogue implements OnInit, AfterViewInit {

  private tourismeService = inject(TourismeService);
  private poleService = inject(Poles);
  private platformId = inject(PLATFORM_ID);

  // Exposer Math pour les templates
  Math = Math;

  @ViewChild('scrollSpy') scrollSpy!: ElementRef;

  // Catalogue
  toutesLesPrestations: Prestation[] = [];
  prestationsFiltreres: Prestation[] = [];
  prestationsVisibles: Prestation[] = [];
  villesDepart: string[] = [];
  
  // Modale Sessions
  modalOuverte: boolean = false;
  prestationSelectionnee: Prestation | null = null;
  toutesLesSessions: Session[] = []; 
  sessionsFiltrees: Session[] = [];
  
  // Énumération pour les filtres
  statutSessionEnum = StatutSession;
  
  // Filtres Sessions
  filtreStatut: string = '';
  filtrePlaces: number = 0;
  filtreDateDebut: string = '';
  
  // Pagination Sessions
  pageSession: number = 1;
  itemsParPageSession: number = 5;

  // Filtres Catalogue
  rechercheTexte: string = '';
  maxPrix: number = 3000;
  villeSelectionnee: string = '';

  itemsParPage: number = 6;
  pageActuelle: number = 1;
  private observer!: IntersectionObserver;

  ngOnInit(): void {
    this.chargerDonneesDynamiques();
  }

  ngAfterViewInit() {
    // IntersectionObserver n'existe que côté client, pas en SSR
    if (isPlatformBrowser(this.platformId)) {
      this.configurerInfiniteScroll();
    }
  }

  // --- LOGIQUE CATALOGUE ---

  chargerDonneesDynamiques(): void {
    this.poleService.getAllPoles().subscribe({
      next: (poles: any[]) => {
        const pôleTourisme = poles.find(p => {
          const nom = p.nom || p.nom_pole || "";
          return nom.toLowerCase().includes('eco') || nom.toLowerCase().includes('tourisme');
        });
        if (pôleTourisme) {
          this.chargerDonneesParPole(pôleTourisme.id || pôleTourisme.id_pole);
        }
      },
      error: (err) => console.error("Erreur pôles", err)
    });
  }

  chargerDonneesParPole(idPole: number): void {
    this.tourismeService.getPrestationsByPole(idPole).subscribe({
      next: (prestations) => {
        this.toutesLesPrestations = prestations;
        this.initialiserCatalogue();
      }
    });
  }

  initialiserCatalogue(): void {
    this.extraireVillesDepart();
    this.filtrerPrestations();
  }

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
  }

  // --- LOGIQUE SESSIONS (MODALE) ---

  ouvrirSessions(prestation: Prestation) {
    this.prestationSelectionnee = prestation;
    this.tourismeService.getSessionsByPrestation(prestation.id).subscribe({
      next: (sessions: Session[]) => {
        console.log('📋 Sessions reçues pour prestation', prestation.id, ':', sessions);
        this.toutesLesSessions = sessions;
        this.sessionsFiltrees = [...sessions];
        this.pageSession = 1;
        this.modalOuverte = true;
      },
      error: (err) => {
        console.error('❌ Erreur récupération sessions:', err);
      }
    });
  }

  fermerSessions() {
    this.modalOuverte = false;
    this.prestationSelectionnee = null;
    this.toutesLesSessions = [];
    this.sessionsFiltrees = [];
  }

  appliquerFiltresSession() {
    this.sessionsFiltrees = this.toutesLesSessions.filter(s => {
      // Normaliser le statut pour la comparaison
      const statutSession = String(s.statutSession).toUpperCase();
      const matchStatut = this.filtreStatut === '' || statutSession === this.filtreStatut;
      
      // Calculer les places restantes en nombres entiers
      const nbInscrits = Number(s.nbInscrits) || 0;
      const capaciteMax = Number(s.capaciteMax) || 0;
      const placesRestantes = capaciteMax - nbInscrits;
      
      const matchPlaces = placesRestantes >= this.filtrePlaces;
      const matchDate = this.filtreDateDebut === '' || 
                        new Date(s.dateDebut).toISOString().split('T')[0] >= this.filtreDateDebut;
      return matchStatut && matchPlaces && matchDate;
    });
    this.pageSession = 1;
  }

  /**
   * Calcul sécurisé des places restantes
   */
  getPlacesRestantes(session: Session): number {
    const capacite = Number(session.capaciteMax) || 0;
    const inscrits = Number(session.nbInscrits) || 0;
    return Math.max(0, capacite - inscrits);
  }

  /**
   * Calcul du pourcentage de remplissage
   */
  getPourcentageRemplissage(session: Session): number {
    const capacite = Number(session.capaciteMax) || 0;
    const inscrits = Number(session.nbInscrits) || 0;
    if (capacite === 0) return 0;
    return (inscrits / capacite) * 100;
  }

  get sessionsPaginees(): Session[] {
    const start = (this.pageSession - 1) * this.itemsParPageSession;
    return this.sessionsFiltrees.slice(start, start + this.itemsParPageSession);
  }

  // --- UTILS ---

  onRecherche(event: any) { this.rechercheTexte = event.target.value; this.filtrerPrestations(); }
  onChangementDepart(event: any) { this.villeSelectionnee = event.target.value; this.filtrerPrestations(); }
  reinitialiserFiltres() { this.rechercheTexte = ''; this.maxPrix = 3000; this.villeSelectionnee = ''; this.filtrerPrestations(); }

  configurerInfiniteScroll() {
    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && this.prestationsVisibles.length < this.prestationsFiltreres.length) {
        this.chargerPlusElements();
      }
    }, { threshold: 0.1 });
    if (this.scrollSpy) this.observer.observe(this.scrollSpy.nativeElement);
  }

  chargerPlusElements() {
    this.pageActuelle++;
    this.prestationsVisibles = this.prestationsFiltreres.slice(0, this.pageActuelle * this.itemsParPage);
  }

  private extraireVillesDepart() {
    this.villesDepart = [...new Set(this.toutesLesPrestations.map(p => p.metadata?.lieu_depart).filter((v): v is string => !!v))];
  }
}