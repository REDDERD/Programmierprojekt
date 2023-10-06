import { Injectable } from '@angular/core'
import * as xlsx from 'node-xlsx'

@Injectable({
  providedIn: 'root'
})
export class ExcelTo2DArrayService {
  async excelTo2DArray (file: File): Promise<string[][]> {
    return await new Promise<string[][]>((resolve, reject) => {
      const fileReader = new FileReader()

      fileReader.onload = (event) => {
        try {
          const buffer = event.target?.result as ArrayBuffer
          const data = xlsx.parse(buffer) // Dies gibt ein Array von Arbeitsblättern zurück
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          if (data && data.length > 0 && data[0]?.data) {
            resolve(data[0].data as string[][])
          } else {
            reject(new Error('No data found in the Excel file.'))
          }
        } catch (error) {
          reject(new Error('Failed to parse the Excel file.'))
        }
      }

      fileReader.onerror = () => {
        reject(new Error('Failed to read the file.'))
      }

      fileReader.readAsArrayBuffer(file)
    })
  }
}
