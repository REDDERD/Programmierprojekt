import { TestBed } from '@angular/core/testing';

import { KMeansLocalService } from './k-means-local.service';

describe('KmeansLocalService', () => {
  let service: KMeansLocalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KMeansLocalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
