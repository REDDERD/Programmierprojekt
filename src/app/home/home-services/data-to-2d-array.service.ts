import { Injectable } from '@angular/core'
import * as xlsx from 'node-xlsx'

@Injectable({
  providedIn: 'root'
})

export class DataTo2dArrayService {
  // Converts the provided file into a 2D array of strings.
  async dataTo2DArray (file: File): Promise<string[][]> {
    // Determine the file extension
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    // Process the file based on its extension
    if (fileExtension === 'csv') {
      return await this.csvTo2DArray(file)
    } else if (fileExtension === 'xlsx') {
      return await this.excelTo2DArray(file)
    } else {
      throw new Error('Unsupported file format')
    }
  }

  // Converts the provided Excel file into a 2D array of strings.
  private async excelTo2DArray (file: File): Promise<string[][]> {
    return await new Promise<string[][]>((resolve, reject) => {
      const fileReader = new FileReader()
      // Event handler for successful file read
      fileReader.onload = (event) => {
        try {
          // Convert the file content to an ArrayBuffer
          const buffer = event.target?.result as ArrayBuffer
          // Parse the buffer using node-xlsx library to get an array of worksheets
          const data = xlsx.parse(buffer)
          // Check if the parsed data is valid and not empty
          if (data.length > 0 && Array.isArray(data[0]?.data) && data[0].data.length > 0 && !(data[0].data.length === 1 && data[0].data[0][0] === '')) {
            resolve(data[0].data as string[][])
          } else {
            reject(new Error('File is empty'))
          }
        } catch (error) {
          // Handle any parsing errors
          if (error instanceof Error) {
            reject(new Error(error.message))
          }
        }
      }
      // Event handler for file read errors
      fileReader.onerror = () => {
        reject(new Error('Failed to process the Excel file.'))
      }
      // Start reading the file as an ArrayBuffer
      fileReader.readAsArrayBuffer(file)
    })
  }

  // Converts the content of a CSV file into a 2D array.
  private async csvTo2DArray (file: File): Promise<string[][]> {
    return await new Promise<string[][]>((resolve, reject) => {
      const fileReader = new FileReader()
      // Event handler for successful file read
      fileReader.onload = () => {
        try {
          // Convert the file content to a string
          const content = fileReader.result as string
          // Detect the delimiter used in the CSV
          const delimiter = this.detectDelimiter(content)
          // Split the content into rows and filter out any empty rows
          let rows = content.split(/\r\n|\n|\r/)
          rows = rows.filter(row => row.trim().length > 0)
          // If there are no valid rows, resolve with an empty array
          if (rows.length === 0) {
            resolve([])
            return
          }
          // Split each row into its columns based on the detected delimiter
          const data = rows.map(row => row.split(delimiter))
          // Resolve the promise with the processed data
          resolve(data)
        } catch (error) {
          if (error instanceof Error) {
            reject(new Error(error.message))
          }
        }
      }
      // Event handler for file read errors
      fileReader.onerror = () => {
        reject(new Error('Failed to process the CSV file.'))
      }
      // Start reading the file as text
      fileReader.readAsText(file)
    })
  }

  // Detects the delimiter used in a CSV string.
  // The function checks common delimiters (comma, semicolon, tab, and pipe)
  // and determines the best fit based on the consistency of its occurrence
  // in the first few lines of the CSV data.
  private detectDelimiter (csvData: string): string {
    // List of potential delimiters
    const potentialDelimiters = [',', ';', '\t', '|']
    // Split the content into lines and take the first 10 lines
    const lines = csvData.split(/\r\n|\n|\r/).slice(0, 10)

    let bestDelimiter = ''
    let bestDelimiterCount = 0

    // Iterate over each potential delimiter to determine the best fit
    for (const delimiter of potentialDelimiters) {
      let currentDelimiterCount = 0
      const counts = []

      // Count how often the current delimiter appears in each line
      for (const line of lines) {
        const count = (line.match(new RegExp('\\' + delimiter, 'g')) ?? []).length
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
      if (csvData.trim() === '') {
        throw new Error('File is empty')
      } else {
        throw new Error('Unable to detect a suitable delimiter for the CSV data.')
      }
    }
    return bestDelimiter
  }
}
