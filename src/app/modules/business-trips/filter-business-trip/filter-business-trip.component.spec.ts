import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterBusinessTripComponent } from './filter-business-trip.component';

describe('FilterBusinessTripComponent', () => {
  let component: FilterBusinessTripComponent;
  let fixture: ComponentFixture<FilterBusinessTripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterBusinessTripComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FilterBusinessTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
