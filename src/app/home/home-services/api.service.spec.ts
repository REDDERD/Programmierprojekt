import { TestBed } from '@angular/core/testing'
import { ApiService } from './api.service'
import { HttpClientModule } from '@angular/common/http'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'

describe('ApiService', () => {
  let service: ApiService
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule
      ]
    })
    service = TestBed.inject(ApiService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should perform basic 2d api call', () => {
    const mockResponse = {}
    const mockFile = new File(['test'], 'test.csv', { type: 'text/csv' })

    service.postKmeans(mockFile, 1, 2, 3, 'euclidean', 'auto', false).subscribe(response => {
      expect(response).toEqual(mockResponse)
    })

    const req = httpMock.expectOne(request => request.url.startsWith('https://app.axellotl.de/basic/perform-2d-kmeans/'))
    expect(req.request.method).toBe('POST')
    expect(req.request.params.get('column1')).toBe('1')
    expect(req.request.params.get('column2')).toBe('2')
    expect(req.request.params.get('k_clusters')).toBe('3')
    expect(req.request.params.get('distanceMetric')).toBe('euclidean')
    expect(req.request.params.get('clusterDetermination')).toBe('auto')

    req.flush(mockResponse)
  })

  it('should perform n dimensional api call with k', () => {
    const mockResponse = {}
    const mockFile = new File(['test'], 'test.csv', { type: 'text/csv' })

    service.postKmeans(mockFile, 1, 2, 3, 'euclidean', 'auto', true).subscribe(response => {
      expect(response).toEqual(mockResponse)
    })

    const req = httpMock.expectOne(request => request.url.startsWith('https://app.axellotl.de/basic/perform-nd-kmeans/'))
    expect(req.request.method).toBe('POST')

    req.flush(mockResponse)
  })

  it('should perform n dimensional api call without k', () => {
    const mockResponse = {}
    const mockFile = new File(['test'], 'test.csv', { type: 'text/csv' })

    service.postKmeans(mockFile, 1, 2, undefined, 'euclidean', 'auto', true).subscribe(response => {
      expect(response).toEqual(mockResponse)
    })

    const req = httpMock.expectOne(request => request.url.startsWith('https://app.axellotl.de/basic/perform-nd-kmeans/'))
    expect(req.request.method).toBe('POST')

    req.flush(mockResponse)
  })
})
