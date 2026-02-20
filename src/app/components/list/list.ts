import { ChangeDetectorRef, Component, inject } from '@angular/core';
import type { Movie } from '../../interfaces/movie';
import { MoviesService } from '../../services/movies.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ListFilter } from '../list-filter/list-filter';
import { MovieCard } from '../movie-card/movie-card';

@Component({
  selector: 'app-list',
  imports: [CommonModule, ListFilter, MovieCard],
  standalone: true,
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class List {

  private moviesService: MoviesService =  inject(MoviesService);
  private router: Router = inject(Router);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  movies: Movie[] = [];

  constructor() {
    this.moviesService
      .getMovies()
      .pipe(takeUntilDestroyed())
      .subscribe((movies) => {
        this.movies = movies;
        // Marquer le composant pour vérification des changements (à cause du SSR)
        this.cdr.markForCheck();
      });
  }

  public openMovieDetails(id: string): void {
    this.router.navigate(['/movie', id]);
  }
  
}
