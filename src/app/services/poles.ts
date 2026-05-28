import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { PoleDto } from '../utils/pole.util';

@Injectable({
  providedIn: 'root',
})
export class Poles {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/poles';
  private cache$?: Observable<PoleDto[]>;

  getAllPoles(): Observable<PoleDto[]> {
    if (!this.cache$) {
      this.cache$ = this.http.get<PoleDto[]>(this.apiUrl).pipe(shareReplay(1));
    }
    return this.cache$;
  }
}
