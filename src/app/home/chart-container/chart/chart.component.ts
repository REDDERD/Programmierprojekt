import { type AfterViewInit, Component, Input, type OnChanges, type SimpleChanges } from '@angular/core'
import { Chart } from 'chart.js/auto'
import { type Points, type ResponseInterface } from '../../../interfaces/response-interface'
import { type CentroidDatesetInterface, type ChartDatasetInterface } from '../../../interfaces/chartDataset-interface'
import { MockDaten } from './mock-daten'

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements AfterViewInit, OnChanges {
  public chart: any
  chartData: ResponseInterface = MockDaten
  datasets: ChartDatasetInterface[] = []
  @Input() kmeansResult: ResponseInterface | undefined

  ngAfterViewInit (): void {
    this.renderChart()
  }

  ngOnChanges (changes: SimpleChanges): void {
    if (changes['kmeansResult'].currentValue !== undefined) {
      if (this.kmeansResult != null) {
        this.datasets = []
        this.chartData = this.kmeansResult
      }
      this.chart.destroy()
      this.renderChart()
    }
  }

  generateDatasets (): void {
    const centroids: Points[] = []
    const clusterArray: ChartDatasetInterface[] = []
    // eslint-disable-next-line array-callback-return
    this.chartData.cluster.map(cluster => {
      const dataset: ChartDatasetInterface = {
        label: 'Cluster ' + (cluster.clusterNr + 1),
        data: cluster.points
      }
      centroids.push(cluster.centroid)
      clusterArray.push(dataset)
    })
    const centroidDataset: CentroidDatesetInterface = {
      label: 'Centroids',
      data: centroids,
      pointStyle: 'rectRot',
      radius: 10
    }
    this.datasets.push(centroidDataset)
    // eslint-disable-next-line array-callback-return
    clusterArray.map(cluster => {
      this.datasets.push(cluster)
    })
  }

  renderChart (): void {
    this.generateDatasets()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let image: string
    this.chart = new Chart('Chart', {
      type: 'scatter', // this denotes tha type of chart

      data: {
        datasets: this.datasets
      },
      options: {
        aspectRatio: 1,
        animation: {
          onComplete: function () {
            image = this.toBase64Image()
            const a: HTMLAnchorElement = document.getElementById('chartDownload') as HTMLAnchorElement
            a.href = this.toBase64Image()
            a.download = 'chart.png'
          }
        },
        plugins: {
          title: {
            display: true,
            text: this.chartData.name
          }
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
    })
  }
}
