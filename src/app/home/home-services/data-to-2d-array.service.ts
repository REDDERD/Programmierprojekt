import { Injectable } from '@angular/core'
import * as xlsx from 'node-xlsx'

@Injectable({
  providedIn: 'root'
})

export class DataTo2dArrayService {
  async dataTo2DArray (file: File): Promise<string[][]> {
    const fileExtension = file.name.split('.').pop()?.toLowerCase()

    if (fileExtension === 'csv') {
      return await this.csvTo2DArray(file)
    } else if (fileExtension === 'xlsx') {
      return await this.excelTo2DArray(file)
    } else {
      throw new Error('Unsupported file format')
    }
  }

  private async excelTo2DArray (file: File): Promise<string[][]> {
    return await new Promise<string[][]>((resolve, reject) => {
      const fileReader = new FileReader()

      fileReader.onload = (event) => {
        try {
          const buffer = event.target?.result as ArrayBuffer
          const data = xlsx.parse(buffer) // Dies gibt ein Array von Arbeitsblättern zurück

          if (data !== null && data !== undefined && data.length > 0 && data[0]?.data !== null && data[0]?.data !== undefined) {
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

  private async csvTo2DArray (file: File): Promise<string[][]> {
    return await new Promise<string[][]>((resolve, reject) => {
      const fileReader = new FileReader()

      fileReader.onload = () => {
        try {
          const content = fileReader.result as string
          const delimiter = this.detectDelimiter(content)
          const rows = content.split(/\r\n|\n|\r/)
          const data = rows.map(row => row.split(delimiter))
          resolve(data)
        } catch (error) {
          reject(new Error('Failed to process the CSV file.'))
        }
      }

      fileReader.onerror = () => {
        reject(new Error('Failed to read the CSV file.'))
      }

      fileReader.readAsText(file)
    })
  }

  private detectDelimiter (csvData: string): string {
    // List of potential delimiters
    const potentialDelimiters = [',', ';', '\t', '|']
    // Split the content into lines and take the first 10 lines
    const lines = csvData.split(/\r\n|\n|\r/).slice(0, 10)

    let bestDelimiter = ''
    let bestDelimiterCount = 0

    for (const delimiter of potentialDelimiters) {
      let currentDelimiterCount = 0
      const counts = []

      // Count how often the current delimiter appears in each line
      for (const line of lines) {
        const count = (line.match(new RegExp(delimiter, 'g')) ?? []).length
        counts.push(count)
        currentDelimiterCount += count
      }

      // Check if the delimiter appears the same number of times in each line
      const uniqueCounts = new Set(counts)
      if (uniqueCounts.size === 1 && currentDelimiterCount > bestDelimiterCount) {
        bestDelimiter = delimiter
        bestDelimiterCount = currentDelimiterCount
      }
    }

    // If no suitable delimiter is found, throw an error
    if (bestDelimiter === '') {
      console.error('Unable to detect a suitable delimiter for the CSV data.')
    }

    return bestDelimiter
  }
}
