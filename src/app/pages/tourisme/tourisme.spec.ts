import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tourisme } from './tourisme';

describe('Tourisme', () => {
  let component: Tourisme;
  let fixture: ComponentFixture<Tourisme>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tourisme]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tourisme);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
