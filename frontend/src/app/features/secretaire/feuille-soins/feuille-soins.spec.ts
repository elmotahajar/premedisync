import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeuilleSoins } from './feuille-soins';

describe('FeuilleSoins', () => {
  let component: FeuilleSoins;
  let fixture: ComponentFixture<FeuilleSoins>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeuilleSoins],
    }).compileComponents();

    fixture = TestBed.createComponent(FeuilleSoins);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
