import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-filter',
  templateUrl: './list-filter.html',
  styleUrl: './list-filter.scss',
  standalone: true,  
  imports: [ReactiveFormsModule],
})
export class ListFilter {


  // Construction de notre formulaire
  searchForm = new FormGroup({
    searchTitle: new FormControl<string>('', []),
    searchReleaseDate: new FormControl<string>('', []),
  });

  public get title() {
    return this.searchForm.get('searchTitle')
  }

  public get status() {
    return this.searchForm.get('searchReleaseDate')
  }

  public onSubmit() {
    if (this.searchForm.valid) {
      // Récupération des values du formulaire
      const formValue = this.searchForm.value;
    }
  }
}
