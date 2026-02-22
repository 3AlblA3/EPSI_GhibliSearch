import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import type { Species } from '../interfaces/species';

import { SpeciesService } from './species.service';

describe('SpeciesService', () => {
  let service: SpeciesService;
  let httpMock: HttpTestingController;

  const mockSpecies: Species = {
    id: 'species-1',
    name: 'Human',
    classification: 'Mammal',
    eye_colors: 'Brown',
    hair_colors: 'Brown',
    people: ['https://ghibliapi.dev/people/person-1'],
    films: ['https://ghibliapi.dev/films/movie-1'],
    url: 'species-url',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpeciesService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(SpeciesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch species list', () => {
    let result: Species[] | undefined;

    service.getSpecies().subscribe((species) => {
      result = species;
    });

    const req = httpMock.expectOne('https://ghibliapi.dev/species/');
    expect(req.request.method).toBe('GET');
    req.flush([mockSpecies]);

    expect(result).toEqual([mockSpecies]);
  });

  it('should fetch one species by id', () => {
    let result:
      | {
          species: Species;
          people: Array<{ id: string; name: string; route: string[] }>;
          films: Array<{ id: string; name: string; route: string[] }>;
        }
      | undefined;

    service.getSpeciesById(mockSpecies.id).subscribe((species) => {
      result = species;
    });

    const req = httpMock.expectOne(
      `https://ghibliapi.dev/species/${mockSpecies.id}`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockSpecies);

    const peopleReq = httpMock.expectOne('https://ghibliapi.dev/people/person-1');
    expect(peopleReq.request.method).toBe('GET');
    peopleReq.flush({ name: 'San' });

    const filmsReq = httpMock.expectOne('https://ghibliapi.dev/films/movie-1');
    expect(filmsReq.request.method).toBe('GET');
    filmsReq.flush({ title: 'Totoro' });

    expect(result).toEqual({
      species: mockSpecies,
      people: [{ id: 'person-1', name: 'San', route: ['/people', 'person-1'] }],
      films: [{ id: 'movie-1', name: 'Totoro', route: ['/movie', 'movie-1'] }],
    });
  });
});
