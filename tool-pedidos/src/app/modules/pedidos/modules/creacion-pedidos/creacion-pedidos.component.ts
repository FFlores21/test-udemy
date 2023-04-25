import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CreacionPedidoService } from '../../services/creacion-pedido.service';
import {
  Pedido,
  Proveedor,
  EstadosPedido,
} from './interfaces/creacion-pedidos.interfaces';
import { AlertaService } from 'src/app/services/alertas/alerta.service';

@Component({
  selector: 'app-creacion-pedidos',
  templateUrl: './creacion-pedidos.component.html',
  styleUrls: ['./creacion-pedidos.component.scss'],
})
export class CreacionPedidosComponent implements OnDestroy {
  public subscripciones: { [key: string]: Subscription } = {};

  constructor(
    private creacionPedidosService: CreacionPedidoService,
    private alertaService: AlertaService
  ) {
    this.getProveedores();
    this.getEstadosPedido();
  }

  createPedidoSecuencia = true;
  displayCreate = false;

  direccion?: string;
  pais?: string;
  telefono?: string;
  numeropedido?: string;

  proveedores: Proveedor[] = [];
  selectedProveedor?: Proveedor;

  pedidos: Pedido[] = [];
  selectedPedido?: Pedido;

  estados: EstadosPedido[] = [];
  selectedEstado?: EstadosPedido | null;
  estadoDefault?: string = '';

  selectedEstados?: EstadosPedido | null;

  showDialogCreate() {
    this.displayCreate = true;
  }

  getProveedores() {
    this.subscripciones['getProveedores'] = this.creacionPedidosService
      .getProveedores()
      .subscribe(res => {
        this.proveedores = res;
      });
  }

  infoProveedor() {
    if (!this.selectedProveedor) {
      this.direccion = '';
      this.pais = '';
      this.telefono = '';
      this.pedidos = [];
      return;
    }
    const { direccion, pais, telefono } = this.selectedProveedor;

    this.direccion = direccion;
    this.pais = pais;
    this.telefono = telefono;

    this.getPedidos(this.selectedProveedor.codigoProveedor);
  }

  getPedidos(proveedor: string) {
    this.subscripciones['getPedidos'] = this.creacionPedidosService
      .getPedidos(proveedor)
      .subscribe(res => {
        this.pedidos = res;
      });
  }

  getEstadosPedido() {
    this.subscripciones['getEstadosPedido'] = this.creacionPedidosService
      .getEstadosPedido()
      .subscribe(res => {
        this.estados = res;
      });
  }

  createPedido() {
    if (!this.selectedProveedor) {
      this.alertaService.showWarning('Debe seleccionar un proveedor');
      return;
    }
    if (this.numeropedido && !isNaN(Number(this.numeropedido))) {
      this.alertaService.showWarning(
        'El numero de pedido avanzado no puede ser un numero'
      );
      return;
    }
    const { codigoProveedor } = this.selectedProveedor;

    const estado: string = !this.selectedEstado
      ? 'e'
      : this.selectedEstado.tipo;

    this.createPedidoSecuencia = !this.numeropedido?.trim();

    this.subscripciones['createPedido'] = this.creacionPedidosService
      .createPedido(
        this.numeropedido,
        codigoProveedor,
        estado,
        this.createPedidoSecuencia
      )
      .subscribe(res => {
        if (res.createPedido) {
          this.alertaService.showSuccess('Se creo el pedido correctamente');
          this.getPedidos(codigoProveedor);
          return;
        }
        this.alertaService.showWarning('Todavia hay un pedido en estado pidiendo');
      });

    this.limpiarModal();

    this.displayCreate = false;
  }

  limpiarModal() {
    this.createPedidoSecuencia = true;
    this.numeropedido = '';
    this.selectedEstado = null;
  }

  ngOnDestroy() {
    Object.keys(this.subscripciones).forEach(key => {
      try {
        this.subscripciones[key].unsubscribe();
      } catch (error) {
        console.log(error);
      }
    });
  }
}
