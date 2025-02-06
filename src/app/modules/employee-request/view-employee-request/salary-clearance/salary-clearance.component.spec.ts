import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryClearanceComponent } from './salary-clearance.component';

describe('SalaryClearanceComponent', () => {
  let component: SalaryClearanceComponent;
  let fixture: ComponentFixture<SalaryClearanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryClearanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalaryClearanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
