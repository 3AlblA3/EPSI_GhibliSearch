import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import type { Person } from '../interfaces/person';

import { PeopleService } from './people.service';

describe('PeopleService', () => {
  let service: PeopleService;
  let httpMock: HttpTestingController;

  const mockPerson: Person = {
    id: 'person-1',
    name: 'San',
    gender: 'Female',
    age: '17',
    eye_color: 'Brown',
    hair_color: 'Brown',
    films: ['https://ghibliapi.dev/films/movie-1'],
    species: 'https://ghibliapi.dev/species/species-1',
    url: 'person-url',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PeopleService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PeopleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch people list', () => {
    let result: Person[] | undefined;

    service.getPeople().subscribe((people) => {
      result = people;
    });

    const req = httpMock.expectOne('https://ghibliapi.dev/people/');
    expect(req.request.method).toBe('GET');
    req.flush([mockPerson]);

    expect(result).toEqual([mockPerson]);
  });

  it('should fetch one person by id', () => {
    let result:
      | {
          person: Person;
          species: { id: string; name: string; route: string[] } | null;
          films: Array<{ id: string; name: string; route: string[] }>;
        }
      | undefined;

    service.getPerson(mockPerson.id).subscribe((person) => {
      result = person;
    });

    const req = httpMock.expectOne(`https://ghibliapi.dev/people/${mockPerson.id}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPerson);

    const speciesReq = httpMock.expectOne('https://ghibliapi.dev/species/species-1');
    expect(speciesReq.request.method).toBe('GET');
    speciesReq.flush({ name: 'Human' });

    const filmsReq = httpMock.expectOne('https://ghibliapi.dev/films/movie-1');
    expect(filmsReq.request.method).toBe('GET');
    filmsReq.flush({ title: 'Totoro' });

    expect(result).toEqual({
      person: mockPerson,
      species: { id: 'species-1', name: 'Human', route: ['/species', 'species-1'] },
      films: [{ id: 'movie-1', name: 'Totoro', route: ['/movie', 'movie-1'] }],
    });
  });
});
