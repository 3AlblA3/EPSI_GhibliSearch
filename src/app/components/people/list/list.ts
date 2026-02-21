import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { Person } from '../../../interfaces/person';
import { PeopleService } from '../../../services/people.service';

@Component({
  selector: 'app-people-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class PeopleList {
  private readonly peopleService = inject(PeopleService);
  private readonly cdr = inject(ChangeDetectorRef);

  people: Person[] = [];

  constructor() {
    this.peopleService
      .getPeople()
      .pipe(takeUntilDestroyed())
      .subscribe((people) => {
        this.people = people;
        this.cdr.markForCheck();
      });
  }
}