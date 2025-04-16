/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GovernorateFormComponent } from './governorate-form.component';

describe('GovernorateFormComponent', () => {
  let component: GovernorateFormComponent;
  let fixture: ComponentFixture<GovernorateFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GovernorateFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GovernorateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
