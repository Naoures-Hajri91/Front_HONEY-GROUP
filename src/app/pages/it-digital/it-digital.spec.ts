import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItDigital } from './it-digital';

describe('ItDigital', () => {
  let component: ItDigital;
  let fixture: ComponentFixture<ItDigital>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItDigital]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItDigital);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
