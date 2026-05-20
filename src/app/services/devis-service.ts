import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DevisService {
  private apiUrl = 'http://localhost:8080/api/leads';

  constructor(private http: HttpClient) {}

  envoyerDevis(payload: any): Observable<any> {
    return this.http.post(this.apiUrl, payload);
  }

}
