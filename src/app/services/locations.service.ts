import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import type { Observable } from 'rxjs';
import type { Location } from '../interfaces/location';

@Injectable({
  providedIn: 'root',
})
export class LocationsService {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly apiUrl = 'https://ghibliapi.dev/locations/';

  public loadLocations(): Observable<Location[]> {
    return this.httpClient
      .get<Location[]>(this.apiUrl)
      .pipe(catchError((error) => this.handleError(error)));
  }

  public getLocations(): Observable<Location[]> {
    return this.loadLocations();
  }

  public getLocation(id: string): Observable<Location> {
    return this.httpClient
      .get<Location>(`${this.apiUrl}${id}`)
      .pipe(catchError((error) => this.handleError(error)));
  }

  private handleError(error: unknown): Observable<never> {
    console.error('LocationsService error:', error);
    return throwError(() => error);
  }
}