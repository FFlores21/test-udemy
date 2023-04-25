import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';
import { WEB_SERVICE } from 'src/app/config/config';
import { AlertaService } from 'src/app/services/alertas/alerta.service';
import {
  Proveedor,
  Pedido,
  EstadosPedido,
} from '../modules/creacion-pedidos/interfaces/creacion-pedidos.interfaces';

@Injectable({
  providedIn: 'root',
})
export class CreacionPedidoService {
  constructor(private http: HttpClient, private alerta: AlertaService) {}

  getProveedores(): Observable<Proveedor[]> {
    type res = {
      ok: boolean;
      proveedores: Proveedor[];
    };
    const url = `${WEB_SERVICE}creacion-pedidos/proveedores`;
    return this.http.get<res>(url).pipe(
      map(resp => {
        return resp.proveedores ?? [];
      }),
      catchError(err => {
        console.log('Error: ', err);
        this.alerta.showError(err.message);
        throw new Error(err.error.message);
      })
    );
  }

  getEstadosPedido(): Observable<EstadosPedido[]> {
    type res = {
      ok: boolean;
      estadospedido: EstadosPedido[];
    };
    const url = `${WEB_SERVICE}creacion-pedidos/estadospedido`;
    return this.http.get<res>(url).pipe(
      map(resp => {
        return resp.estadospedido ?? [];
      }),
      catchError(err => {
        console.log('Error:', err);
        this.alerta.showError(err.message);
        throw false;
      })
    );
  }

  getPedidos(proveedor: string): Observable<Pedido[]> {
    type res = {
      ok: boolean;
      pedidos: Pedido[];
    };
    const url = `${WEB_SERVICE}creacion-pedidos/pedidos/${proveedor}`;
    return this.http.get<res>(url).pipe(
      map(resp => {
        return resp.pedidos ?? [];
      }),
      catchError(err => {
        console.log('Error:', err);
        this.alerta.showError(err.message);
        throw false;
      })
    );
  }

  createPedido(
    pedido: string | undefined,
    proveedor: string,
    estado: string,
    secuencia: boolean
  ): Observable<res> {

    const body = {
      pedido,
      proveedor,
      estado,
      secuencia,
    };
    const url = `${WEB_SERVICE}creacion-pedidos/createpedido`;
    return this.http.post<res>(url, body).pipe(
      map((resp: res) => {
        return resp;
      }),
      catchError(err => {
        console.log('Error:', err);
        this.alerta.showError(err.message);
        throw false;
      })
    );
  }
}
type res = { ok: boolean; createPedido: boolean };
