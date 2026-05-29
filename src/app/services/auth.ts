import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import { Role } from '../models/role'; // Assurez-vous que Role est importé si ce n'est pas déjà fait
import { ProfileUpdatePayload, UserProfile } from '../models/user-profile';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/api/auth';
  private apiAuth = 'http://localhost:8080/api/users';

  // Signal pour accéder au profil n'importe où sans refaire d'appel HTTP
  currentUser = signal<UserProfile | null>(null);

  register(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');

    return this.http.post<any>(`${this.apiUrl}/refresh`, {
      refreshToken
    });
  }

  // ✅ CURRENT USER
  getCurrentUser(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiAuth}/me`).pipe(
      tap(user => this.currentUser.set(user))
    );
  }

  /**
   * Récupère tous les utilisateurs pour le personnel (ADMIN/MANAGER).
   * Nécessite un endpoint backend protégé, par exemple /api/users/all.
   */
  getAllUsersForStaff(): Observable<UserProfile[]> {
    return this.http.get<UserProfile[]>(`${this.apiAuth}/clients`);
  }

  updateProfile(payload: ProfileUpdatePayload): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiAuth}/me/profile`, payload);
  }

  forgotPassword(email: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/forgot-password`, { email });
  }

  isAuthenticated(): boolean {

    if (typeof window !== 'undefined') {

      return !!localStorage.getItem('accessToken');

    }

    return false;
  }

  // ✅ GET ACCESS TOKEN
  getAccessToken(): string | null {

    if (typeof window !== 'undefined') {

      return localStorage.getItem('accessToken');

    }

    return null;
  }

  // ✅ LOGOUT
  logout(): void {

    if (typeof window !== 'undefined') {

      localStorage.removeItem('accessToken');

      localStorage.removeItem('refreshToken');

    }
  }
}
