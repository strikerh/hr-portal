import { TestBed } from '@angular/core/testing';

import { BusinessTripApiService } from './business-trip-api.service';

describe('BusinessTripApiService', () => {
  let service: BusinessTripApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessTripApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
