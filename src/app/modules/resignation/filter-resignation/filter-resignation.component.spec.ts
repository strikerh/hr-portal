import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterResignationComponent } from './filter-resignation.component';

describe('FilterResignationComponent', () => {
  let component: FilterResignationComponent;
  let fixture: ComponentFixture<FilterResignationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterResignationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FilterResignationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
