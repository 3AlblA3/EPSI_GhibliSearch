import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Movie } from '../interfaces/movie';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  
  public httpClient: HttpClient = inject(HttpClient);
  private apiUrl = 'https://ghibliapi.dev/films/';

  private moviesSubject$ = new BehaviorSubject<Movie[]>([]);
  public movies$ = this.moviesSubject$.asObservable();

  constructor() {
    this.loadMovies();
  }

  // Charger les films depuis l'API
  private loadMovies(): void {
    this.httpClient.get<Movie[]>(this.apiUrl).pipe(
      map(movies => movies.map(movie => ({
        ...movie,
      })))
    ).subscribe({
      // Mettre à jour le BehaviorSubject avec les films chargés
      next: (movies) => this.moviesSubject$.next(movies),
       error: (error) => console.error('Error loading movies:', error)
    });
  }

  // Récupérer les films
  public getMovies(): Observable<Movie[]> {
    return this.movies$;
    }

}
