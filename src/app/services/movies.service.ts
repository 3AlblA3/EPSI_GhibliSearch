import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, forkJoin, map, of, switchMap, throwError } from 'rxjs';
import type { Observable } from 'rxjs';
import type { Movie } from '../interfaces/movie';
import { SharedService } from './shared.service';

export interface MovieRelatedLink {
  id: string;
  name: string;
  route: string[];
}

export interface MovieDetailsData {
  movie: Movie;
  people: MovieRelatedLink[];
  species: MovieRelatedLink[];
  locations: MovieRelatedLink[];
  vehicles: MovieRelatedLink[];
}

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  public httpClient: HttpClient = inject(HttpClient);
  private readonly sharedService = inject(SharedService);
  private apiUrl = 'https://ghibliapi.dev/films/';

  // Charger les films depuis l'API
  public loadMovies(): Observable<Movie[]> {
    return this.httpClient
      .get<Movie[]>(this.apiUrl)
      .pipe(catchError((error) => this.handleError(error)));
  }

  // Récupérer les films
  public getMovies(): Observable<Movie[]> {
    return this.loadMovies();
  }

  // Récupérer un film par son id
  public getMovie(id: string): Observable<MovieDetailsData> {
    return this.httpClient
      .get<Movie>(`${this.apiUrl}${id}`)
      .pipe(
        catchError((error) => this.handleError(error)),
        // SwitchMap pour récupérer les liens associés (people, species, locations, vehicles) pour le film
        switchMap((movie) => {
          const peopleLinks$ = movie.people.length
          // forkJoin pour récupérer les noms des personnes associées au film
            ? forkJoin(
                movie.people.map((url) => {
                  return this.sharedService.getUrlName(url).pipe(
                    map((resource) => (resource === null ? null : {
                      id: resource.id,
                      name: resource.name,
                      route: ['/people', resource.id],
                    })),
                  );
                }),
              ).pipe(
                map((links) => links.filter((link): link is MovieRelatedLink => link !== null)),
              )
            : of([] as MovieRelatedLink[]);

          const speciesLinks$ = movie.species.length
            ? forkJoin(
                movie.species.map((url) => {
                  return this.sharedService.getUrlName(url).pipe(
                    map((resource) => (resource === null ? null : {
                      id: resource.id,
                      name: resource.name,
                      route: ['/species', resource.id],
                    })),
                  );
                }),
              ).pipe(
                map((links) => links.filter((link): link is MovieRelatedLink => link !== null)),
              )
            : of([] as MovieRelatedLink[]);

          const locationLinks$ = movie.locations.length
            ? forkJoin(
                movie.locations.map((url) => {
                  return this.sharedService.getUrlName(url).pipe(
                    map((resource) => (resource === null ? null : {
                      id: resource.id,
                      name: resource.name,
                      route: ['/locations', resource.id],
                    })),
                  );
                }),
              ).pipe(
                map((links) => links.filter((link): link is MovieRelatedLink => link !== null)),
              )
            : of([] as MovieRelatedLink[]);

          const vehicleLinks$ = movie.vehicles.length
            ? forkJoin(
                movie.vehicles.map((url) => {
                  return this.sharedService.getUrlName(url).pipe(
                    map((resource) => (resource === null ? null : {
                      id: resource.id,
                      name: resource.name,
                      route: ['/vehicles', resource.id],
                    })),
                  );
                }),
              ).pipe(
                map((links) => links.filter((link): link is MovieRelatedLink => link !== null)),
              )
            : of([] as MovieRelatedLink[]);

          return forkJoin({
            movie: of(movie),
            people: peopleLinks$,
            species: speciesLinks$,
            locations: locationLinks$,
            vehicles: vehicleLinks$,
          });
        }),
      );
  }

  private handleError(error: unknown): Observable<never> {
    console.error('MoviesService error:', error);
    return throwError(() => error);
  }

}
