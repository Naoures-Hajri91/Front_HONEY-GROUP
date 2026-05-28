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

  getMyBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/my-bookings`);
  }
}
