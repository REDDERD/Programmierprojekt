import { type ComponentFixture, TestBed } from '@angular/core/testing'

import { ChartComponent } from './chart.component'

describe('ChartComponent', () => {
  let component: ChartComponent
  let fixture: ComponentFixture<ChartComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ChartComponent
      ],
      imports: [

      ]
    })
    fixture = TestBed.createComponent(ChartComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
