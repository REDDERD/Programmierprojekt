import {AfterViewInit, Component} from '@angular/core';
import {Chart} from "chart.js/auto";

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements AfterViewInit{
  public chart: any;
  datensatz1: Array<{}> = [{x: 1, y: 2},{x: 2, y: 5}, {x: 1, y: 3},{x: 1.5, y: 4}];
  datensatz2: Array<{}> = [{x: 1.5, y: 5},{x: 1, y: 2}, {x: 2, y: 1},{x: 2.5, y: 3}];

  ngAfterViewInit() {
    this.renderChart();
  }

  renderChart(){
    this.chart = new Chart("Chart", {
      type: 'scatter', //this denotes tha type of chart

      data: {
        datasets: [
          {
            label: 'test1',
            data: this.datensatz1
          },
          {
            label: 'test2',
            data: this.datensatz2
          },

        ]
      },
      options: {
        aspectRatio:2.5
      }
    });
  }
}
