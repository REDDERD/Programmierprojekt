import { Injectable } from '@angular/core'
import { kmeans as KMeans } from 'ml-kmeans'
import { ResponseInterface } from '../../interfaces/response-interface'

@Injectable({
  providedIn: 'root'
})
export class KmeansLocalService {
  csvData: string[][] = []
  clusters: any[] = []

  euclideanDistance (pointA: number[], pointB: number[]): number {
    return Math.sqrt(pointA.reduce((sum, value, index) => sum + Math.pow(value - pointB[index], 2), 0))
  }

  manhattanDistance (pointA: number[], pointB: number[]): number {
    return pointA.reduce((sum, value, index) => sum + Math.abs(value - pointB[index]), 0)
  }

  async performKMeans (csv: File, k: number, distanceMetric: string): Promise<ResponseInterface> {
    return await new Promise<ResponseInterface>((resolve, reject) => {
      const fileReader = new FileReader()

      fileReader.onload = () => {
        const content = fileReader.result as string
        this.csvData = this.csvTo2DArray(content)

        const dataAsNumbers = this.csvData.slice(1)
          .map(row => row.map(value => parseFloat(value)))
          .filter(row => row.length === this.csvData[1].length)

        const result = KMeans(dataAsNumbers, k, {
          distanceFunction: distanceMetric === 'EUCLIDEAN' ? this.euclideanDistance : this.manhattanDistance
        })

        const jsonResult = this.convertToJSONFormat(result, dataAsNumbers, csv.name, distanceMetric)

        resolve(jsonResult) // Resolviere das Promise mit dem Ergebnis
      }

      fileReader.onerror = (error) => {
        reject(error) // Falls ein Fehler beim Lesen der Datei auftritt, rejecte das Promise
      }

      fileReader.readAsText(csv)
    })
  }

  csvTo2DArray (csvData: string): string[][] {
    const rows = csvData.split(/\r\n|\n|\r/)
    return rows.map(row => row.split(','))
  }

  convertToJSONFormat (result: any, data: number[][], fileName: string, distanceMetric: string): ResponseInterface {
    if (this.csvData.length === 0 || this.csvData[0].length < 2) {
      console.error('Invalid CSV data format')
    }

    const xLabel = this.csvData[0][0]
    const yLabel = this.csvData[0][1]

    const clusters = result.centroids.map((centroid: number[], index: number) => {
      const points = data.filter((_, dataIndex) => result.clusters[dataIndex] === index)
      return {
        clusterNr: index,
        centroid: {
          x: centroid[0],
          y: centroid[1]
        },
        points: points.map(point => ({
          x: point[0],
          y: point[1]
        }))
      }
    })

    return {
      user_id: 0,
      request_id: 0,
      name: `K-Means Ergebnis von: ${fileName}`,
      cluster: clusters,
      x_label: xLabel,
      y_label: yLabel,
      iterations: result.iterations,
      used_distance_metric: distanceMetric,
      used_optK_method: 'deine Mutter',
      clusters_elbow: 0,
      clusters_silhouette: 0
    }
  }

  // constructor () { }
}
