import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import type { Movie } from '../../../interfaces/movie';

@Component({
  selector: 'app-movie-card',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.scss',
})
export class MovieCard {
  // Input passe le film dans le composant parent
  movie = input<Movie>();
  movieSelected = output<string>();

  public showDetails(): void {
    const movieId = this.movie()?.id;

    if (movieId) {
      this.movieSelected.emit(movieId);
    }
  }

}
