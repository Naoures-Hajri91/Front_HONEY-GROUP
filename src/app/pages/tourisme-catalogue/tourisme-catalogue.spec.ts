import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourismeCatalogue } from './tourisme-catalogue';

describe('TourismeCatalogue', () => {
  let component: TourismeCatalogue;
  let fixture: ComponentFixture<TourismeCatalogue>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TourismeCatalogue]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TourismeCatalogue);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
