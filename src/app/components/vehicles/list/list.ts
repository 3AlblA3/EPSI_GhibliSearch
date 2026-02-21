import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { Vehicle } from '../../../interfaces/vehicle';
import { VehiclesService } from '../../../services/vehicles.service';

@Component({
  selector: 'app-vehicles-list',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class VehiclesList {
  private readonly vehiclesService = inject(VehiclesService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly fb = inject(FormBuilder);

  vehicles: Vehicle[] = [];
  filteredVehicles: Vehicle[] = [];
  searchForm = this.fb.group({
    searchName: [''],
  });

  constructor() {
    this.vehiclesService
      .getVehicles()
      .pipe(takeUntilDestroyed())
      .subscribe((vehicles) => {
        this.vehicles = vehicles;
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

    this.filteredVehicles = this.vehicles.filter(
      (vehicle) => !name || vehicle.name.toLowerCase().includes(name),
    );
  }

  trackById(_index: number, vehicle: Vehicle): string {
    return vehicle.id;
  }
}