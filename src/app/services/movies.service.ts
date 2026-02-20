import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import type { Observable } from 'rxjs';
import type { Movie } from '../interfaces/movie';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  public httpClient: HttpClient = inject(HttpClient);
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
  public getMovie(id: string): Observable<Movie> {
    return this.httpClient
      .get<Movie>(`${this.apiUrl}${id}`)
      .pipe(catchError((error) => this.handleError(error)));
  }

  private handleError(error: unknown): Observable<never> {
    console.error('MoviesService error:', error);
    return throwError(() => error);
  }

}
