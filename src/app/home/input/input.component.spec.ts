import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputComponent } from './input.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {ChartComponent} from "../chart-container/chart/chart.component";

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        InputComponent,
        ChartComponent
      ],
      imports: [
        MatFormFieldModule
      ]
    });
    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
