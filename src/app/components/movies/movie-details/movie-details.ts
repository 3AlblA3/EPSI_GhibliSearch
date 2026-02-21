import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MoviesService } from '../../../services/movies.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { Movie } from '../../../interfaces/movie';

@Component({
  selector: 'app-movie-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieDetails {
  private readonly route = inject(ActivatedRoute);
  private readonly moviesService = inject(MoviesService);
  private readonly cdr = inject(ChangeDetectorRef);

  movie: Movie | null = null;

  constructor() {
    const movieId = this.route.snapshot.paramMap.get('id');

    if (!movieId) {
      return;
    }

    this.moviesService
      .getMovie(movieId)
      .pipe(takeUntilDestroyed())
      .subscribe((movie) => {
        this.movie = movie;
        // Marquer le composant pour vérification des changements (à cause du SSR)
        this.cdr.markForCheck();
      });
  }
}
