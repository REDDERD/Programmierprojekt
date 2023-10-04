import { TestBed } from '@angular/core/testing'

import { CsvTo2DArrayService } from './csv-to-2-d-array.service'

describe('CsvTo2DArrayService', () => {
  let service: CsvTo2DArrayService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(CsvTo2DArrayService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
