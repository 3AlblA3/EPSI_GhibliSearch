import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { MoviesService } from '../../../services/movies.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MovieCard } from '../movie-card/movie-card';
import type { Movie } from '../../../interfaces/movie';

@Component({
  selector: 'app-list',
  imports: [CommonModule, ReactiveFormsModule, MovieCard],
  standalone: true,
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class List {

  private moviesService: MoviesService =  inject(MoviesService);
  private router: Router = inject(Router);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private formBuilder: FormBuilder = inject(FormBuilder);

  movies: Movie[] = [];
  filteredMovies: Movie[] = [];
  searchForm = this.formBuilder.group({
    searchName: [''],
    searchDate: [''],
  });

  constructor() {
    this.moviesService
      .getMovies()
      .pipe(takeUntilDestroyed())
      .subscribe((movies) => {
        this.movies = movies;
        this.applyFilters();
        // Marquer le composant pour vérification des changements (à cause du SSR)
        this.cdr.markForCheck();
      });

      // S'abonner aux changements du formulaire de recherche pour appliquer les filtres en temps réel
    this.searchForm.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.applyFilters();
      });
  }

  private applyFilters(): void {
    // ToLowerCase et trim car les majuscules empêchent la recherche et les espaces aussi
    const name = (this.searchForm.get('searchName')?.value ?? '').trim().toLowerCase();
    const date = (this.searchForm.get('searchDate')?.value ?? '').trim();

    this.filteredMovies = this.movies.filter((movie) => {
      const byName = !name || movie.title.toLowerCase().includes(name);
      const byDate = !date || movie.release_date.includes(date);
      return byName && byDate;
    });
  }

  public openMovieDetails(id: string): void {
    this.router.navigate(['/movie', id]);
  }
  
}
