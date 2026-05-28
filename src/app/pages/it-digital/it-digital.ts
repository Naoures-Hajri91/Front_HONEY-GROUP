import { Component, OnInit, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TourismeService, Prestation } from '../../services/tourisme';
import { Poles } from '../../services/poles';
import { getItPoleId } from '../../utils/pole.util';

@Component({
  selector: 'app-it-digital',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './it-digital.html',
  styleUrl: './it-digital.css',
})
export class ItDigital implements OnInit {
  private tourismeService = inject(TourismeService);
  private poleService = inject(Poles);
  private platformId = inject(PLATFORM_ID);
  private cd = inject(ChangeDetectorRef);

  prestations: Prestation[] = [];
  prestationsFiltrees: Prestation[] = [];
  chargement = false;
  erreurChargement = false;
  rechercheTexte = '';

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.chargerPrestationsIt();
    }
  }

  chargerPrestationsIt(): void {
    this.chargement = true;
    this.erreurChargement = false;

    this.poleService.getAllPoles().subscribe({
      next: (poles) => {
        const idPole = getItPoleId(poles);
        if (idPole == null) {
          this.erreurChargement = true;
          this.chargement = false;
          this.cd.detectChanges();
          return;
        }

        this.tourismeService.getPrestationsByPole(idPole).subscribe({
          next: (list) => {
            this.prestations = list;
            this.appliquerFiltre();
            this.chargement = false;
            this.cd.detectChanges();
          },
          error: () => {
            this.erreurChargement = true;
            this.chargement = false;
            this.cd.detectChanges();
          },
        });
      },
      error: () => {
        this.erreurChargement = true;
        this.chargement = false;
        this.cd.detectChanges();
      },
    });
  }

  appliquerFiltre(): void {
    const q = this.rechercheTexte.trim().toLowerCase();
    this.prestationsFiltrees = this.prestations.filter(
      (p) =>
        !q ||
        p.titreService.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    );
  }

  onRecherche(event: Event): void {
    this.rechercheTexte = (event.target as HTMLInputElement).value;
    this.appliquerFiltre();
  }

  /** IT = prestations sur-mesure : pas de sessions, devis uniquement. */
  lienDevis(prestation: Prestation): string[] {
    return ['/devis', 'it-digital'];
  }

  queryDevis(prestation: Prestation): { prestationId: number; prestation: string } {
    return { prestationId: prestation.id, prestation: prestation.titreService };
  }
}
