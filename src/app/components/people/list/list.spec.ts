import { TestBed } from '@angular/core/testing';
import type { ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import type { Person } from '../../../interfaces/person';
import { PeopleService } from '../../../services/people.service';

import { PeopleList } from './list';

describe('PeopleList', () => {
  let component: PeopleList;
  let fixture: ComponentFixture<PeopleList>;
  let peopleGetCalled = false;

  const mockPeople: Person[] = [
    {
      id: 'person-1',
      name: 'San',
      gender: 'Female',
      age: '17',
      eye_color: 'Brown',
      hair_color: 'Brown',
      films: [],
      species: 'Human',
      url: 'person-url',
    },
  ];

  beforeEach(async () => {
    const peopleServiceMock: Pick<PeopleService, 'getPeople'> = {
      getPeople: () => {
        peopleGetCalled = true;
        return of(mockPeople);
      },
    };

    await TestBed.configureTestingModule({
      imports: [PeopleList],
      providers: [
        provideRouter([]),
        { provide: PeopleService, useValue: peopleServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PeopleList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to people service on init', () => {
    expect(peopleGetCalled).toBe(true);
    expect(component.people).toEqual(mockPeople);
    expect(component.filteredPeople).toEqual(mockPeople);
  });
});
