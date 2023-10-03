import {Injectable} from '@angular/core';
import {kmeans as KMeans} from 'ml-kmeans';
//import { euclidean as euclideanDistance } from 'ml-distance-euclidean';
//import { manhattan as manhattanDistance } from 'ml-distance-manhattan';
//import 'ml-distance'
@Injectable({
  providedIn: 'root'
})

export class KMeansLocalService {

  csvData: string[][] = [];
  clusters: any[] = [];

  euclideanDistance(pointA: number[], pointB: number[]): number {
    return Math.sqrt(pointA.reduce((sum, value, index) => sum + Math.pow(value - pointB[index], 2), 0));
  }

  manhattanDistance(pointA: number[], pointB: number[]): number {
    return pointA.reduce((sum, value, index) => sum + Math.abs(value - pointB[index]), 0);
  }
  performKMeans(data: number[][], numberOfClusters: number = 3, distanceFunction = this.euclideanDistance): any {
    const options = {
      distanceFunction: distanceFunction
    };
    return KMeans(data, numberOfClusters, options);
  }
  loadCsvData(csv: File): void {
    console.log(csv);
    if (csv) {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        const content = fileReader.result as string;
        this.csvData = this.csvTo2DArray(content);
        const dataAsNumbers = this.csvData.slice(1)
          .map(row => row.map(value => parseFloat(value)))
          .filter(row => row.length === this.csvData[1].length); // stellt sicher, dass alle Zeilen die gleiche Länge haben
        const result = this.performKMeans(dataAsNumbers, 3, this.euclideanDistance); // Hier nehmen wir an, dass die gewünschte Clusteranzahl 3 ist.
        console.log(result)
        this.clusters = result.clusters;
        const resultJSON = this.convertToJSONFormat(result,dataAsNumbers, 'test', 'EUCLIDEAN', 0, 0);
        console.log(resultJSON);
      };
      fileReader.readAsText(csv);
    }
  }
  csvTo2DArray(csvData: string): string[][] {
    const rows = csvData.split('\n');
    return rows.map(row => row.split(','));
  }


  convertToJSONFormat(result: any, data: number[][], fileName: string, distanceMetric: string, silhouetteScore: number, daviesBouldinIndex: number): any {
    if (!this.csvData || this.csvData.length === 0 || this.csvData[0].length < 2) {
      console.error("Invalid CSV data format");
      return;
    }

    const xLabel = this.csvData[0][0];
    const yLabel = this.csvData[0][1];

    const clusters = result.centroids.map((centroid: number[], index: number) => {
      const points = data.filter((_, dataIndex) => result.clusters[dataIndex] === index);
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
      };
    });

    return {
      name: `K-Means Ergebnis von: ${fileName}`,
      cluster: clusters,
      x_label: xLabel,
      y_label: yLabel,
      iterations: result.iterations,
      distance_metric: distanceMetric,
      silhouette_score: silhouetteScore,
      davies_bouldin_index: daviesBouldinIndex
    };
  }



  constructor() { }
}

