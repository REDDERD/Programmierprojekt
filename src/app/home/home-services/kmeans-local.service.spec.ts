import { TestBed } from '@angular/core/testing'

import { KmeansLocalService } from './kmeans-local.service'

describe('KmeansLocalService', () => {
  let service: KmeansLocalService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(KmeansLocalService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should return the specified number of clusters and euclidian distance for 2D numerical data', async () => {
    const file = createMockFile(numerical2D)
    const k = 2
    const indices = [0, 1]
    const result = await service.performKMeans(file, k, false, 'EUCLIDEAN', indices)
    expect(result.cluster.length).toEqual(k)
    expect(result.used_distance_metric).toEqual('EUCLIDEAN')
  })

  it('should return 2 clusters using Elbow-Method using 2D numerical data', async () => {
    const file = createMockFile(numerical2D)
    const k = 0
    const indices = [0, 1]
    const result = await service.performKMeans(file, k, true, 'EUCLIDEAN', indices)
    expect(result.cluster.length).toEqual(2)
  })

  it('should return the specified number of clusters and manhattan distance using 2D categorical data', async () => {
    const file = createMockFile(categorical2D)
    const k = 3
    const indices = [0, 1]
    const result = await service.performKMeans(file, k, false, 'MANHATTAN', indices)
    expect(result.cluster.length).toEqual(3)
    expect(result.used_distance_metric).toEqual('MANHATTAN')
  })

  it('should return the specified number of clusters using 3D numerical data', async () => {
    const file = createMockFile(numerical3D)
    const k = 3
    const indices = [0, 1, 2]
    const result = await service.performKMeans(file, k, false, 'EUCLIDEAN', indices)
    expect(result.cluster.length).toEqual(3)
  })
})

function createMockFile (data: Array<Array<string | number>>): File {
  const csvString = data.map(row => row.join(',')).join('\n')
  const blob = new Blob([csvString], { type: 'text/csv' })
  return new File([blob], 'data.csv', { type: 'text/csv' })
}

const numerical2D: Array<Array<string | number>> = [
  ['X', 'Y'],
  [1, 2],
  [1.5, 1.8],
  [2, 2.2],
  [8, 9],
  [8.5, 9.2],
  [7.8, 8.7]
]

const categorical2D: Array<Array<string | number>> = [
  ['X', 'Y'],
  ['red', 'circle'],
  ['red', 'square'],
  ['blue', 'circle'],
  ['blue', 'square'],
  ['green', 'circle'],
  ['green', 'square']
]

const numerical3D: Array<Array<string | number>> = [
  ['X', 'Y', 'Z'],
  [1, 2, 3],
  [1.2, 2.1, 3.1],
  [0.9, 1.9, 2.9],
  [8, 9, 10],
  [8.1, 9.1, 10.1],
  [7.9, 8.9, 9.9],
  [4, 5, 6],
  [4.1, 5.1, 6.1],
  [3.9, 4.9, 5.9]
]
