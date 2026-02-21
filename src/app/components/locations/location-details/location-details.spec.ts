import { TestBed } from '@angular/core/testing';
import type { ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import type { Location } from '../../../interfaces/location';
import { LocationsService } from '../../../services/locations.service';

import { LocationDetails } from './location-details';

describe('LocationDetails', () => {
  let component: LocationDetails;
  let fixture: ComponentFixture<LocationDetails>;
  let requestedLocationId: string | null = null;

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

  beforeEach(async () => {
    const locationsServiceMock: Pick<LocationsService, 'getLocation'> = {
      getLocation: (id: string) => {
        requestedLocationId = id;
        return of(mockLocation);
      },
    };

    await TestBed.configureTestingModule({
      imports: [LocationDetails],
      providers: [
        provideRouter([]),
        { provide: LocationsService, useValue: locationsServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: 'location-1' }),
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LocationDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to location service using route id', () => {
    expect(requestedLocationId).toBe('location-1');
    expect(component.location).toEqual(mockLocation);
  });
});
