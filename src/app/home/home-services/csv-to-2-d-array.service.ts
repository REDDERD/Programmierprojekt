import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class CsvTo2DArrayService {
  detectDelimiter (csvData: string): string {
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

  csvTo2DArray2 (csvData: string): string[][] {
    const delimiter = this.detectDelimiter(csvData)
    const rows = csvData.split(/\r\n|\n|\r/)
    return rows.map(row => row.split(delimiter))
  }

  async csvTo2DArray (file: File): Promise<string[][]> {
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
}
