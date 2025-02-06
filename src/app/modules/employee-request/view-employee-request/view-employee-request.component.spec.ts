import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEmployeeRequestComponent } from './view-employee-request.component';

describe('ViewEmployeeRequestComponent', () => {
  let component: ViewEmployeeRequestComponent;
  let fixture: ComponentFixture<ViewEmployeeRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewEmployeeRequestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewEmployeeRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
