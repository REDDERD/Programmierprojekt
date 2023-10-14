import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TableComponent } from './table.component'
import { MatTableModule } from '@angular/material/table'
import { SimpleChange, SimpleChanges } from '@angular/core'
import { MatIconModule } from '@angular/material/icon'

describe('TableComponent', () => {
  let component: TableComponent
  let fixture: ComponentFixture<TableComponent>
  let changes: SimpleChanges
  const testTableDataRaw = {
    user_id: 0,
    request_id: 0,
    name: 'cooles cluster',
    cluster: [
      {
        clusterNr: 0,
        centroid: {
          x: 1,
          y: 1
        },
        points: [
          {
            x: 0,
            y: 0
          },
          {
            x: 1,
            y: 1
          },
          {
            x: 2,
            y: 2
          }
        ]
      },
      {
        clusterNr: 1,
        centroid: {
          x: 4,
          y: 4
        },
        points: [
          {
            x: 3,
            y: 3
          },
          {
            x: 4,
            y: 4
          },
          {
            x: 5,
            y: 5
          }
        ]
      }
    ],
    x_label: '',
    y_label: '',
    iterations: 4,
    used_distance_metric: 'EUCLIDEAN',
    k_value: 4
  }
  const testTableDataArray = [
    {
      name: '1',
      x: 0,
      y: 0
    },
    {
      name: '2',
      x: 1,
      y: 1
    }
  ]
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TableComponent
      ],
      imports: [
        MatTableModule,
        MatIconModule
      ]
    })
    changes = {
      kmeansResult: new SimpleChange(null, '2', true)
    }
    fixture = TestBed.createComponent(TableComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should fill the Table Data', () => {
    component.tableData = []
    component.tableDataRaw = testTableDataRaw
    component.fillTableData()
    expect(component.tableData.length).toEqual(2)
  })

  it('should call fillTableData() on ngOnChanges', () => {
    component.kmeansResult = testTableDataRaw
    const fillDataTableSpy = spyOn(component, 'fillTableData')
    component.ngOnChanges(changes)
    expect(fillDataTableSpy).toHaveBeenCalled()
  })

  it('should not call fillTableData() on ngOnChanges', () => {
    component.tableData = testTableDataArray
    const fillDataTableSpy = spyOn(component, 'fillTableData')
    component.ngOnChanges(changes)
    expect(fillDataTableSpy).toHaveBeenCalledTimes(0)
    expect(component.tableData).toEqual([])
  })

  it('should call fillTableData() on ngAfterViewInit', () => {
    component.tableData = testTableDataArray
    const fillDataTableSpy = spyOn(component, 'fillTableData')
    component.ngAfterViewInit()
    expect(fillDataTableSpy).toHaveBeenCalled()
    expect(component.dataSource.data).toEqual(testTableDataArray)
  })
})
