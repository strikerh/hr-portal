import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefineJobComponent } from './define-job.component';

describe('DefineJobComponent', () => {
  let component: DefineJobComponent;
  let fixture: ComponentFixture<DefineJobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefineJobComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DefineJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
