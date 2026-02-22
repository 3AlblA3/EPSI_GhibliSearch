import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { Vehicle } from '../../../interfaces/vehicle';
import { VehiclesService, type VehicleRelatedLink } from '../../../services/vehicles.service';

@Component({
  selector: 'app-vehicle-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './vehicle-details.html',
  styleUrl: './vehicle-details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleDetails {
  private readonly route = inject(ActivatedRoute);
  private readonly vehiclesService = inject(VehiclesService);
  private readonly cdr = inject(ChangeDetectorRef);

  vehicle: Vehicle | null = null;
  pilotLink: VehicleRelatedLink | null = null;
  filmLinks: VehicleRelatedLink[] = [];

  constructor() {
    const vehicleId = this.route.snapshot.paramMap.get('id');

    if (!vehicleId) {
      return;
    }

    this.vehiclesService
      .getVehicle(vehicleId)
      .pipe(takeUntilDestroyed())
      .subscribe(({ vehicle, pilot, films }) => {
        this.vehicle = vehicle;
        this.pilotLink = pilot;
        this.filmLinks = films;
        this.cdr.markForCheck();
      });
  }
}