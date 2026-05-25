import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMedecin } from './dashboard-medecin';

describe('DashboardMedecin', () => {
  let component: DashboardMedecin;
  let fixture: ComponentFixture<DashboardMedecin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardMedecin],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardMedecin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
