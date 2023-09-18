import {AfterViewInit, Component} from '@angular/core';
import {Chart} from "chart.js/auto";

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements AfterViewInit{
  public chart: any;
  datensatz1: Array<{}> = [{ "x": 1.2, "y": 3.4 }, { "x": 3.1, "y": 4.7 }, { "x": 4.5, "y": 2.8 }, { "x": 2.3, "y": 1.6 }, { "x": 1.8, "y": 4.2 }, { "x": 4.7, "y": 3.2 }, { "x": 3.9, "y": 1.9 }, { "x": 2.6, "y": 4.5 }, { "x": 1.5, "y": 3.1 }, { "x": 2.8, "y": 2.1 }, { "x": 4.3, "y": 3.8 }, { "x": 1.4, "y": 4.9 }, { "x": 3.7, "y": 2.7 }, { "x": 1.9, "y": 1.5 }, { "x": 4.0, "y": 4.3 }, { "x": 2.2, "y": 1.7 }, { "x": 3.4, "y": 3.5 }, { "x": 2.0, "y": 4.8 }, { "x": 1.7, "y": 2.4 }, { "x": 4.6, "y": 1.3 }, { "x": 3.3, "y": 2.2 }, { "x": 2.5, "y": 3.9 }, { "x": 4.2, "y": 4.1 }, { "x": 1.1, "y": 1.2 }, { "x": 3.0, "y": 5.0 }, { "x": 2.4, "y": 3.3 }, { "x": 4.4, "y": 2.0 }, { "x": 1.3, "y": 4.6 }, { "x": 3.6, "y": 2.3 }, { "x": 2.9, "y": 1.4 }, { "x": 4.8, "y": 3.7 }, { "x": 1.6, "y": 2.6 },{ "x": 3.5, "y": 4.4 },];
  datensatz2: Array<{}> = [  { "x": 1.7, "y": 2.8 },  { "x": 4.3, "y": 3.1 },  { "x": 2.5, "y": 1.4 },  { "x": 1.9, "y": 4.2 },  { "x": 3.6, "y": 2.3 },  { "x": 4.0, "y": 1.6 },  { "x": 2.1, "y": 3.9 },  { "x": 1.3, "y": 4.8 },  { "x": 4.7, "y": 2.0 },  { "x": 2.0, "y": 3.2 },  { "x": 3.9, "y": 4.7 },  { "x": 1.4, "y": 2.6 },  { "x": 2.8, "y": 1.1 },  { "x": 4.5, "y": 4.0 },  { "x": 3.0, "y": 2.7 },  { "x": 2.2, "y": 5.0 },  { "x": 1.1, "y": 3.4 },  { "x": 4.6, "y": 3.5 },  { "x": 3.7, "y": 1.3 },  { "x": 1.5, "y": 4.5 },  { "x": 4.2, "y": 1.9 },  { "x": 3.3, "y": 2.9 },  { "x": 2.4, "y": 4.3 },  { "x": 1.6, "y": 3.8 },  { "x": 4.4, "y": 2.4 },  { "x": 2.7, "y": 1.5 },  { "x": 3.4, "y": 4.6 },  { "x": 1.2, "y": 2.1 },  { "x": 4.1, "y": 3.0 },  { "x": 3.5, "y": 1.7 },  { "x": 2.3, "y": 5.0 }];

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
        aspectRatio:1,
      }
    });
  }
}
