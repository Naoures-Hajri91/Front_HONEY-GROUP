import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { ProfileUpdatePayload, UserProfile } from '../models/user-profile';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/api/auth';
  private apiAuth = 'http://localhost:8080/api/users';

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
    return this.http.get<UserProfile>(`${this.apiAuth}/me`);
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
