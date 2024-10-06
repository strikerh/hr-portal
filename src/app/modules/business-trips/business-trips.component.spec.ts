import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessTripsComponent } from './business-trips.component';

describe('BusinessTripsComponent', () => {
  let component: BusinessTripsComponent;
  let fixture: ComponentFixture<BusinessTripsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessTripsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BusinessTripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
