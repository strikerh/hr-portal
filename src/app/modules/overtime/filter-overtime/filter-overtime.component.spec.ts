import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterOvertimeComponent } from './filter-overtime.component';

describe('FilterOvertimeComponent', () => {
  let component: FilterOvertimeComponent;
  let fixture: ComponentFixture<FilterOvertimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterOvertimeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FilterOvertimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
