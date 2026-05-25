import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningMedecin } from './planning-medecin';

describe('PlanningMedecin', () => {
  let component: PlanningMedecin;
  let fixture: ComponentFixture<PlanningMedecin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanningMedecin],
    }).compileComponents();

    fixture = TestBed.createComponent(PlanningMedecin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
