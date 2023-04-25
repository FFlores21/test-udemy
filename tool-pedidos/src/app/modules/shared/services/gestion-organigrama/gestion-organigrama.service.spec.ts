import { TestBed } from '@angular/core/testing';

import { GestionOrganigramaService } from './gestion-organigrama.service';

describe('GestionOrganigramaService', () => {
  let service: GestionOrganigramaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionOrganigramaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
