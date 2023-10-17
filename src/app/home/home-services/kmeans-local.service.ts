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

  // Calculates the Euclidean distance between two points.
  private euclideanDistance (pointA: number[], pointB: number[]): number {
    return Math.sqrt(pointA.reduce((sum, value, index) => sum + Math.pow(value - pointB[index], 2), 0))
  }

  // Calculates the Manhattan distance between two points.
  private manhattanDistance (pointA: number[], pointB: number[]): number {
    return pointA.reduce((sum, value, index) => sum + Math.abs(value - pointB[index]), 0)
  }

  // Determines the optimal number of clusters for KMeans clustering using the Elbow Method.
  // The Elbow Method calculates the Sum of Squared Distances (SSD) for different numbers of clusters
  // and identifies the "elbow" point where the rate of decrease sharply changes.
  private elbowMethod (data: number[][], maxClusters: number, distanceMetric: string): number {
    const ssd: number[] = [] // Sum of Squared Distances for different cluster numbers.
    const distanceFunction = distanceMetric === 'EUCLIDEAN' ? this.euclideanDistance : this.manhattanDistance

    // Iterate through potential cluster numbers up to maxClusters or the data length.
    for (let i = 1; i <= maxClusters && i < data.length; i++) {
      const result = KMeans(data, i, { distanceFunction })
      let currentSSD = 0
      // Calculate the Sum of Squared Distances (SSD) for each data point to its centroid.
      for (let j = 0; j < data.length; j++) {
        const centroid = result.centroids[result.clusters[j]]
        currentSSD += distanceFunction(data[j], centroid) ** 2
      }
      ssd.push(currentSSD)
    }
    // Calculate the rate of change of SSD (first derivative).
    const ratesOfChange = ssd.slice(1).map((value, index) => ssd[index] - value)
    // Calculate the second derivative.
    const secondDerivative = ratesOfChange.slice(1).map((value, index) => ratesOfChange[index] - value)
    // Find the index of the maximum value in the second derivative.
    const elbowPoint = secondDerivative.indexOf(Math.max(...secondDerivative))
    // Return the optimal number of clusters.
    return elbowPoint + 2 // +2 because the index is 0-based and we started from k=1
  }

  // Removes rows containing NaN values from the given 2D numerical data.
  // If more than 25% of the rows are removed due to NaN values, an error is thrown.
  private removeNaN (dataAsNumbers: number[][]): number[][] {
    // Filter out rows containing NaN values.
    const filteredData = dataAsNumbers.filter(row => {
      return row.every(value => !isNaN(value))
    })
    // Check if more than 25% of the arrays have been removed.
    if (filteredData.length < dataAsNumbers.length * 0.75) {
      throw new Error('Error processing file.')
    }
    return filteredData
  }

  // Normalize the given data using z-score normalization.
  // This method scales the data to have a mean of 0 and a standard deviation of 1.
  private normalizeData (data: number[][]): number[][] {
    // Calculate the mean for each column
    const means = data[0].map((_, colIndex) => mean(data.map(row => row[colIndex])))
    // Calculate the standard deviation for each column
    const stdDevs = data[0].map((_, colIndex) => standardDeviation(data.map(row => row[colIndex])))
    // Return the normalized data using z-score formula: (value - mean) / standardDeviation
    return data.map(row =>
      row.map((value, colIndex) =>
        (value - means[colIndex]) / stdDevs[colIndex]
      )
    )
  }

  // Apply Principal Component Analysis (PCA) to reduce the dimensionality of the given data.
  // This method projects the data into a 2D space while retaining as much variance as possible.
  private applyPCA (data: number[][]): number[][] {
    const pca = new PCA(data)
    return pca.predict(data, { nComponents: 2 }).to2DArray()
  }

  // One-hot encodes the categorical columns in the given data.
  // Numeric columns are left unchanged, while categorical columns are transformed into binary columns
  // where each unique category value becomes its own column.
  private oneHotEncode (data: string[][]): number[][] {
    const headers = data[0]
    const rows = data.slice(1)
    // Helper function to check if a value is numeric.
    const isNumeric = (value: string): boolean => !isNaN(Number(value))
    // Map to store unique values for each categorical column.
    const uniqueValuesPerColumn = new Map<number, string[]>()

    // Identify categorical columns and store their unique values.
    headers.forEach((_, colIndex) => {
      const uniqueValues = [...new Set(rows.map(row => row[colIndex]))]
      if (!uniqueValues.every(isNumeric)) {
        uniqueValuesPerColumn.set(colIndex, uniqueValues)
      }
    })
    // Convert each row to its one-hot encoded equivalent.
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

  // Performs KMeans clustering on the provided data file.
  async performKMeans (file: File, k: number, useOptK: boolean, distanceMetric: string, selectedIndices: number[]): Promise<ResponseInterface> {
    // Convert the file to a 2D array
    this.data = await this.dataTo2DArrayService.dataTo2DArray(file)
    // Filter the data based on selected indices
    this.data = this.data.map(row => { return selectedIndices.map(index => row[index]) })
    // Remove rows with undefined or empty values
    this.data = this.data.filter(row => row.some(value => value !== undefined && value !== ''))
    // One-hot encode categorical data
    let dataAsNumbers = this.oneHotEncode(this.data)
    // Remove rows with NaN values
    dataAsNumbers = this.removeNaN(dataAsNumbers)
    // Check if the data is multi-dimensional (more than 2 dimensions)
    let nDimensional = false
    if (dataAsNumbers[0].length > 2) {
      nDimensional = true
      // Normalize the data and apply Principal Component Analysis (PCA) to reduce dimensions
      dataAsNumbers = this.normalizeData(dataAsNumbers)
      dataAsNumbers = this.applyPCA(dataAsNumbers)
    }
    // If the useOptK flag is true, calculate the optimal number of clusters using the Elbow Method
    if (useOptK) {
      k = this.elbowMethod(dataAsNumbers, 100, distanceMetric)
    }
    // Perform KMeans clustering
    const result = KMeans(dataAsNumbers, k, {
      distanceFunction: distanceMetric === 'EUCLIDEAN' ? this.euclideanDistance : this.manhattanDistance
    })
    // Convert the clustering result to the desired JSON format
    return this.convertToJSONFormat(result, dataAsNumbers, file.name, distanceMetric, nDimensional)
  }

  // Converts the clustering result into a specified JSON format.
  private convertToJSONFormat (result: any, data: number[][], fileName: string, distanceMetric: string, nDimensional: boolean): ResponseInterface {
    // Check for invalid data format
    if (this.data.length === 0 || this.data[0].length < 2) {
      console.error('Invalid CSV data format')
    }
    // Determine the labels for the x and y axes
    let xLabel = this.data[0][0]
    let yLabel = this.data[0][1]
    if (nDimensional) {
      xLabel = 'PCA1'
      yLabel = 'PCA2'
    }
    // Map the clustering result to the desired format
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
    // Construct and return the final JSON response
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
