import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgForm } from './org-form';

describe('OrgForm', () => {
  let component: OrgForm;
  let fixture: ComponentFixture<OrgForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrgForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrgForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
