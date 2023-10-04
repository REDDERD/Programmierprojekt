import {AfterViewInit, Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ResponseInterface} from "../../../interfaces/response-interface";
import {MockDaten} from "../chart/mock-daten";
import {FlatTreeControl} from "@angular/cdk/tree";
import {MatTreeFlatDataSource, MatTreeFlattener} from "@angular/material/tree";

interface tableDatasetInterface{
  name: string;
  x: number;
  y: number;
  children?: tableDatasetInterface[]
}

interface flatTableDataset{
  expandable: boolean;
  name: string;
  x: number;
  y: number;
  level: number;
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

  displayedColumns: string[] = ['name', 'x', 'y'];

  private transformer = (node: tableDatasetInterface, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      x: node.x,
      y: node.y,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<flatTableDataset>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this.transformer, node => node.level,
    node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: flatTableDataset) => node.expandable;

  ngAfterViewInit (): void {
    this.fillTableData();
    this.dataSource.data = this.tableData;
    console.log(this.tableData);

  }

  ngOnChanges (changes: SimpleChanges): void {
    if (changes['KmeansResult'].currentValue !== undefined) {
      if (this.KmeansResult != null) {
        this.tableDataRaw = this.KmeansResult;
        this.fillTableData();
        this.dataSource.data = this.tableData;
        console.log(this.tableData);
      }
      else{
        this.tableData = [];
        this.dataSource.data = this.tableData;
      }
    }
  }

  fillTableData(): void{
    this.tableData = [];

    this.tableDataRaw.cluster.map(cluster =>{

     const dataset: tableDatasetInterface = {
       name: 'Centroid ' + (cluster.clusterNr + 1),
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
