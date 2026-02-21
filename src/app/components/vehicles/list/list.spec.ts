import { TestBed } from '@angular/core/testing';
import type { ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import type { Vehicle } from '../../../interfaces/vehicle';
import { VehiclesService } from '../../../services/vehicles.service';

import { VehiclesList } from './list';

describe('VehiclesList', () => {
  let component: VehiclesList;
  let fixture: ComponentFixture<VehiclesList>;
  let vehiclesGetCalled = false;

  const mockVehicles: Vehicle[] = [
    {
      id: 'vehicle-1',
      name: 'Catbus',
      description: 'Un bus-chat magique',
      vehicle_class: 'Bus',
      length: '12',
      pilot: 'pilot-url',
      films: [],
      url: 'vehicle-url',
    },
  ];

  beforeEach(async () => {
    const vehiclesServiceMock: Pick<VehiclesService, 'getVehicles'> = {
      getVehicles: () => {
        vehiclesGetCalled = true;
        return of(mockVehicles);
      },
    };

    await TestBed.configureTestingModule({
      imports: [VehiclesList],
      providers: [
        provideRouter([]),
        { provide: VehiclesService, useValue: vehiclesServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VehiclesList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to vehicles service on init', () => {
    expect(vehiclesGetCalled).toBe(true);
    expect(component.vehicles).toEqual(mockVehicles);
    expect(component.filteredVehicles).toEqual(mockVehicles);
  });
});
