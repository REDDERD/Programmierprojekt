import { type ComponentFixture, TestBed } from '@angular/core/testing'

import { ChartContainerComponent } from './chart-container.component'
import { ChartComponent } from './chart/chart.component'
import { MatTabsModule } from '@angular/material/tabs'
import { TableComponent } from './table/table.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatTableModule } from '@angular/material/table'

describe('ChartContainerComponent', () => {
  let component: ChartContainerComponent
  let fixture: ComponentFixture<ChartContainerComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ChartContainerComponent,
        ChartComponent,
        TableComponent
      ],
      imports: [
        MatTabsModule,
        BrowserAnimationsModule,
        MatTableModule
      ]
    })
    fixture = TestBed.createComponent(ChartContainerComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
