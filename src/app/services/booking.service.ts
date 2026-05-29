import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking } from '../models/booking';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/bookings';

  /**
   * VUE CLIENT : Récupère l'historique des réservations de l'utilisateur actuel
   */
  getMyBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/my-bookings`);
  }

  /**
   * VUE STAFF : Récupère l'historique des réservations d'un client spécifique
   */
  getDossierClientForStaff(userId: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/admin/user/${userId}`);
  }

  /**
   * VUE CLIENT : Soumet une demande d'annulation
   */
  demanderAnnulation(bookingId: number): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}/cancel-request/${bookingId}`, {});
  }

  /**
   * VUE STAFF : Approuve une annulation
   */
  approuverAnnulation(bookingId: number): Observable<string> {
    return this.http.patch<string>(`${this.apiUrl}/admin/approve-cancel/${bookingId}`, {});
  }
}
