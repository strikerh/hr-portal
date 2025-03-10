import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterVacationComponent } from './filter-vacation.component';

describe('FilterVacationComponent', () => {
  let component: FilterVacationComponent;
  let fixture: ComponentFixture<FilterVacationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterVacationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FilterVacationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
