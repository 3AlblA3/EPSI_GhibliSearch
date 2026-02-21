import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import type { Observable } from 'rxjs';
import type { Species } from '../interfaces/species';

@Injectable({
  providedIn: 'root',
})
export class SpeciesService {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly apiUrl = 'https://ghibliapi.dev/species/';

  public loadSpecies(): Observable<Species[]> {
    return this.httpClient
      .get<Species[]>(this.apiUrl)
      .pipe(catchError((error) => this.handleError(error)));
  }

  public getSpecies(): Observable<Species[]> {
    return this.loadSpecies();
  }

  public getSpeciesById(id: string): Observable<Species> {
    return this.httpClient
      .get<Species>(`${this.apiUrl}${id}`)
      .pipe(catchError((error) => this.handleError(error)));
  }

  private handleError(error: unknown): Observable<never> {
    console.error('SpeciesService error:', error);
    return throwError(() => error);
  }
}