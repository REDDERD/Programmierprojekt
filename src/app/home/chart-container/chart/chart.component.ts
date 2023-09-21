import {AfterViewInit, Component} from '@angular/core';
import {Chart, plugins} from "chart.js/auto";
import {Points, ResponseInterface} from "../../../interfaces/response-interface";
import {CentroidDatesetInterface, ChartDatasetInterface} from "../../../interfaces/chartDataset-interface";
import {MockDaten} from "./mock-daten";

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements AfterViewInit{
  public chart: any;
  MockData: ResponseInterface = MockDaten
  datasets: Array<ChartDatasetInterface> = [];

  ngAfterViewInit() {
    this.renderChart();
  }

  generateDatasets() {
    let centroids: Array<Points> = [];
    let clusterArray: Array<ChartDatasetInterface> = [];
    this.MockData.cluster.map(cluster => {
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
            text: MockDaten.name
          },
        },
        scales: {
          y: {
            title: {
              display: true,
              text: MockDaten.y_label
            }
          },
          x: {
            title: {
              display: true,
              text: MockDaten.x_label
            }
          }
        }
      }
    });
  }
}
