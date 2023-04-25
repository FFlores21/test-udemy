import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoDeFacturasProveedorComponent } from './mantenimiento-de-facturas-proveedor.component';

describe('MantenimientoDeFacturasProveedorComponent', () => {
  let component: MantenimientoDeFacturasProveedorComponent;
  let fixture: ComponentFixture<MantenimientoDeFacturasProveedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MantenimientoDeFacturasProveedorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantenimientoDeFacturasProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
