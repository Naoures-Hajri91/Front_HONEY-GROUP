import { TestBed } from '@angular/core/testing';

import { Poles } from './poles';

describe('Poles', () => {
  let service: Poles;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Poles);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
