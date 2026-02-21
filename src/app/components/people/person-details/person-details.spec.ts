import { TestBed } from '@angular/core/testing';
import type { ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import type { Person } from '../../../interfaces/person';
import { PeopleService } from '../../../services/people.service';

import { PersonDetails } from './person-details';

describe('PersonDetails', () => {
  let component: PersonDetails;
  let fixture: ComponentFixture<PersonDetails>;
  let requestedPersonId: string | null = null;

  const mockPerson: Person = {
    id: 'person-1',
    name: 'San',
    gender: 'Female',
    age: '17',
    eye_color: 'Brown',
    hair_color: 'Brown',
    films: [],
    species: 'Human',
    url: 'person-url',
  };

  beforeEach(async () => {
    const peopleServiceMock: Pick<PeopleService, 'getPerson'> = {
      getPerson: (id: string) => {
        requestedPersonId = id;
        return of(mockPerson);
      },
    };

    await TestBed.configureTestingModule({
      imports: [PersonDetails],
      providers: [
        provideRouter([]),
        { provide: PeopleService, useValue: peopleServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: 'person-1' }),
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to person service using route id', () => {
    expect(requestedPersonId).toBe('person-1');
    expect(component.person).toEqual(mockPerson);
  });
});
