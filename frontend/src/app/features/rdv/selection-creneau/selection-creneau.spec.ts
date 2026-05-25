import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionCreneau } from './selection-creneau';

describe('SelectionCreneau', () => {
  let component: SelectionCreneau;
  let fixture: ComponentFixture<SelectionCreneau>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectionCreneau],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectionCreneau);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
