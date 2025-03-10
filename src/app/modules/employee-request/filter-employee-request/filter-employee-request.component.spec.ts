import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterEmployeeRequestComponent } from './filter-employee-request.component';

describe('FilterEmployeeRequestComponent', () => {
  let component: FilterEmployeeRequestComponent;
  let fixture: ComponentFixture<FilterEmployeeRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterEmployeeRequestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FilterEmployeeRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
