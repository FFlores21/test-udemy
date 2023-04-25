import { TestBed } from '@angular/core/testing';

import { OrganigramaFunctionsService } from './organigrama-functions.service';

describe('OrganigramaFunctionsService', () => {
  let service: OrganigramaFunctionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrganigramaFunctionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
