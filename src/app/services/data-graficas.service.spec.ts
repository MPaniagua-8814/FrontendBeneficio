import { TestBed } from '@angular/core/testing';

import { DataGraficasService } from './data-graficas.service';

describe('DataGraficasService', () => {
  let service: DataGraficasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataGraficasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
