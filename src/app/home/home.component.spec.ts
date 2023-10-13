import { type ComponentFixture, TestBed } from '@angular/core/testing'

import { HomeComponent } from './home.component'
import { MatSidenavModule } from '@angular/material/sidenav'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { InputComponent } from './input/input.component'
import { ChartComponent } from './chart-container/chart/chart.component'
import { MatIconModule } from '@angular/material/icon'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { HttpClientModule } from '@angular/common/http'
import { ChartContainerComponent } from './chart-container/chart-container.component'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatSelectModule } from '@angular/material/select'
import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatTabsModule } from '@angular/material/tabs'
import { TableComponent } from './chart-container/table/table.component'
import { ReactiveFormsModule } from '@angular/forms'
import { MatInputModule } from '@angular/material/input'
import { MatTableModule } from '@angular/material/table'

describe('HomeComponent', () => {
  let component: HomeComponent
  let fixture: ComponentFixture<HomeComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        HomeComponent,
        InputComponent,
        ChartComponent,
        ChartContainerComponent,
        TableComponent
      ],
      imports: [
        MatSidenavModule,
        BrowserAnimationsModule,
        MatIconModule,
        MatSnackBarModule,
        HttpClientModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatSelectModule,
        MatButtonToggleModule,
        MatSlideToggleModule,
        MatTabsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatTableModule
      ]
    })
    fixture = TestBed.createComponent(HomeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
