import { TestBed } from '@angular/core/testing';

import { Tourisme } from './tourisme';

describe('Tourisme', () => {
  let service: Tourisme;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Tourisme);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
