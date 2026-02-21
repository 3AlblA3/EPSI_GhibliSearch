import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListFilter } from './list-filter';

describe('ListFilter', () => {
  let component: ListFilter;
  let fixture: ComponentFixture<ListFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListFilter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListFilter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
