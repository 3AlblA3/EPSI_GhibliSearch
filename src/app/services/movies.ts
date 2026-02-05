import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Movies {
  
  public httpClient: HttpClient = inject(HttpClient);
  private apiUrl = 'https://ghibliapi.dev/films/';
}
