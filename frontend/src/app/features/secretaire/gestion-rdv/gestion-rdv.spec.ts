import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionRdv } from './gestion-rdv';

describe('GestionRdv', () => {
  let component: GestionRdv;
  let fixture: ComponentFixture<GestionRdv>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionRdv],
    }).compileComponents();

    fixture = TestBed.createComponent(GestionRdv);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
