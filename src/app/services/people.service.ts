import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import type { Observable } from 'rxjs';
import type { Person } from '../interfaces/person';

@Injectable({
  providedIn: 'root',
})
export class PeopleService {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly apiUrl = 'https://ghibliapi.dev/people/';

  public loadPeople(): Observable<Person[]> {
    return this.httpClient
      .get<Person[]>(this.apiUrl)
      .pipe(catchError((error) => this.handleError(error)));
  }

  public getPeople(): Observable<Person[]> {
    return this.loadPeople();
  }

  public getPerson(id: string): Observable<Person> {
    return this.httpClient
      .get<Person>(`${this.apiUrl}${id}`)
      .pipe(catchError((error) => this.handleError(error)));
  }

  private handleError(error: unknown): Observable<never> {
    console.error('PeopleService error:', error);
    return throwError(() => error);
  }
}