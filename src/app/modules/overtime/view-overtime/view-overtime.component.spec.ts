import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOvertimeComponent } from './view-overtime.component';

describe('ViewOvertimeComponent', () => {
  let component: ViewOvertimeComponent;
  let fixture: ComponentFixture<ViewOvertimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewOvertimeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewOvertimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
