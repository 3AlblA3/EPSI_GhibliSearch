import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, forkJoin, map, of, switchMap, throwError } from 'rxjs';
import type { Observable } from 'rxjs';
import type { Vehicle } from '../interfaces/vehicle';
import { SharedService } from './shared.service';

export interface VehicleRelatedLink {
  id: string;
  name: string;
  route: string[];
}

export interface VehicleDetailsData {
  vehicle: Vehicle;
  pilot: VehicleRelatedLink | null;
  films: VehicleRelatedLink[];
}

@Injectable({
  providedIn: 'root',
})
export class VehiclesService {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly sharedService = inject(SharedService);
  private readonly apiUrl = 'https://ghibliapi.dev/vehicles/';

  public loadVehicles(): Observable<Vehicle[]> {
    return this.httpClient
      .get<Vehicle[]>(this.apiUrl)
      .pipe(catchError((error) => this.handleError(error)));
  }

  public getVehicles(): Observable<Vehicle[]> {
    return this.loadVehicles();
  }

  public getVehicle(id: string): Observable<VehicleDetailsData> {
    return this.httpClient
      .get<Vehicle>(`${this.apiUrl}${id}`)
      .pipe(
        catchError((error) => this.handleError(error)),
        switchMap((vehicle) => {
          const pilotLink$ = vehicle.pilot
            ? (() => {
                return this.sharedService.getUrlName(vehicle.pilot).pipe(
                  map((resource) => (resource === null ? null : {
                    id: resource.id,
                    name: resource.name,
                    route: ['/people', resource.id],
                  })),
                );
              })()
            : of(null);

          const filmLinks$ = vehicle.films.length
            ? forkJoin(
                vehicle.films.map((url) => {
                  return this.sharedService.getUrlName(url).pipe(
                    map((resource) => (resource === null ? null : {
                      id: resource.id,
                      name: resource.name,
                      route: ['/movie', resource.id],
                    })),
                  );
                }),
              ).pipe(
                map((links) => links.filter((link): link is VehicleRelatedLink => link !== null)),
              )
            : of([] as VehicleRelatedLink[]);

          return forkJoin({
            vehicle: of(vehicle),
            pilot: pilotLink$,
            films: filmLinks$,
          });
        }),
      );
  }

  private handleError(error: unknown): Observable<never> {
    console.error('VehiclesService error:', error);
    return throwError(() => error);
  }
}