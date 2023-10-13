import { type ComponentFixture, TestBed } from '@angular/core/testing'

import { InputComponent } from './input.component'
import { MatFormFieldModule } from '@angular/material/form-field'
import { ChartComponent } from '../chart-container/chart/chart.component'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { HttpClientModule } from '@angular/common/http'
import { MatIconModule } from '@angular/material/icon'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatSelectModule } from '@angular/material/select'
import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ReactiveFormsModule } from '@angular/forms'
import { MatInputModule } from '@angular/material/input'

describe('InputComponent', () => {
  let component: InputComponent
  let fixture: ComponentFixture<InputComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        InputComponent,
        ChartComponent
      ],
      imports: [
        MatFormFieldModule,
        MatSnackBarModule,
        HttpClientModule,
        MatIconModule,
        MatExpansionModule,
        MatSelectModule,
        MatButtonToggleModule,
        MatSlideToggleModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatInputModule
      ]
    })
    fixture = TestBed.createComponent(InputComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
