import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisponibilitesMedecin } from './disponibilites-medecin';

describe('DisponibilitesMedecin', () => {
  let component: DisponibilitesMedecin;
  let fixture: ComponentFixture<DisponibilitesMedecin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisponibilitesMedecin],
    }).compileComponents();

    fixture = TestBed.createComponent(DisponibilitesMedecin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
