import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Poles {
  private apiUrl = 'https://api.honeygroupitmada.com/api/poles';

  constructor(private http: HttpClient) {}

  // GET ALL POLES
  getAllPoles(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

}
