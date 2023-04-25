import { TestBed } from '@angular/core/testing';

import { GestionCargosService } from './gestion-cargos.service';

describe('GestionCargosService', () => {
  let service: GestionCargosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionCargosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
