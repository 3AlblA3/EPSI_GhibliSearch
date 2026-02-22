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
    people: ['https://ghibliapi.dev/people/person-1'],
    species: ['https://ghibliapi.dev/species/species-1'],
    locations: ['https://ghibliapi.dev/locations/location-1'],
    vehicles: ['https://ghibliapi.dev/vehicles/vehicle-1'],
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
    let result:
      | {
          movie: Movie;
          people: Array<{ id: string; name: string; route: string[] }>;
          species: Array<{ id: string; name: string; route: string[] }>;
          locations: Array<{ id: string; name: string; route: string[] }>;
          vehicles: Array<{ id: string; name: string; route: string[] }>;
        }
      | undefined;

    service.getMovie(mockMovie.id).subscribe((movie) => {
      result = movie;
    });

    const req = httpMock.expectOne(`https://ghibliapi.dev/films/${mockMovie.id}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockMovie);

    const peopleReq = httpMock.expectOne('https://ghibliapi.dev/people/person-1');
    expect(peopleReq.request.method).toBe('GET');
    peopleReq.flush({ name: 'Ashitaka' });

    const speciesReq = httpMock.expectOne('https://ghibliapi.dev/species/species-1');
    expect(speciesReq.request.method).toBe('GET');
    speciesReq.flush({ name: 'Human' });

    const locationsReq = httpMock.expectOne('https://ghibliapi.dev/locations/location-1');
    expect(locationsReq.request.method).toBe('GET');
    locationsReq.flush({ name: 'Irontown' });

    const vehiclesReq = httpMock.expectOne('https://ghibliapi.dev/vehicles/vehicle-1');
    expect(vehiclesReq.request.method).toBe('GET');
    vehiclesReq.flush({ name: 'Catbus' });

    expect(result).toEqual({
      movie: mockMovie,
      people: [{ id: 'person-1', name: 'Ashitaka', route: ['/people', 'person-1'] }],
      species: [{ id: 'species-1', name: 'Human', route: ['/species', 'species-1'] }],
      locations: [{ id: 'location-1', name: 'Irontown', route: ['/locations', 'location-1'] }],
      vehicles: [{ id: 'vehicle-1', name: 'Catbus', route: ['/vehicles', 'vehicle-1'] }],
    });
  });
});
