import { TestBed } from '@angular/core/testing';
import type { ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import type { Location } from '../../../interfaces/location';
import { LocationsService } from '../../../services/locations.service';

import { LocationsList } from './list';

describe('LocationsList', () => {
  let component: LocationsList;
  let fixture: ComponentFixture<LocationsList>;
  let locationsGetCalled = false;

  const mockLocations: Location[] = [
    {
      id: 'location-1',
      name: 'Irontown',
      climate: 'Temperate',
      terrain: 'Mountain',
      surface_water: '40',
      residents: [],
      films: [],
      url: 'location-url',
    },
  ];

  beforeEach(async () => {
    const locationsServiceMock: Pick<LocationsService, 'getLocations'> = {
      getLocations: () => {
        locationsGetCalled = true;
        return of(mockLocations);
      },
    };

    await TestBed.configureTestingModule({
      imports: [LocationsList],
      providers: [
        provideRouter([]),
        { provide: LocationsService, useValue: locationsServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LocationsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to locations service on init', () => {
    expect(locationsGetCalled).toBe(true);
    expect(component.locations).toEqual(mockLocations);
    expect(component.filteredLocations).toEqual(mockLocations);
  });
});
