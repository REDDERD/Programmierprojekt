import { TestBed } from '@angular/core/testing'

import { DataTo2dArrayService } from './data-to-2d-array.service'

describe('CsvTo2DArrayService', () => {
  let service: DataTo2dArrayService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(DataTo2dArrayService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
