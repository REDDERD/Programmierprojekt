import { TestBed } from '@angular/core/testing';

import { KmeansLocalService } from './kmeans.local.service';

describe('KmeansLocalService', () => {
  let service: KmeansLocalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KmeansLocalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
