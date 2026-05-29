import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StatutPayment } from '../models/role';

export interface Payment {
  id: number;
  bookingId: number;
  clientId: number;
  clientNom: string;
  clientPrenom: string;
  clientEmail: string;
  montantPaye: number; // Renommé de 'montant'
  methode?: string; // Renommé de 'typePayment'
  statutPaiement: StatutPayment; // Renommé de 'statut'
  datePaiement: string; // Renommé de 'dateCreation'
  dateValidation?: string;
  preuveUrl?: string; // Renommé de 'lienPreuve'
  transactionId?: string; // Renommé de 'idTransactionExterne'
  prestationTitre?: string;
  dateResa?: string;
  sessionDebut?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/payments';

  /**
   * Récupère tous les paiements (STAFF ONLY)
   */
  getAllPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.apiUrl);
  }

  /**
   * Récupère les paiements de l'utilisateur actuel
   */
  getMyPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/me`);
  }

  /**
   * Récupère la liste des paiements en attente de vérification (STAFF ONLY)
   */
  getPaymentsPendingVerification(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/pending-verification`);
  }

  /**
   * Récupère tous les paiements pour un utilisateur (STAFF ONLY)
   */
  getPaymentsByUser(userId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/user/${userId}`);
  }

  /**
   * Récupère les paiements liés à une réservation spécifique
   */
  getPaymentsByBooking(bookingId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/booking/${bookingId}`);
  }

  /**
   * Récupère les détails d'un paiement spécifique
   */
  getPaymentDetails(id: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/${id}`);
  }

  /**
   * Valide un paiement (STAFF ONLY)
   */
  validerPaiement(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/valider`, {});
  }

  /**
   * Rejette un paiement (STAFF ONLY)
   */
  rejeterPaiement(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/rejeter`, {});
  }

  /**
   * Récupère les paiements liés à une session (STAFF ONLY)
   */
  getPaymentsBySession(sessionId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/session/${sessionId}`);
  }
}
