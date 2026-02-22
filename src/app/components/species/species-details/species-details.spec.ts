import { TestBed } from '@angular/core/testing';
import type { ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import type { Species } from '../../../interfaces/species';
import { SpeciesService, type SpeciesDetailsData } from '../../../services/species.service';

import { SpeciesDetails } from './species-details';

describe('SpeciesDetails', () => {
  let component: SpeciesDetails;
  let fixture: ComponentFixture<SpeciesDetails>;
  let requestedSpeciesId: string | null = null;

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

  beforeEach(async () => {
    const speciesDetails: SpeciesDetailsData = {
      species: mockSpecies,
      people: [],
      films: [],
    };

    const speciesServiceMock: Pick<SpeciesService, 'getSpeciesById'> = {
      getSpeciesById: (id: string) => {
        requestedSpeciesId = id;
        return of(speciesDetails);
      },
    };

    await TestBed.configureTestingModule({
      imports: [SpeciesDetails],
      providers: [
        provideRouter([]),
        { provide: SpeciesService, useValue: speciesServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: 'species-1' }),
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SpeciesDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to species service using route id', () => {
    expect(requestedSpeciesId).toBe('species-1');
    expect(component.specie).toEqual(mockSpecies);
  });
});
