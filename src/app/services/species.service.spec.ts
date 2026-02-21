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
    people: [],
    films: [],
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
    let result: Species | undefined;

    service.getSpeciesById(mockSpecies.id).subscribe((species) => {
      result = species;
    });

    const req = httpMock.expectOne(
      `https://ghibliapi.dev/species/${mockSpecies.id}`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockSpecies);

    expect(result).toEqual(mockSpecies);
  });
});
