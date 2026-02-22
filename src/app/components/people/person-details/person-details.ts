import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { Person } from '../../../interfaces/person';
import { PeopleService, type PersonRelatedLink } from '../../../services/people.service';

@Component({
  selector: 'app-person-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './person-details.html',
  styleUrl: './person-details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonDetails {
  private readonly route = inject(ActivatedRoute);
  private readonly peopleService = inject(PeopleService);
  private readonly cdr = inject(ChangeDetectorRef);

  person: Person | null = null;
  speciesLink: PersonRelatedLink | null = null;
  filmLinks: PersonRelatedLink[] = [];

  constructor() {
    const personId = this.route.snapshot.paramMap.get('id');

    if (!personId) {
      return;
    }

    this.peopleService
      .getPerson(personId)
      .pipe(takeUntilDestroyed())
      .subscribe(({ person, species, films }) => {
        this.person = person;
        this.speciesLink = species;
        this.filmLinks = films;
        this.cdr.markForCheck();
      });
  }
}