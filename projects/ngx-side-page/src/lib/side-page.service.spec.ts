import { TestBed } from '@angular/core/testing';

import { SidePageService } from './side-page.service';

describe('SidePageService', () => {
  let service: SidePageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SidePageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
