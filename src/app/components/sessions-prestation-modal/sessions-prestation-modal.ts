import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TourismeService, Prestation } from '../../services/tourisme';
import { Session } from '../../models/session';

@Component({
  selector: 'app-sessions-prestation-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './sessions-prestation-modal.html',
})
export class SessionsPrestationModal implements OnChanges {
  private tourismeService = inject(TourismeService);
  private cd = inject(ChangeDetectorRef);

  @Input() ouverte = false;
  @Input() prestation: Prestation | null = null;
  @Output() fermer = new EventEmitter<void>();

  Math = Math;

  toutesLesSessions: Session[] = [];
  sessionsFiltrees: Session[] = [];
  chargementSessions = false;
  erreurSessions = false;

  filtreStatut = '';
  filtrePlaces = 0;
  filtreDateDebut = '';
  pageSession = 1;
  itemsParPageSession = 5;

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.ouverte) {
      if (changes['ouverte']) {
        this.reinitialiserSessions();
        this.cd.markForCheck();
      }
      return;
    }

    if (changes['ouverte'] || changes['prestation']) {
      this.chargerSessionsSiPossible();
    }
  }

  chargerSessionsSiPossible(): void {
    const id = this.prestation?.id;
    if (!this.ouverte || id == null) {
      return;
    }

    this.chargementSessions = true;
    this.erreurSessions = false;
    this.cd.markForCheck();

    this.tourismeService.getSessionsByPrestation(id).subscribe({
      next: (sessions) => {
        this.toutesLesSessions = sessions ?? [];
        this.sessionsFiltrees = [...this.toutesLesSessions];
        this.pageSession = 1;
        this.filtreStatut = '';
        this.filtrePlaces = 0;
        this.filtreDateDebut = '';
        this.chargementSessions = false;
        this.cd.markForCheck();
      },
      error: (err) => {
        console.error('Erreur récupération sessions:', err);
        this.erreurSessions = true;
        this.chargementSessions = false;
        this.cd.markForCheck();
      },
    });
  }

  appliquerFiltresSession(): void {
    this.sessionsFiltrees = this.toutesLesSessions.filter((s) => {
      const statutSession = String(s.statutSession ?? '').toUpperCase();
      const matchStatut = this.filtreStatut === '' || statutSession === this.filtreStatut;

      const nbInscrits = Number(s.nbInscrits) || 0;
      const capaciteMax = Number(s.capaciteMax) || 0;
      const placesRestantes = capaciteMax - nbInscrits;

      const matchPlaces = placesRestantes >= this.filtrePlaces;
      const matchDate =
        this.filtreDateDebut === '' ||
        new Date(s.dateDebut).toISOString().split('T')[0] >= this.filtreDateDebut;

      return matchStatut && matchPlaces && matchDate;
    });
    this.pageSession = 1;
  }

  get sessionsPaginees(): Session[] {
    const start = (this.pageSession - 1) * this.itemsParPageSession;
    return this.sessionsFiltrees.slice(start, start + this.itemsParPageSession);
  }

  placesRestantes(session: Session): number {
    const capacite = Number(session.capaciteMax) || 0;
    const inscrits = Number(session.nbInscrits) || 0;
    return Math.max(0, capacite - inscrits);
  }

  pourcentageRemplissage(session: Session): number {
    const capacite = Number(session.capaciteMax) || 0;
    if (capacite <= 0) {
      return 0;
    }
    const inscrits = Number(session.nbInscrits) || 0;
    return Math.min(100, Math.round((inscrits / capacite) * 100));
  }

  statutNormalise(session: Session): string {
    return String(session.statutSession ?? '').toUpperCase();
  }

  sessionReservable(session: Session): boolean {
    return this.statutNormalise(session) === 'OUVERT';
  }

  fermerModal(): void {
    this.fermer.emit();
  }

  private reinitialiserSessions(): void {
    this.toutesLesSessions = [];
    this.sessionsFiltrees = [];
    this.pageSession = 1;
    this.chargementSessions = false;
    this.erreurSessions = false;
  }
}
