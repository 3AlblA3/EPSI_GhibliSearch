import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { Species } from '../../../interfaces/species';
import { SpeciesService } from '../../../services/species.service';

@Component({
  selector: 'app-species-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class SpeciesList {
  private readonly speciesService = inject(SpeciesService);
  private readonly cdr = inject(ChangeDetectorRef);

  species: Species[] = [];

  constructor() {
    this.speciesService
      .getSpecies()
      .pipe(takeUntilDestroyed())
      .subscribe((species) => {
        this.species = species;
        this.cdr.markForCheck();
      });
  }
}