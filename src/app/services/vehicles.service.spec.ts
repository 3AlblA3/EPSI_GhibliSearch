import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import type { Vehicle } from '../interfaces/vehicle';

import { VehiclesService } from './vehicles.service';

describe('VehiclesService', () => {
  let service: VehiclesService;
  let httpMock: HttpTestingController;

  const mockVehicle: Vehicle = {
    id: 'vehicle-1',
    name: 'Catbus',
    description: 'Un bus-chat magique',
    vehicle_class: 'Bus',
    length: '12',
    pilot: 'https://ghibliapi.dev/people/person-1',
    films: ['https://ghibliapi.dev/films/movie-1'],
    url: 'vehicle-url',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VehiclesService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(VehiclesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch vehicles list', () => {
    let result: Vehicle[] | undefined;

    service.getVehicles().subscribe((vehicles) => {
      result = vehicles;
    });

    const req = httpMock.expectOne('https://ghibliapi.dev/vehicles/');
    expect(req.request.method).toBe('GET');
    req.flush([mockVehicle]);

    expect(result).toEqual([mockVehicle]);
  });

  it('should fetch one vehicle by id', () => {
    let result:
      | {
          vehicle: Vehicle;
          pilot: { id: string; name: string; route: string[] } | null;
          films: Array<{ id: string; name: string; route: string[] }>;
        }
      | undefined;

    service.getVehicle(mockVehicle.id).subscribe((vehicle) => {
      result = vehicle;
    });

    const req = httpMock.expectOne(
      `https://ghibliapi.dev/vehicles/${mockVehicle.id}`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockVehicle);

    const pilotReq = httpMock.expectOne('https://ghibliapi.dev/people/person-1');
    expect(pilotReq.request.method).toBe('GET');
    pilotReq.flush({ name: 'Satsuki' });

    const filmsReq = httpMock.expectOne('https://ghibliapi.dev/films/movie-1');
    expect(filmsReq.request.method).toBe('GET');
    filmsReq.flush({ title: 'Totoro' });

    expect(result).toEqual({
      vehicle: mockVehicle,
      pilot: { id: 'person-1', name: 'Satsuki', route: ['/people', 'person-1'] },
      films: [{ id: 'movie-1', name: 'Totoro', route: ['/movie', 'movie-1'] }],
    });
  });
});
