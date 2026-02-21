import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { Location } from '../../../interfaces/location';
import { LocationsService } from '../../../services/locations.service';

@Component({
  selector: 'app-locations-list',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class LocationsList {
  private readonly locationsService = inject(LocationsService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly fb = inject(FormBuilder);

  locations: Location[] = [];
  filteredLocations: Location[] = [];
  searchForm = this.fb.group({
    searchName: [''],
  });

  constructor() {
    this.locationsService
      .getLocations()
      .pipe(takeUntilDestroyed())
      .subscribe((locations) => {
        this.locations = locations;
        this.applyFilters();
        this.cdr.markForCheck();
      });

    this.searchForm.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.applyFilters();
      });
  }

  private applyFilters(): void {
    const name = (this.searchForm.get('searchName')?.value ?? '').trim().toLowerCase();

    this.filteredLocations = this.locations.filter(
      (location) => !name || location.name.toLowerCase().includes(name),
    );
  }

  trackById(_index: number, location: Location): string {
    return location.id;
  }
}