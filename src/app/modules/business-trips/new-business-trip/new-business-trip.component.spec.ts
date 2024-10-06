import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBusinessTripComponent } from './new-business-trip.component';

describe('NewBusinessTripComponent', () => {
  let component: NewBusinessTripComponent;
  let fixture: ComponentFixture<NewBusinessTripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewBusinessTripComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewBusinessTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
