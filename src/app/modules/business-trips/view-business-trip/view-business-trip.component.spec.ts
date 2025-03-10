import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBusinessTripComponent } from './view-business-trip.component';

describe('ViewBusinessTripComponent', () => {
  let component: ViewBusinessTripComponent;
  let fixture: ComponentFixture<ViewBusinessTripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewBusinessTripComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewBusinessTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
