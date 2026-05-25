import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RechercheMedecin } from './recherche-medecin';

describe('RechercheMedecin', () => {
  let component: RechercheMedecin;
  let fixture: ComponentFixture<RechercheMedecin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RechercheMedecin],
    }).compileComponents();

    fixture = TestBed.createComponent(RechercheMedecin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
