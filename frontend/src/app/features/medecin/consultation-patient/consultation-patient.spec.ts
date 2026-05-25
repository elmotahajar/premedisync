import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationPatient } from './consultation-patient';

describe('ConsultationPatient', () => {
  let component: ConsultationPatient;
  let fixture: ComponentFixture<ConsultationPatient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultationPatient],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsultationPatient);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
