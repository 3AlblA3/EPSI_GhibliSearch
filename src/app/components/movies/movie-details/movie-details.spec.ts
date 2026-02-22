import { TestBed } from '@angular/core/testing';
import type { ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import type { Movie } from '../../../interfaces/movie';
import { MoviesService, type MovieDetailsData } from '../../../services/movies.service';

import { MovieDetails } from './movie-details';

describe('MovieDetails', () => {
  let component: MovieDetails;
  let fixture: ComponentFixture<MovieDetails>;
  let requestedMovieId: string | null = null;

  const mockMovie: Movie = {
    id: 'movie-1',
    title: 'Totoro',
    original_title: 'となりのトトロ',
    original_title_romanised: 'Tonari no Totoro',
    image: 'image-url',
    movie_banner: 'banner-url',
    description: 'Description',
    director: 'Miyazaki',
    producer: 'Hara',
    release_date: '1988',
    running_time: '86',
    rt_score: '93',
    people: [],
    species: [],
    locations: [],
    vehicles: [],
    url: 'movie-url',
  };

  beforeEach(async () => {
    const movieDetails: MovieDetailsData = {
      movie: mockMovie,
      people: [],
      species: [],
      locations: [],
      vehicles: [],
    };

    const moviesServiceMock: Pick<MoviesService, 'getMovie'> = {
      getMovie: (id: string) => {
        requestedMovieId = id;
        return of(movieDetails);
      },
    };

    await TestBed.configureTestingModule({
      imports: [MovieDetails],
      providers: [
        provideRouter([]),
        { provide: MoviesService, useValue: moviesServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: 'movie-1' }),
            },
          },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to movie service using route id', () => {
    expect(requestedMovieId).toBe('movie-1');
    expect(component.movie).toEqual(mockMovie);
  });
});
