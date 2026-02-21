import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { Species } from '../../../interfaces/species';
import { SpeciesService } from '../../../services/species.service';

@Component({
  selector: 'app-species-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './species-details.html',
  styleUrl: './species-details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpeciesDetails {
  private readonly route = inject(ActivatedRoute);
  private readonly speciesService = inject(SpeciesService);
  private readonly cdr = inject(ChangeDetectorRef);

  specie: Species | null = null;

  constructor() {
    const speciesId = this.route.snapshot.paramMap.get('id');

    if (!speciesId) {
      return;
    }

    this.speciesService
      .getSpeciesById(speciesId)
      .pipe(takeUntilDestroyed())
      .subscribe((specie) => {
        this.specie = specie;
        this.cdr.markForCheck();
      });
  }
}