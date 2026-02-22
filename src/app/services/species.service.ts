import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, forkJoin, map, of, switchMap, throwError } from 'rxjs';
import type { Observable } from 'rxjs';
import type { Species } from '../interfaces/species';
import { SharedService } from './shared.service';

export interface SpeciesRelatedLink {
  id: string;
  name: string;
  route: string[];
}

export interface SpeciesDetailsData {
  species: Species;
  people: SpeciesRelatedLink[];
  films: SpeciesRelatedLink[];
}

@Injectable({
  providedIn: 'root',
})
export class SpeciesService {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly sharedService = inject(SharedService);
  private readonly apiUrl = 'https://ghibliapi.dev/species/';

  public loadSpecies(): Observable<Species[]> {
    return this.httpClient
      .get<Species[]>(this.apiUrl)
      .pipe(catchError((error) => this.handleError(error)));
  }

  public getSpecies(): Observable<Species[]> {
    return this.loadSpecies();
  }

  public getSpeciesById(id: string): Observable<SpeciesDetailsData> {
    return this.httpClient
      .get<Species>(`${this.apiUrl}${id}`)
      .pipe(
        catchError((error) => this.handleError(error)),
        switchMap((species) => {
          const peopleLinks$ = species.people.length
            ? forkJoin(
                species.people.map((url) => {
                  return this.sharedService.getUrlName(url).pipe(
                    map((resource) => (resource === null ? null : {
                      id: resource.id,
                      name: resource.name,
                      route: ['/people', resource.id],
                    })),
                  );
                }),
              ).pipe(
                map((links) => links.filter((link): link is SpeciesRelatedLink => link !== null)),
              )
            : of([] as SpeciesRelatedLink[]);

          const filmLinks$ = species.films.length
            ? forkJoin(
                species.films.map((url) => {
                  return this.sharedService.getUrlName(url).pipe(
                    map((resource) => (resource === null ? null : {
                      id: resource.id,
                      name: resource.name,
                      route: ['/movie', resource.id],
                    })),
                  );
                }),
              ).pipe(
                map((links) => links.filter((link): link is SpeciesRelatedLink => link !== null)),
              )
            : of([] as SpeciesRelatedLink[]);

          return forkJoin({
            species: of(species),
            people: peopleLinks$,
            films: filmLinks$,
          });
        }),
      );
  }

  private handleError(error: unknown): Observable<never> {
    console.error('SpeciesService error:', error);
    return throwError(() => error);
  }
}