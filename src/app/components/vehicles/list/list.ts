import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { Vehicle } from '../../../interfaces/vehicle';
import { VehiclesService } from '../../../services/vehicles.service';

@Component({
  selector: 'app-vehicles-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class VehiclesList {
  private readonly vehiclesService = inject(VehiclesService);
  private readonly cdr = inject(ChangeDetectorRef);

  vehicles: Vehicle[] = [];

  constructor() {
    this.vehiclesService
      .getVehicles()
      .pipe(takeUntilDestroyed())
      .subscribe((vehicles) => {
        this.vehicles = vehicles;
        this.cdr.markForCheck();
      });
  }
}