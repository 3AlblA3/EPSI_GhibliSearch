import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { Location } from '../../../interfaces/location';
import { LocationsService } from '../../../services/locations.service';

@Component({
  selector: 'app-locations-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class LocationsList {
  private readonly locationsService = inject(LocationsService);
  private readonly cdr = inject(ChangeDetectorRef);

  locations: Location[] = [];

  constructor() {
    this.locationsService
      .getLocations()
      .pipe(takeUntilDestroyed())
      .subscribe((locations) => {
        this.locations = locations;
        this.cdr.markForCheck();
      });
  }
}