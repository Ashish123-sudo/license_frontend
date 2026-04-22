import { TestBed } from '@angular/core/testing';

import { License } from './license';

describe('License', () => {
  let service: License;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(License);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
