import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class CsvTo2DArrayService {
  csvTo2DArray (csvData: string): string[][] {
    const rows = csvData.split(/\r\n|\n|\r/)
    return rows.map(row => row.split(','))
  }
}
