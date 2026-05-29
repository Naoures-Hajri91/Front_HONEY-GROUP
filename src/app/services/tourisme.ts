import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TypePayment } from '../models/payment';
import { TypeReservation } from '../models/reservation';
import { Session } from '../models/session';
import { StatutSession } from '../models/session-statut';

// Réexporter Session et StatutSession pour compatibilité avec les imports depuis tourisme.ts
export type { Session };
export { StatutSession };

// Les interfaces sont déclarées ici et exportées pour toute l'application
export interface PrestationMetadata {
  id_metadata?: number;
  lieu_depart: string;
  lieu_arrivee: string;
}

export interface Prestation {
  id: number; // Mappé sur private Long id;
  titreService: string; // Mappé sur private String titreService;
  description: string; // Mappé sur private String description;
  prixBase: number; // Mappé sur private Double prixBase;
  metadata?: PrestationMetadata; // Mappé sur private Map<String, Object> metadata;
  imageUrl?: string; // URL de l'image de la prestation
  statut: string; // Mappé sur private StatutPrestation statut;
}

export interface BookingRequest {
  userId?: number;
  sessionId: number;
  nbPersonnes: number;
  typeReservation: TypeReservation;
}

@Injectable({
  providedIn: 'root',
})
export class TourismeService {
  private http = inject(HttpClient);
  private apiUrl = 'https://api.honeygroupitmada.com/api';

  getPrestations(): Observable<Prestation[]> {
    return this.http
      .get<Prestation[]>(`${this.apiUrl}/prestations`)
      .pipe(map((list) => list.map((p) => this.normaliserPrestation(p))));
  }

  getPrestationById(id: number): Observable<Prestation> {
    return this.http
      .get<Prestation>(`${this.apiUrl}/prestations/${id}`)
      .pipe(map((p) => this.normaliserPrestation(p)));
  }

  getPrestationsByPole(idPole: number): Observable<Prestation[]> {
    return this.http
      .get<Prestation[]>(`${this.apiUrl}/prestations/pole/${idPole}`)
      .pipe(map((list) => list.map((p) => this.normaliserPrestation(p))));
  }

  private normaliserPrestation(p: Prestation): Prestation {
    let metadata = p.metadata;
    if (typeof metadata === 'string') {
      try {
        metadata = JSON.parse(metadata);
      } catch {
        metadata = undefined;
      }
    }
    return { ...p, metadata };
  }

  /**
   * Récupère les sessions liées à une prestation spécifique
   * MATCHING JAVA : @GetMapping("/api/sessions/prestation/{idPrestation}")
   */
  getSessionsByPrestation(idPrestation: number): Observable<Session[]> {
    return this.http.get<any[]>(`${this.apiUrl}/sessions/prestation/${idPrestation}`)
      .pipe(
        map(sessions => sessions.map(session => this.normaliserSession(session)))
      );
  }

  getSessions(): Observable<Session[]> {
    return this.http.get<any[]>(`${this.apiUrl}/sessions`)
      .pipe(
        map(sessions => sessions.map(session => this.normaliserSession(session)))
      );
  }

  getSessionById(id: number): Observable<Session> {
    return this.http.get<any>(`${this.apiUrl}/sessions/${id}`)
      .pipe(
        map(session => this.normaliserSession(session))
      );
  }

  creerReservation(bookingData: BookingRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/bookings/reserve`, bookingData);
  }

  /**
   * Normalise une session reçue du backend en convertissant les types correctement
   * Mappe les noms de propriétés du backend vers le modèle Session
   * Prévient les problèmes de NaN et d'énumération incorrecte
   */
  private normaliserSession(sessionData: any): Session {
    // MAPPER les noms du backend vers le modèle Session
    // Backend envoie: participantsActuels, statut
    // Modèle attend: nbInscrits, statutSession

    const nbInscrits = 
      sessionData.participantsActuels !== undefined ? sessionData.participantsActuels :
      (sessionData.nbInscrits !== undefined ? sessionData.nbInscrits : 
      (sessionData.nb_inscrits !== undefined ? sessionData.nb_inscrits : 0));

    const statutSession = 
      sessionData.statut !== undefined ? sessionData.statut :
      (sessionData.statutSession !== undefined ? sessionData.statutSession : 
      (sessionData.statut_session !== undefined ? sessionData.statut_session : 'OUVERT'));

    const capaciteMax = 
      sessionData.capaciteMax !== undefined ? sessionData.capaciteMax : 
      (sessionData.capacite_max !== undefined ? sessionData.capacite_max : 0);

    // Convertir en nombres de manière sûre
    const nbInscritsParsed = parseInt(String(nbInscrits), 10);
    const capaciteMaxParsed = parseInt(String(capaciteMax), 10);

    // Extraire l'ID de prestation de manière exhaustive
    const prestationIdFound = sessionData.idPrestation || sessionData.prestationId || sessionData.prestation_id || sessionData.id_prestation || sessionData.prestation?.id;

    const sessionNormalisee: Session = {
      id: Number(sessionData.id),
      dateDebut: sessionData.dateDebut,
      dateFin: sessionData.dateFin,
      capaciteMax: isNaN(capaciteMaxParsed) ? 0 : capaciteMaxParsed,
      nbInscrits: isNaN(nbInscritsParsed) ? 0 : nbInscritsParsed,
      statutSession: String(statutSession).toUpperCase().trim(),
      prestationId: prestationIdFound,
      idPrestation: prestationIdFound
    };

    return sessionNormalisee;
  }
}