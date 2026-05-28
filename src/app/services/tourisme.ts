import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TypePayment } from '../models/payment';
import { TypeReservation } from '../models/reservation';

// Les interfaces sont déclarées ici et exportées pour toute l'application
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

// Déclare l'interface du Payload (le DTO d'envoi) en dehors de la classe
export interface BookingRequest {
  userId?: number; // Optionnel car géré par Spring Security
  sessionId: number;
  nbPersonnes: number;
  typeReservation: TypeReservation;
}

@Injectable({
  providedIn: 'root',
})
export class TourismeService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api';

  getPrestations(): Observable<Prestation[]> {
    return this.http.get<Prestation[]>(`${this.apiUrl}/prestations`);
  }

  /** MATCHING JAVA : @GetMapping("/api/prestations/{id}") */
  getPrestationById(id: number): Observable<Prestation> {
    return this.http.get<Prestation>(`${this.apiUrl}/prestations/${id}`);
  }

  /** MATCHING JAVA : @GetMapping de ton SessionController (récupère toutes les sessions) */
  getSessions(): Observable<Session[]> {
    return this.http.get<Session[]>(`${this.apiUrl}/sessions`);
  }

  /** MATCHING JAVA : @GetMapping("/api/sessions/{id}") */
  getSessionById(id: number): Observable<Session> {
    return this.http.get<Session>(`${this.apiUrl}/sessions/${id}`);
  }

  creerReservation(bookingData: BookingRequest): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/bookings/reserve`, bookingData);
  }
}