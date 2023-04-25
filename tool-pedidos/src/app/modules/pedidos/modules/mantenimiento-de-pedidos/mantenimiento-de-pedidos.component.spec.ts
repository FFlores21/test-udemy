import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoDePedidosComponent } from './mantenimiento-de-pedidos.component';

describe('MantenimientoDePedidosComponent', () => {
  let component: MantenimientoDePedidosComponent;
  let fixture: ComponentFixture<MantenimientoDePedidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MantenimientoDePedidosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantenimientoDePedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
