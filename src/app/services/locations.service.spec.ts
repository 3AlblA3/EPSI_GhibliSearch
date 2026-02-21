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
    residents: [],
    films: [],
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

  it('should fetch one location by id', () => {
    let result: Location | undefined;

    service.getLocation(mockLocation.id).subscribe((location) => {
      result = location;
    });

    const req = httpMock.expectOne(
      `https://ghibliapi.dev/locations/${mockLocation.id}`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockLocation);

    expect(result).toEqual(mockLocation);
  });
});
