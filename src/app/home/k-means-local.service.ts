import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class KMeansLocalService {

  csvData: string[][] = [];

  loadCsvData(csv: File): void {
    console.log(csv);
    if (csv) {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        const content = fileReader.result as string;
        this.csvData = this.csvTo2DArray(content);
        console.log(this.csvData);
      };
      fileReader.readAsText(csv);
    }
  }
  csvTo2DArray(csvData: string): string[][] {
    const rows = csvData.split('\n');
    return rows.map(row => row.split(','));
  }


  constructor() { }
}

