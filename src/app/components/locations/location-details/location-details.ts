import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { Location } from '../../../interfaces/location';
import { LocationsService, type LocationRelatedLink } from '../../../services/locations.service';

@Component({
  selector: 'app-location-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './location-details.html',
  styleUrl: './location-details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationDetails {
  private readonly route = inject(ActivatedRoute);
  private readonly locationsService = inject(LocationsService);
  private readonly cdr = inject(ChangeDetectorRef);

  location: Location | null = null;
  residentLinks: LocationRelatedLink[] = [];
  filmLinks: LocationRelatedLink[] = [];

  constructor() {
    const locationId = this.route.snapshot.paramMap.get('id');

    if (!locationId) {
      return;
    }

    this.locationsService
      .getLocation(locationId)
      .pipe(takeUntilDestroyed())
      .subscribe(({ location, residents, films }) => {
        this.location = location;
        this.residentLinks = residents;
        this.filmLinks = films;

        this.cdr.markForCheck();
      });
  }
}