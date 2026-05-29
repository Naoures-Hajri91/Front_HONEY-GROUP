import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourismeReservation } from './tourisme-reservation';

describe('TourismeReservation', () => {
  let component: TourismeReservation;
  let fixture: ComponentFixture<TourismeReservation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TourismeReservation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TourismeReservation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
