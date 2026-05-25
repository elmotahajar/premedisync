import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationPatient } from './creation-patient';

describe('CreationPatient', () => {
  let component: CreationPatient;
  let fixture: ComponentFixture<CreationPatient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreationPatient],
    }).compileComponents();

    fixture = TestBed.createComponent(CreationPatient);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
