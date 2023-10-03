import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import kmeans from "kmeans-ts";




@Injectable({
  providedIn: 'root'
})

export class KMeansLocalService {

  loadCsvData(filePath: string): Observable<string[][]> {
    return this.http.get(filePath, { responseType: 'text' })
      .pipe(
        map(csvData => this.csvTo2DArray(csvData))
      );
  }

  csvTo2DArray(csvData: string): string[][] {
    console.log(csvData)
    const rows = csvData.split('\n');
    return rows.map(row => row.split(','));
  }



  test(){
    console.log("test kmeans")
    const csvFilePath = 'C:\\Users\\Klaas\\Dateien\\Eigene Dateien\\Studium\\Semester 5\\3) Programmierprojekt\\Git\\src\\app\\home\\clust-mock-data\\circles.csv';
    //const csvFileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });
   // const csvFileContent = parse(csvFilePath)
   // console.log(csvFileContent);

  }

  constructor(private http: HttpClient) { }
}

