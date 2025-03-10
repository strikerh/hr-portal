import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVacationComponent } from './view-vacation.component';

describe('ViewVacationComponent', () => {
  let component: ViewVacationComponent;
  let fixture: ComponentFixture<ViewVacationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewVacationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewVacationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
