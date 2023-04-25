import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreacionPedidosComponent } from './creacion-pedidos.component';

describe('CreacionPedidosComponent', () => {
  let component: CreacionPedidosComponent;
  let fixture: ComponentFixture<CreacionPedidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreacionPedidosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreacionPedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
