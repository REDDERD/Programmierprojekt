import { TestBed } from '@angular/core/testing'
import * as xlsx from 'node-xlsx'
import { DataTo2dArrayService } from './data-to-2d-array.service'

describe('DataTo2DArrayService', () => {
  let service: DataTo2dArrayService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(DataTo2dArrayService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should correctly process CSV data with various delimiters', async () => {
    const delimiters = [',', ';', '\t', '|']

    for (const delimiter of delimiters) {
      const mockFile = createMockCSVFile(numerical3D, delimiter)
      const result = await service.dataTo2DArray(mockFile)
      expect(result).toEqual(convertToExpectedFormat(numerical3D))
    }
  })

  it('should throw an error for empty CSV file', async () => {
    const file = createMockCSVFile([['']], ',')
    try {
      await service.dataTo2DArray(file)
      fail('Service should throw an error for empty CSV file')
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe('File is empty')
      } else {
        fail('Caught exception is not an instance of Error')
      }
    }
  })

  it('should throw an error for not supported delimiter', async () => {
    const file = createMockCSVFile(numerical3D, '-')
    try {
      await service.dataTo2DArray(file)
      fail('Service should throw an error for wrong delimiter')
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe('Unable to detect a suitable delimiter for the CSV data.')
      } else {
        fail('Caught exception is not an instance of Error')
      }
    }
  })

  it('should correctly process Excel data with various delimiters', async () => {
    const file = createMockExcelFile(numerical3D)
    const result = await service.dataTo2DArray(file)
    expect(result).toEqual(convertToExpectedFormat(numerical3D))
  })

  it('should throw an error for empty Excel file', async () => {
    // Erstellen einer leeren Excel-Datei
    const file = createMockExcelFile([['']])

    try {
      await service.dataTo2DArray(file)
      fail('Service should throw an error for empty Excel file')
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe('File is empty')
      } else {
        fail('Caught exception is not an instance of Error')
      }
    }
  })
})

function createMockCSVFile (data: Array<Array<string | number>>, delimiter: string): File {
  const csvString = data.map(row => row.join(delimiter)).join('\n')
  const blob = new Blob([csvString], { type: 'text/csv' })
  return new File([blob], 'data.csv', { type: 'text/csv' })
}

function createMockExcelFile (data: Array<Array<string | number>>): File {
  data = data.map(row => row.map(item => item.toString()))
  const worksheet = {
    name: 'Sheet1',
    data,
    options: {
      '!cols': Array(data[0].length).fill({ wch: 20 }) // Setzt die Spaltenbreite für jede Spalte
    }
  }
  const buffer = xlsx.build([worksheet])
  console.log(xlsx.parse(buffer))
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  return new File([blob], 'mock.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
}

function convertToExpectedFormat (data: Array<Array<string | number>>): string[][] {
  return data.map(row => row.map(item => item.toString()))
}

const numerical3D: Array<Array<string | number>> = [
  ['X', 'Y', 'Z'],
  [1, 2, 2],
  [1.2, 2.1, 3.1],
  [0.9, 1.9, 2.9],
  [8, 9, 10],
  [8.1, 9.1, 10.1],
  [7.9, 8.9, 9.9],
  [4, 5, 6],
  [4.1, 5.1, 6.1],
  [3.9, 4.9, 5.9]
]
