import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, forkJoin, map, of, switchMap, throwError } from 'rxjs';
import type { Observable } from 'rxjs';
import type { Location } from '../interfaces/location';
import { SharedService } from './shared.service';

export interface LocationRelatedLink {
  id: string;
  name: string;
  route: string[];
}

export interface LocationDetailsData {
  location: Location;
  residents: LocationRelatedLink[];
  films: LocationRelatedLink[];
}

@Injectable({
  providedIn: 'root',
})
export class LocationsService {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly sharedService = inject(SharedService);
  private readonly apiUrl = 'https://ghibliapi.dev/locations/';

  public loadLocations(): Observable<Location[]> {
    return this.httpClient
      .get<Location[]>(this.apiUrl)
      .pipe(catchError((error) => this.handleError(error)));
  }

  public getLocations(): Observable<Location[]> {
    return this.loadLocations();
  }

  public getLocation(id: string): Observable<LocationDetailsData> {
    return this.httpClient
      .get<Location>(`${this.apiUrl}${id}`)
      .pipe(
        catchError((error) => this.handleError(error)),
        // SwitchMap pour récupérer les noms des résidents et des films associés à la location
        switchMap((location) => {
          const residentLinks$ = location.residents.length
            ? forkJoin(
                location.residents.map((url) => {
                  return this.sharedService.getUrlName(url).pipe(
                    map((resource) => (resource === null ? null : {
                      id: resource.id,
                      name: resource.name,
                      route: ['/people', resource.id],
                    })),
                  );
                }),
              ).pipe(
                map((links) => links.filter((link): link is LocationRelatedLink => link !== null)),
              )
            : of([] as LocationRelatedLink[]);

          const filmLinks$ = location.films.length
            ? forkJoin(
                location.films.map((url) => {
                  return this.sharedService.getUrlName(url).pipe(
                    map((resource) => (resource === null ? null : {
                      id: resource.id,
                      name: resource.name,
                      route: ['/movie', resource.id],
                    })),
                  );
                }),
              ).pipe(
                map((links) => links.filter((link): link is LocationRelatedLink => link !== null)),
              )
            : of([] as LocationRelatedLink[]);

          return forkJoin({
            location: of(location),
            residents: residentLinks$,
            films: filmLinks$,
          });
        }),
      );
  }

  private handleError(error: unknown): Observable<never> {
    console.error('LocationsService error:', error);
    return throwError(() => error);
  }
}