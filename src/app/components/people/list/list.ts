import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { Person } from '../../../interfaces/person';
import { PeopleService } from '../../../services/people.service';

@Component({
  selector: 'app-people-list',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class PeopleList {
  private readonly peopleService = inject(PeopleService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly fb = inject(FormBuilder);

  people: Person[] = [];
  filteredPeople: Person[] = [];
  searchForm = this.fb.group({
    searchName: [''],
  });

  constructor() {
    this.peopleService
      .getPeople()
      .pipe(takeUntilDestroyed())
      .subscribe((people) => {
        this.people = people;
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

    this.filteredPeople = this.people.filter(
      (person) => !name || person.name.toLowerCase().includes(name),
    );
  }

  trackById(_index: number, person: Person): string {
    return person.id;
  }
}