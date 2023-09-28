import {AfterViewInit, Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Chart} from "chart.js/auto";
import {Points, ResponseInterface} from "../../../interfaces/response-interface";
import {CentroidDatesetInterface, ChartDatasetInterface} from "../../../interfaces/chartDataset-interface";
import {MockDaten} from "./mock-daten";

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements AfterViewInit, OnChanges{
  public chart: any;
  chartData: ResponseInterface = MockDaten
  datasets: Array<ChartDatasetInterface> = [];
  @Input() apiResponse: ResponseInterface | undefined;

  ngAfterViewInit() {
    this.renderChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['apiResponse'].currentValue != undefined){
      if(this.apiResponse){
        this.datasets = [];
        this.chartData = this.apiResponse;
      }
      this.chart.destroy()
      this.renderChart()
    }
  }

  generateDatasets() {
    let centroids: Array<Points> = [];
    let clusterArray: Array<ChartDatasetInterface> = [];
    this.chartData.cluster.map(cluster => {
      let dataset: ChartDatasetInterface = {
        label: "Cluster " + (cluster.clusterNr + 1),
        data: cluster.points
      }
      centroids.push(cluster.centroid)
      clusterArray.push(dataset)
    })
    const centroidDataset: CentroidDatesetInterface = {
      label: "Centroids",
      data: centroids,
      pointStyle: "rectRot",
      radius: 10
    }
    this.datasets.push(centroidDataset)
    clusterArray.map(cluster => {
      this.datasets.push(cluster);
    })
  }

  renderChart(){
    this.generateDatasets()
    var image: string;
    this.chart = new Chart("Chart", {
      type: 'scatter', //this denotes tha type of chart

      data: {
        datasets: this.datasets
      },
      options: {
        aspectRatio:1,
        animation: {
          onComplete: function () {
            image = this.toBase64Image();
            var a: HTMLAnchorElement = <HTMLAnchorElement>document.getElementById('chartDownload');
            a.href = this.toBase64Image();
            a.download = 'chart.png';
          },
        },
        plugins: {
          title: {
            display: true,
            text: this.chartData.name
          },
        },
        scales: {
          y: {
            title: {
              display: true,
              text: this.chartData.y_label
            }
          },
          x: {
            title: {
              display: true,
              text: this.chartData.x_label
            }
          }
        }
      }
    });
  }
}
