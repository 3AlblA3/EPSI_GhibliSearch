import { TestBed } from '@angular/core/testing';
import type { ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import type { Vehicle } from '../../../interfaces/vehicle';
import { VehiclesService, type VehicleDetailsData } from '../../../services/vehicles.service';

import { VehicleDetails } from './vehicle-details';

describe('VehicleDetails', () => {
  let component: VehicleDetails;
  let fixture: ComponentFixture<VehicleDetails>;
  let requestedVehicleId: string | null = null;

  const mockVehicle: Vehicle = {
    id: 'vehicle-1',
    name: 'Catbus',
    description: 'Un bus-chat magique',
    vehicle_class: 'Bus',
    length: '12',
    pilot: 'https://ghibliapi.dev/people/person-1',
    films: [],
    url: 'vehicle-url',
  };

  beforeEach(async () => {
    const vehicleDetails: VehicleDetailsData = {
      vehicle: mockVehicle,
      pilot: { id: 'person-1', name: 'Satsuki', route: ['/people', 'person-1'] },
      films: [],
    };

    const vehiclesServiceMock: Pick<VehiclesService, 'getVehicle'> = {
      getVehicle: (id: string) => {
        requestedVehicleId = id;
        return of(vehicleDetails);
      },
    };

    await TestBed.configureTestingModule({
      imports: [VehicleDetails],
      providers: [
        provideRouter([]),
        { provide: VehiclesService, useValue: vehiclesServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: 'vehicle-1' }),
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to vehicle service using route id', () => {
    expect(requestedVehicleId).toBe('vehicle-1');
    expect(component.vehicle).toEqual(mockVehicle);
  });
});
