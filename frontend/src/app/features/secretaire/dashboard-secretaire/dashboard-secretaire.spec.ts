import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSecretaire } from './dashboard-secretaire';

describe('DashboardSecretaire', () => {
  let component: DashboardSecretaire;
  let fixture: ComponentFixture<DashboardSecretaire>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardSecretaire],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardSecretaire);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
