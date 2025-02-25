import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidePageComponent } from './side-page.component';

describe('SidePageComponent', () => {
  let component: SidePageComponent;
  let fixture: ComponentFixture<SidePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
