import { type ComponentFixture, TestBed } from '@angular/core/testing'

import { ChartContainerComponent } from './chart-container.component'
import { ChartComponent } from './chart/chart.component'

describe('ChartContainerComponent', () => {
  let component: ChartContainerComponent
  let fixture: ComponentFixture<ChartContainerComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ChartContainerComponent,
        ChartComponent
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
