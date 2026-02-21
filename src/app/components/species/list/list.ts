import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { Species } from '../../../interfaces/species';
import { SpeciesService } from '../../../services/species.service';

@Component({
  selector: 'app-species-list',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class SpeciesList {
  private readonly speciesService = inject(SpeciesService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly fb = inject(FormBuilder);

  species: Species[] = [];
  filteredSpecies: Species[] = [];
  searchForm = this.fb.group({
    searchName: [''],
  });

  constructor() {
    this.speciesService
      .getSpecies()
      .pipe(takeUntilDestroyed())
      .subscribe((species) => {
        this.species = species;
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

    this.filteredSpecies = this.species.filter(
      (specie) => !name || specie.name.toLowerCase().includes(name),
    );
  }

  trackById(_index: number, specie: Species): string {
    return specie.id;
  }
}