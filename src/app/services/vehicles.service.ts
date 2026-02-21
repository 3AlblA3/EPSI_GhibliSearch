import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import type { Observable } from 'rxjs';
import type { Vehicle } from '../interfaces/vehicle';

@Injectable({
  providedIn: 'root',
})
export class VehiclesService {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly apiUrl = 'https://ghibliapi.dev/vehicles/';

  public loadVehicles(): Observable<Vehicle[]> {
    return this.httpClient
      .get<Vehicle[]>(this.apiUrl)
      .pipe(catchError((error) => this.handleError(error)));
  }

  public getVehicles(): Observable<Vehicle[]> {
    return this.loadVehicles();
  }

  public getVehicle(id: string): Observable<Vehicle> {
    return this.httpClient
      .get<Vehicle>(`${this.apiUrl}${id}`)
      .pipe(catchError((error) => this.handleError(error)));
  }

  private handleError(error: unknown): Observable<never> {
    console.error('VehiclesService error:', error);
    return throwError(() => error);
  }
}