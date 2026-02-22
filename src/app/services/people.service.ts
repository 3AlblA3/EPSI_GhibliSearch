import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, forkJoin, map, of, switchMap, throwError } from 'rxjs';
import type { Observable } from 'rxjs';
import type { Person } from '../interfaces/person';
import { SharedService } from './shared.service';

export interface PersonRelatedLink {
  id: string;
  name: string;
  route: string[];
}

export interface PersonDetailsData {
  person: Person;
  species: PersonRelatedLink | null;
  films: PersonRelatedLink[];
}

@Injectable({
  providedIn: 'root',
})
export class PeopleService {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly sharedService = inject(SharedService);
  private readonly apiUrl = 'https://ghibliapi.dev/people/';

  public loadPeople(): Observable<Person[]> {
    return this.httpClient
      .get<Person[]>(this.apiUrl)
      .pipe(catchError((error) => this.handleError(error)));
  }

  public getPeople(): Observable<Person[]> {
    return this.loadPeople();
  }

  public getPerson(id: string): Observable<PersonDetailsData> {
    return this.httpClient
      .get<Person>(`${this.apiUrl}${id}`)
      .pipe(
        catchError((error) => this.handleError(error)),
        switchMap((person) => {
          const speciesLink$ = person.species
            ? (() => {
                return this.sharedService.getUrlName(person.species).pipe(
                  map((resource) => (resource === null ? null : {
                    id: resource.id,
                    name: resource.name,
                    route: ['/species', resource.id],
                  })),
                );
              })()
            : of(null);

          const filmLinks$ = person.films.length
            ? forkJoin(
                person.films.map((url) => {
                  return this.sharedService.getUrlName(url).pipe(
                    map((resource) => (resource === null ? null : {
                      id: resource.id,
                      name: resource.name,
                      route: ['/movie', resource.id],
                    })),
                  );
                }),
              ).pipe(
                map((links) => links.filter((link): link is PersonRelatedLink => link !== null)),
              )
            : of([] as PersonRelatedLink[]);

          return forkJoin({
            person: of(person),
            species: speciesLink$,
            films: filmLinks$,
          });
        }),
      );
  }

  private handleError(error: unknown): Observable<never> {
    console.error('PeopleService error:', error);
    return throwError(() => error);
  }
}