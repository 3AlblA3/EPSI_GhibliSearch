import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { MoviesService } from './movies.service';
import type { Movie } from '../interfaces/movie';

describe('MoviesService', () => {
  let service: MoviesService;
  let httpMock: HttpTestingController;

  const mockMovie: Movie = {
    id: 'movie-1',
    title: 'Mon voisin Totoro',
    original_title: 'となりのトトロ',
    original_title_romanised: 'Tonari no Totoro',
    image: 'image-url',
    movie_banner: 'banner-url',
    description: 'Description',
    director: 'Hayao Miyazaki',
    producer: 'Toru Hara',
    release_date: '1988',
    running_time: '86',
    rt_score: '93',
    people: [],
    species: [],
    locations: [],
    vehicles: [],
    url: 'movie-url',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MoviesService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(MoviesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch movies list', () => {
    let result: Movie[] | undefined;

    service.getMovies().subscribe((movies) => {
      result = movies;
    });

    const req = httpMock.expectOne('https://ghibliapi.dev/films/');
    expect(req.request.method).toBe('GET');
    req.flush([mockMovie]);

    expect(result).toEqual([mockMovie]);
  });

  it('should fetch one movie by id', () => {
    let result: Movie | undefined;

    service.getMovie(mockMovie.id).subscribe((movie) => {
      result = movie;
    });

    const req = httpMock.expectOne(`https://ghibliapi.dev/films/${mockMovie.id}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockMovie);

    expect(result).toEqual(mockMovie);
  });
});
