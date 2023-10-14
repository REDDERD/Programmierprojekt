import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core'
import { ResponseInterface } from '../../../interfaces/response-interface'
import { EmptyChart } from '../chart/empty-chart'
import { FlatTreeControl } from '@angular/cdk/tree'
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree'
import { FlatTableDataset, TableDatasetInterface } from '../../../interfaces/tableDataset-interface'

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements AfterViewInit, OnChanges {
  @Input() kmeansResult: ResponseInterface | undefined
  tableDataRaw: ResponseInterface = EmptyChart
  tableData: TableDatasetInterface[] = []

  displayedColumns: string[] = ['name', 'x', 'y']

  private transformer = (node: TableDatasetInterface, level: number): any => {
    return {
      expandable: !(node.children == null) && node.children.length > 0,
      name: node.name,
      x: node.x,
      y: node.y,
      level
    }
  }

  treeControl = new FlatTreeControl<FlatTableDataset>(
    node => node.level, node => node.expandable)

  treeFlattener = new MatTreeFlattener(
    this.transformer, node => node.level,
    node => node.expandable, node => node.children)

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener)

  ngAfterViewInit (): void {
    this.fillTableData()
    this.dataSource.data = this.tableData
  }

  ngOnChanges (changes: SimpleChanges): void {
    if (changes['kmeansResult'].currentValue !== undefined) {
      if (this.kmeansResult != null) {
        this.tableDataRaw = this.kmeansResult
        this.fillTableData()
        this.dataSource.data = this.tableData
      } else {
        this.tableData = []
        this.dataSource.data = this.tableData
      }
    }
  }

  fillTableData (): void {
    this.tableData = []

    this.tableDataRaw.cluster.map(cluster => {
      const dataset: TableDatasetInterface = {
        name: 'Centroid ' + (cluster.clusterNr + 1),
        x: cluster.centroid.x,
        y: cluster.centroid.y,
        children: []
      }
      cluster.points.map(point => {
        const pointData: TableDatasetInterface = {
          name: 'point',
          x: point.x,
          y: point.y
        }
        dataset.children?.push(pointData)
        return null
      })
      this.tableData.push(dataset)
      return null
    })
  }
}
