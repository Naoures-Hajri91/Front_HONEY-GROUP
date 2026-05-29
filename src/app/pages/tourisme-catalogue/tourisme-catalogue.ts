import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  inject,
  PLATFORM_ID,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TourismeService, Prestation } from '../../services/tourisme';
import { Poles } from '../../services/poles';
import { getTourismePoleId } from '../../utils/pole.util';
import { SessionsPrestationModal } from '../../components/sessions-prestation-modal/sessions-prestation-modal';

@Component({
  selector: 'app-tourisme-catalogue',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SessionsPrestationModal],
  templateUrl: './tourisme-catalogue.html',
  styleUrl: './tourisme-catalogue.css',
})
export class TourismeCatalogue implements OnInit, AfterViewInit {
  private tourismeService = inject(TourismeService);
  private poleService = inject(Poles);
  private platformId = inject(PLATFORM_ID);
  private cd = inject(ChangeDetectorRef);

  cataloguePret = false;
  erreurChargement = false;

  Math = Math;

  @ViewChild('scrollSpy') scrollSpy!: ElementRef;

  toutesLesPrestations: Prestation[] = [];
  prestationsFiltreres: Prestation[] = [];
  prestationsVisibles: Prestation[] = [];
  villesDepart: string[] = [];

  modalOuverte = false;
  prestationSelectionnee: Prestation | null = null;

  rechercheTexte = '';
  maxPrix = 3000;
  villeSelectionnee = '';

  itemsParPage = 6;
  pageActuelle = 1;
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.chargerDonneesDynamiques();
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.configurerInfiniteScroll();
    }
  }

  chargerDonneesDynamiques(): void {
    this.cataloguePret = false;
    this.erreurChargement = false;

    this.poleService.getAllPoles().subscribe({
      next: (poles) => {
        const idPole = getTourismePoleId(poles);
        if (idPole != null) {
          this.chargerDonneesParPole(idPole);
        } else {
          console.error('Pôle écotourisme introuvable');
          this.erreurChargement = true;
          this.finaliserChargement();
        }
      },
      error: (err) => {
        console.error('Erreur pôles', err);
        this.erreurChargement = true;
        this.finaliserChargement();
      },
    });
  }

  chargerDonneesParPole(idPole: number): void {
    this.tourismeService.getPrestationsByPole(idPole).subscribe({
      next: (prestations) => {
        this.toutesLesPrestations = prestations;
        this.initialiserCatalogue();
      },
      error: (err) => {
        console.error('Erreur prestations catalogue', err);
        this.erreurChargement = true;
        this.finaliserChargement();
      },
    });
  }

  initialiserCatalogue(): void {
    this.extraireVillesDepart();
    this.filtrerPrestations();
    this.finaliserChargement();
    this.attacherInfiniteScroll();
  }

  private finaliserChargement(): void {
    this.cataloguePret = true;
    this.cd.detectChanges();
  }

  filtrerPrestations(): void {
    this.prestationsFiltreres = this.toutesLesPrestations.filter((p) => {
      const matchTexte =
        p.titreService.toLowerCase().includes(this.rechercheTexte.toLowerCase()) ||
        p.description.toLowerCase().includes(this.rechercheTexte.toLowerCase());
      const matchPrix = p.prixBase <= this.maxPrix;
      const matchVille =
        this.villeSelectionnee === '' || p.metadata?.lieu_depart === this.villeSelectionnee;
      return matchTexte && matchPrix && matchVille;
    });
    this.pageActuelle = 1;
    this.prestationsVisibles = this.prestationsFiltreres.slice(0, this.itemsParPage);
  }

  ouvrirSessions(prestation: Prestation): void {
    this.prestationSelectionnee = prestation;
    this.modalOuverte = true;
  }

  fermerSessions(): void {
    this.modalOuverte = false;
    this.prestationSelectionnee = null;
  }

  onRecherche(event: Event): void {
    this.rechercheTexte = (event.target as HTMLInputElement).value;
    this.filtrerPrestations();
  }

  onChangementDepart(event: Event): void {
    this.villeSelectionnee = (event.target as HTMLSelectElement).value;
    this.filtrerPrestations();
  }

  reinitialiserFiltres(): void {
    this.rechercheTexte = '';
    this.maxPrix = 3000;
    this.villeSelectionnee = '';
    this.filtrerPrestations();
  }

  private configurerInfiniteScroll(): void {
    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && this.prestationsVisibles.length < this.prestationsFiltreres.length) {
        this.chargerPlusElements();
      }
    }, { threshold: 0.1 });
    this.attacherInfiniteScroll();
  }

  private attacherInfiniteScroll(): void {
    if (this.observer && this.scrollSpy?.nativeElement) {
      this.observer.observe(this.scrollSpy.nativeElement);
    }
  }

  chargerPlusElements(): void {
    this.pageActuelle++;
    this.prestationsVisibles = this.prestationsFiltreres.slice(0, this.pageActuelle * this.itemsParPage);
    this.cd.detectChanges();
  }

  private extraireVillesDepart(): void {
    this.villesDepart = [
      ...new Set(
        this.toutesLesPrestations
          .map((p) => p.metadata?.lieu_depart)
          .filter((v): v is string => !!v),
      ),
    ];
  }
}
