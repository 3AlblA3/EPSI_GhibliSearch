import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MoviesService } from '../../../services/movies.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { Movie } from '../../../interfaces/movie';
import type { MovieRelatedLink } from '../../../services/movies.service';

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
  peopleLinks: MovieRelatedLink[] = [];
  speciesLinks: MovieRelatedLink[] = [];
  locationLinks: MovieRelatedLink[] = [];
  vehicleLinks: MovieRelatedLink[] = [];

  constructor() {
    const movieId = this.route.snapshot.paramMap.get('id');

    if (!movieId) {
      return;
    }

    this.moviesService
      .getMovie(movieId)
      .pipe(takeUntilDestroyed())
      .subscribe(({ movie, people, species, locations, vehicles }) => {
        this.movie = movie;
        this.peopleLinks = people;
        this.speciesLinks = species;
        this.locationLinks = locations;
        this.vehicleLinks = vehicles;
        // Marquer le composant pour vérification des changements (à cause du SSR)
        this.cdr.markForCheck();
      });
  }
}
