import { TestBed } from '@angular/core/testing'

import { ExcelTo2DArrayService } from './excel-to-2-d-array.service'

describe('ExcelTo2DArrayServiceService', () => {
  let service: ExcelTo2DArrayService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(ExcelTo2DArrayService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
