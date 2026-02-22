import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import type { Location } from '../interfaces/location';

import { LocationsService } from './locations.service';

describe('LocationsService', () => {
  let service: LocationsService;
  let httpMock: HttpTestingController;

  const mockLocation: Location = {
    id: 'location-1',
    name: 'Irontown',
    climate: 'Temperate',
    terrain: 'Mountain',
    surface_water: '40',
    residents: ['https://ghibliapi.dev/people/person-1'],
    films: ['https://ghibliapi.dev/films/film-1'],
    url: 'location-url',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocationsService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(LocationsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch locations list', () => {
    let result: Location[] | undefined;

    service.getLocations().subscribe((locations) => {
      result = locations;
    });

    const req = httpMock.expectOne('https://ghibliapi.dev/locations/');
    expect(req.request.method).toBe('GET');
    req.flush([mockLocation]);

    expect(result).toEqual([mockLocation]);
  });

  it('should fetch one location by id and resolve resident/film names', () => {
    let result:
      | {
          location: Location;
          residents: Array<{ id: string; name: string; route: string[] }>;
          films: Array<{ id: string; name: string; route: string[] }>;
        }
      | undefined;

    service.getLocation(mockLocation.id).subscribe((location) => {
      result = location;
    });

    const req = httpMock.expectOne(
      `https://ghibliapi.dev/locations/${mockLocation.id}`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockLocation);

    const residentReq = httpMock.expectOne('https://ghibliapi.dev/people/person-1');
    expect(residentReq.request.method).toBe('GET');
    residentReq.flush({ name: 'Ashitaka' });

    const filmReq = httpMock.expectOne('https://ghibliapi.dev/films/film-1');
    expect(filmReq.request.method).toBe('GET');
    filmReq.flush({ title: 'Princess Mononoke' });

    expect(result).toEqual({
      location: mockLocation,
      residents: [{ id: 'person-1', name: 'Ashitaka', route: ['/people', 'person-1'] }],
      films: [{ id: 'film-1', name: 'Princess Mononoke', route: ['/movie', 'film-1'] }],
    });
  });
});
