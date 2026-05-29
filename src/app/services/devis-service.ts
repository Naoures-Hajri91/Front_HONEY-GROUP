import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DevisService {
  private apiUrl = 'https://api.honeygroupitmada.com/api/leads';

  constructor(private http: HttpClient) {}

  envoyerDevis(payload: any): Observable<any> {
    return this.http.post(this.apiUrl, payload);
  }

}
