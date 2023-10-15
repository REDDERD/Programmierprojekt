import { Injectable } from '@angular/core'
import { kmeans as KMeans } from 'ml-kmeans'
import { PCA } from 'ml-pca'
import mean from 'ml-array-mean'
import standardDeviation from 'ml-array-standard-deviation'
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

    for (let i = 1; i <= maxClusters && i < data.length; i++) {
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

  private removeNaN (dataAsNumbers: number[][]): number[][] {
    // Filter out all invalid arrays
    const filteredData = dataAsNumbers.filter(row => {
      return row.every(value => !isNaN(value))
    })
    // Check if more than 25% of the arrays have been removed
    if (filteredData.length < dataAsNumbers.length * 0.75) {
      throw new Error('Error processing file.')
    }
    return filteredData
  }

  private normalizeData (data: number[][]): number[][] {
    const means = data[0].map((_, colIndex) => mean(data.map(row => row[colIndex])))
    const stdDevs = data[0].map((_, colIndex) => standardDeviation(data.map(row => row[colIndex])))

    return data.map(row =>
      row.map((value, colIndex) =>
        (value - means[colIndex]) / stdDevs[colIndex]
      )
    )
  }

  private applyPCA (data: number[][]): number[][] {
    const pca = new PCA(data)
    return pca.predict(data, { nComponents: 2 }).to2DArray()
  }

  private oneHotEncode (data: string[][]): number[][] {
    const headers = data[0]
    const rows = data.slice(1)
    const isNumeric = (value: string): boolean => !isNaN(Number(value))
    const uniqueValuesPerColumn = new Map<number, string[]>()

    headers.forEach((_, colIndex) => {
      const uniqueValues = [...new Set(rows.map(row => row[colIndex]))]
      if (!uniqueValues.every(isNumeric)) {
        uniqueValuesPerColumn.set(colIndex, uniqueValues)
      }
    })
    return rows.map(row => {
      const encodedRow: number[] = []
      row.forEach((value, colIndex) => {
        if (uniqueValuesPerColumn.has(colIndex)) {
          const uniqueValues = uniqueValuesPerColumn.get(colIndex)
          if (uniqueValues !== null && uniqueValues !== undefined) {
            const encodedValue = new Array(uniqueValues.length).fill(0)
            const valueIndex = uniqueValues.indexOf(value)
            if (valueIndex !== -1) {
              encodedValue[valueIndex] = 1
            }
            encodedRow.push(...encodedValue)
          }
        } else {
          encodedRow.push(Number(value))
        }
      })
      return encodedRow
    })
  }

  async performKMeans (file: File, k: number, useOptK: boolean, distanceMetric: string, selectedIndices: number[]): Promise<ResponseInterface> {
    this.data = await this.dataTo2DArrayService.dataTo2DArray(file)
    this.data = this.data.map(row => { return selectedIndices.map(index => row[index]) })
    this.data = this.data.filter(row => row.some(value => value !== undefined && value !== ''))
    let dataAsNumbers = this.oneHotEncode(this.data)
    dataAsNumbers = this.removeNaN(dataAsNumbers)
    let nDimensional = false
    if (dataAsNumbers[0].length > 2) {
      nDimensional = true
      dataAsNumbers = this.normalizeData(dataAsNumbers)
      dataAsNumbers = this.applyPCA(dataAsNumbers)
    }
    if (useOptK) {
      k = this.elbowMethod(dataAsNumbers, 100, distanceMetric)
    }

    const result = KMeans(dataAsNumbers, k, {
      distanceFunction: distanceMetric === 'EUCLIDEAN' ? this.euclideanDistance : this.manhattanDistance
    })
    return this.convertToJSONFormat(result, dataAsNumbers, file.name, distanceMetric, nDimensional)
  }

  private convertToJSONFormat (result: any, data: number[][], fileName: string, distanceMetric: string, nDimensional: boolean): ResponseInterface {
    if (this.data.length === 0 || this.data[0].length < 2) {
      console.error('Invalid CSV data format')
    }
    let xLabel = this.data[0][0]
    let yLabel = this.data[0][1]
    if (nDimensional) {
      xLabel = 'PCA1'
      yLabel = 'PCA2'
    }
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
      k_value: 1
    }
  }

  constructor (
    private dataTo2DArrayService: DataTo2dArrayService
  ) {}
}
