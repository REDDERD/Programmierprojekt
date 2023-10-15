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

  it('should correctly process a CSV file', (done) => {
    const mockFile = createMockCSVFile(numerical3D)
    service.dataTo2DArray(mockFile).then(result => {
      const expectedData = convertToExpectedFormat(numerical3D)
      expect(result).toEqual(expectedData)
      done()
    }).catch(error => {
      fail(`Expected to process CSV, but got error: ${error}`)
      done()
    })
  })

  it('should correctly process an Excel file', (done) => {
    const mockFile = createMockExcelFile(numerical3D)
    service.dataTo2DArray(mockFile).then(result => {
      const expectedData = convertToExpectedFormat(numerical3D)
      expect(result).toEqual(expectedData)
      done()
    }).catch(error => {
      fail(`Expected to process Excel, but got error: ${error}`)
      done()
    })
  })
})

function createMockCSVFile (data: Array<Array<string | number>>): File {
  const csvString = data.map(row => row.join(',')).join('\n')
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
