import { TestBed } from '@angular/core/testing';
import type { ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import type { Movie } from '../../../interfaces/movie';
import { MoviesService } from '../../../services/movies.service';

import { List } from './list';

describe('List', () => {
  let component: List;
  let fixture: ComponentFixture<List>;
  let moviesGetCalled = false;
  let routerNavigateArgs: unknown[] | null = null;

  const mockMovies: Movie[] = [
    {
      id: 'movie-1',
      title: 'Totoro',
      original_title: 'となりのトトロ',
      original_title_romanised: 'Tonari no Totoro',
      image: 'image-url',
      movie_banner: 'banner-url',
      description: 'Description',
      director: 'Miyazaki',
      producer: 'Hara',
      release_date: '1988',
      running_time: '86',
      rt_score: '93',
      people: [],
      species: [],
      locations: [],
      vehicles: [],
      url: 'movie-url',
    },
  ];

  beforeEach(async () => {
    const moviesServiceMock: Pick<MoviesService, 'getMovies'> = {
      getMovies: () => {
        moviesGetCalled = true;
        return of(mockMovies);
      },
    };
    const routerMock: Pick<Router, 'navigate'> = {
      navigate: (commands: unknown[]) => {
        routerNavigateArgs = commands;
        return Promise.resolve(true);
      },
    };

    await TestBed.configureTestingModule({
      imports: [List],
      providers: [
        { provide: MoviesService, useValue: moviesServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(List);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to movies service on init', () => {
    expect(moviesGetCalled).toBe(true);
    expect(component.movies).toEqual(mockMovies);
    expect(component.filteredMovies).toEqual(mockMovies);
  });

  it('should navigate to movie details', () => {
    component.openMovieDetails('movie-1');

    expect(routerNavigateArgs).toEqual(['/movie', 'movie-1']);
  });
});
