import {AfterViewInit, Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ResponseInterface} from "../../../interfaces/response-interface";
import {MockDaten} from "../chart/mock-daten";

interface tableDatasetInterface{
  name: string;
  x: number;
  y: number;
  children?: tableDatasetInterface[]
}
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements AfterViewInit, OnChanges {
  @Input() KmeansResult: ResponseInterface | undefined
  tableDataRaw: ResponseInterface = MockDaten;
  tableData: tableDatasetInterface[] = [];

  ngAfterViewInit (): void {
    this.fillTableData();
    console.log(this.tableData);

  }

  ngOnChanges (changes: SimpleChanges): void {
    if (changes['KmeansResult'].currentValue !== undefined) {
      if (this.KmeansResult != null) {
        this.tableDataRaw = this.KmeansResult;
        this.fillTableData();
        console.log(this.tableData);
      }
      this.tableData = [];
    }
  }

  fillTableData(): void{
    this.tableData = [];

    this.tableDataRaw.cluster.map(cluster =>{

     const dataset: tableDatasetInterface = {
       name: 'Cluster' + (cluster.clusterNr + 1),
       x: cluster.centroid.x,
       y: cluster.centroid.y,
       children: []
     }
     cluster.points.map(point =>{
       const pointData: tableDatasetInterface ={
         name: 'point',
         x: point.x,
         y: point.y
       };
       dataset.children?.push(pointData)
     })
       this.tableData.push(dataset)
    })

  }

}
