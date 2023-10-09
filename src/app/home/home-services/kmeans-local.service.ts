import { Injectable } from '@angular/core'
import { kmeans as KMeans } from 'ml-kmeans'
import { ResponseInterface } from '../../interfaces/response-interface'
import { DataTo2dArrayService } from './data-to-2d-array.service'

@Injectable({
  providedIn: 'root'
})
export class KmeansLocalService {
  data: string[][] = []
  clusters: any[] = []

  private euclideanDistance (pointA: number[], pointB: number[]): number {
    return Math.sqrt(pointA.reduce((sum, value, index) => sum + Math.pow(value - pointB[index], 2), 0))
  }

  private manhattanDistance (pointA: number[], pointB: number[]): number {
    return pointA.reduce((sum, value, index) => sum + Math.abs(value - pointB[index]), 0)
  }

  private elbowMethod (data: number[][], maxClusters: number, distanceMetric: string): number {
    const ssd: number[] = [] // Sum of Squared Distances for different cluster numbers

    const distanceFunction = distanceMetric === 'EUCLIDEAN' ? this.euclideanDistance : this.manhattanDistance

    for (let i = 1; i <= maxClusters; i++) {
      const result = KMeans(data, i, { distanceFunction })
      let currentSSD = 0
      for (let j = 0; j < data.length; j++) {
        const centroid = result.centroids[result.clusters[j]]
        currentSSD += distanceFunction(data[j], centroid) ** 2
      }
      ssd.push(currentSSD)
    }
    // Calculate the rate of change of SSD (first derivative)
    const ratesOfChange = ssd.slice(1).map((value, index) => ssd[index] - value)
    // Calculate the second derivative
    const secondDerivative = ratesOfChange.slice(1).map((value, index) => ratesOfChange[index] - value)
    // Find the index of the maximum value in the second derivative
    const elbowPoint = secondDerivative.indexOf(Math.max(...secondDerivative))
    // Convert SSD values to an array of x and y coordinates
    // const coordinates = ssd.map((value, index) => ({ x: index + 1, y: value }))

    // Return the optimal number of clusters
    return elbowPoint + 2 // +2 because the index is 0-based and we started from k=1
  }

  private cleanClusteringData (dataAsNumbers: number[][]): number[][] {
    // Filter out all invalid arrays
    const filteredData = dataAsNumbers.filter(row => {
      return row.every(value => typeof value === 'number' && !isNaN(value))
    })
    // Check if more than 25% of the arrays have been removed
    if (filteredData.length < dataAsNumbers.length * 0.75) {
      throw new Error('Mehr als 25% der Daten sind ungültig.')
    }
    return filteredData
  }

  async performKMeans (file: File, k: number, useOptK: boolean, distanceMetric: string, selectedIndices: number[]): Promise<ResponseInterface> {
    this.data = await this.dataTo2DArrayService.dataTo2DArray(file)
    this.data = this.data.map(row => { return selectedIndices.map(index => row[index]) })
    this.data = this.data.filter(row => row.some(value => value !== undefined && value !== ''))
    let dataAsNumbers = this.data.slice(1)
      .map(row => row.map(value => parseFloat(value)))
      .filter(row => row.length === this.data[1].length)
    dataAsNumbers = this.cleanClusteringData(dataAsNumbers)
    if (useOptK) {
      k = this.elbowMethod(dataAsNumbers, 100, distanceMetric)
    }

    const result = KMeans(dataAsNumbers, k, {
      distanceFunction: distanceMetric === 'EUCLIDEAN' ? this.euclideanDistance : this.manhattanDistance
    })

    return this.convertToJSONFormat(result, dataAsNumbers, file.name, distanceMetric)
  }

  private convertToJSONFormat (result: any, data: number[][], fileName: string, distanceMetric: string): ResponseInterface {
    if (this.data.length === 0 || this.data[0].length < 2) {
      console.error('Invalid CSV data format')
    }

    const xLabel = this.data[0][0]
    const yLabel = this.data[0][1]

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

  constructor (
    private dataTo2DArrayService: DataTo2dArrayService
  ) {}
}
