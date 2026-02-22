import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import type { Observable } from 'rxjs';

export interface UrlResourceName {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private readonly httpClient = inject(HttpClient);

  // Méthode pour extraire le nom ou title d'une ressource à partir de son URL
  public getUrlName(url: string): Observable<UrlResourceName | null> {
    // Extraire l'id de la ressource à partir de l'URL
    const id = url.match(/\/[^/]+\/([^/]+)\/?$/)?.[1] ?? null;

    if (!id) {
      return of(null);
    }

    return this.httpClient
      .get<{ name?: string; title?: string }>(url)
      .pipe(
        map((response) => {
          const name = response.name ?? response.title ?? null;
          if (!name) {
            return null;
          }
          return {
            id,
            name,
          };
        }),
        catchError(() => of(null)),
      );
  }
}