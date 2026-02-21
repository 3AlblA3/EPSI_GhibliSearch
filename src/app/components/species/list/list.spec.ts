import { TestBed } from '@angular/core/testing';
import type { ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import type { Species } from '../../../interfaces/species';
import { SpeciesService } from '../../../services/species.service';

import { SpeciesList } from './list';

describe('SpeciesList', () => {
  let component: SpeciesList;
  let fixture: ComponentFixture<SpeciesList>;
  let speciesGetCalled = false;

  const mockSpecies: Species[] = [
    {
      id: 'species-1',
      name: 'Human',
      classification: 'Mammal',
      eye_colors: 'Brown',
      hair_colors: 'Brown',
      people: [],
      films: [],
      url: 'species-url',
    },
  ];

  beforeEach(async () => {
    const speciesServiceMock: Pick<SpeciesService, 'getSpecies'> = {
      getSpecies: () => {
        speciesGetCalled = true;
        return of(mockSpecies);
      },
    };

    await TestBed.configureTestingModule({
      imports: [SpeciesList],
      providers: [
        provideRouter([]),
        { provide: SpeciesService, useValue: speciesServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SpeciesList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to species service on init', () => {
    expect(speciesGetCalled).toBe(true);
    expect(component.species).toEqual(mockSpecies);
    expect(component.filteredSpecies).toEqual(mockSpecies);
  });
});
