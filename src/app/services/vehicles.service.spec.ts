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
    pilot: 'pilot-url',
    films: [],
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
    let result: Vehicle | undefined;

    service.getVehicle(mockVehicle.id).subscribe((vehicle) => {
      result = vehicle;
    });

    const req = httpMock.expectOne(
      `https://ghibliapi.dev/vehicles/${mockVehicle.id}`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockVehicle);

    expect(result).toEqual(mockVehicle);
  });
});
