import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Movie } from '../../interfaces/movie';
import { MoviesService } from '../../services/movies.service';

@Component({
  selector: 'app-movie-card',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.scss',
})
export class MovieCard {
 // Input passe la tâche dans le composant parent
  movie = input<Movie>();
  private moviesService : MoviesService = inject(MoviesService);

}
