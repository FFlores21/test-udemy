/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-disable quotes */
/* eslint-disable valid-jsdoc */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

import {
  detallePedido,
  estadosPedido,
  pedido,
  pedidoDetalleExcellV2,
  proveedor,
} from '../interfaces/mantenimiento-pedidos.interface';
import { Header, WEB_SERVICE } from 'src/app/config/config';
import { EMPTY, Observable } from 'rxjs';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class MantenimientoPedidosService {
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  /**
   * @description Metodo utilizado para obtener listado de los proveedores
   * @returns
   */
  public getListaProveedores = (): Observable<proveedor[]> => {
    const headers = new HttpHeaders(Header);

    return this.http
      .get<proveedor[]>(`${WEB_SERVICE}pedidos/getListaProveedores`, {
        headers,
      })
      .pipe(
        map(res => {
          return res;
        }),
        catchError(err => {
          this.messageService.add({
            severity: 'error',
            summary: `Error al obtener listado de proveedores`,
          });

          console.log("SERVICE 'getListaProveedores' ERROR: ", err);

          return EMPTY;
        })
      );
  };

  /**
   * @description Metodo utilizado para obtener los datos de un proveedor.
   * @param codigoproveedor
   * @returns
   */
  public getProveedor = (codigoproveedor: string): Observable<proveedor> => {
    const headers = new HttpHeaders(Header);

    return this.http
      .get<proveedor>(`${WEB_SERVICE}pedidos/getProveedor/${codigoproveedor}`, {
        headers,
      })
      .pipe(
        map(res => {
          return res;
        }),
        catchError(err => {
          this.messageService.add({
            severity: 'error',
            summary: `Error al obtener el proveedor ${codigoproveedor}`,
          });

          console.log("SERVICE 'getProveedor' ERROR: ", err);

          return EMPTY;
        })
      );
  };

  /**
   * @description Metodo utilizado para obtener los datos de un pedido.
   * @param codigoproveedor
   * @param numeropedido
   * @returns
   */
  public getPedido = (
    codigoproveedor: string,
    numeropedido: string
  ): Observable<pedido> => {
    const headers = new HttpHeaders(Header);

    return this.http
      .get<pedido>(
        `${WEB_SERVICE}pedidos/getPedido/${codigoproveedor}/${numeropedido}`,
        { headers }
      )
      .pipe(
        map(res => {
          // ? Conversion de las fechas de tipo cadena a tipo "Date" con formato DD/MM/YYYY
          if (res.fecha) {
            res.fecha = new Date(res.fecha).toLocaleDateString();
            res.fechapedido = new Date(res.fechapedido).toLocaleDateString();
            res.fechaconfirmado = new Date(
              res.fechaconfirmado
            ).toLocaleDateString();
            res.fechaingresado = new Date(
              res.fechaingresado
            ).toLocaleDateString();
            res.pfechaingreso = new Date(
              res.pfechaingreso
            ).toLocaleDateString();
          }

          return res;
        }),
        catchError(err => {
          this.messageService.add({
            severity: 'error',
            summary: `Error al obtener el pedido ${numeropedido} con el proveedor ${codigoproveedor}`,
          });

          console.log("SERVICE 'getPedido' ERROR: ", err);

          return EMPTY;
        })
      );
  };

  /**
   * @description Metodo utilizado para obtener los detalles de un pedido.
   * @param codigoproveedor
   * @param numeropedido
   * @returns
   */
  public getPedidoDetalle = (
    codigoproveedor: string,
    numeropedido: string
  ): Observable<detallePedido[]> => {
    const headers = new HttpHeaders(Header);

    return this.http
      .get<detallePedido[]>(
        `${WEB_SERVICE}pedidos/getPedidoDetalle/${codigoproveedor}/${numeropedido}`,
        { headers }
      )
      .pipe(
        map(res => {
          return res;
        }),
        catchError(err => {
          this.messageService.add({
            severity: 'error',
            summary: `Error al obtener el detalle del pedido ${numeropedido} con el proveedor ${codigoproveedor}`,
          });

          console.log("SERVICE 'getPedidoDetalle' ERROR: ", err);

          return EMPTY;
        })
      );
  };

  /**
   * @description Metodo utilizado para obtener todos los detalles de todos los pedidos realizados a un proveedor.
   * @param codigoproveedor
   * @returns
   */
  public getAllPedidosDetalles = (
    codigoproveedor: string
  ): Observable<detallePedido[]> => {
    const headers = new HttpHeaders(Header);

    return this.http
      .get<detallePedido[]>(
        `${WEB_SERVICE}pedidos/getAllPedidosDetalles/${codigoproveedor}`,
        { headers }
      )
      .pipe(
        map(res => {
          return res;
        }),
        catchError(err => {
          this.messageService.add({
            severity: 'error',
            summary: `Error al obtener todos los detalles de pedidos del proveedor ${codigoproveedor}`,
          });

          console.log("SERVICE 'getAllPedidosDetalles' ERROR: ", err);

          return EMPTY;
        })
      );
  };

  /**
   * @description Metodo utilizado para obtener los datos del detalle de pedido que se va a exportar en excell.
   * @param codigoproveedor
   * @param numeropedido
   * @param tipo
   * @returns
   */
  public getExportarPedidoDetalle = (
    codigoproveedor: string,
    numeropedido: string,
    tipo: number
  ): Observable<pedidoDetalleExcellV2[]> => {
    const headers = new HttpHeaders(Header);

    return this.http
      .get<pedidoDetalleExcellV2[]>(
        `${WEB_SERVICE}pedidos/getExportarPedidoDetalle/${codigoproveedor}/${numeropedido}/${tipo}`,
        { headers }
      )
      .pipe(
        map(res => {
          return res;
        }),
        catchError(err => {
          this.messageService.add({
            severity: 'error',
            summary: `Error al exportar detalles de pedido ${numeropedido} pedidos del proveedor ${codigoproveedor} y tipo ${tipo}`,
          });

          console.log("SERVICE 'getExportarPedidoDetalle' ERROR: ", err);

          return EMPTY;
        })
      );
  };

  /**
   * @description Metodo utilizado para obtener el listado de Paises origenes de los productos.
   * @returns
   */
  public getPaisOrigenProductos = (): Observable<any[]> => {
    const headers = new HttpHeaders(Header);

    return this.http
      .get<any[]>(`${WEB_SERVICE}pedidos/getPaisOrigenProductos`, { headers })
      .pipe(
        map(res => {
          return res;
        }),
        catchError(err => {
          this.messageService.add({
            severity: 'error',
            summary: `Error al obtener lista de paises de origen de productos`,
          });

          console.log("SERVICE 'getPaisOrigenProductos' ERROR: ", err);

          return EMPTY;
        })
      );
  };

  /**
   * @description Metodo utlizado para obtener el listado de marcas de los productos en la db
   * @returns
   */
  public getMarcasProductos = (): Observable<any[]> => {
    const headers = new HttpHeaders(Header);

    return this.http
      .get<any[]>(`${WEB_SERVICE}pedidos/getMarcasProductos`, { headers })
      .pipe(
        map(res => {
          return res;
        }),
        catchError(err => {
          this.messageService.add({
            severity: 'error',
            summary: `Error al obtener lista de marcas de productos`,
          });

          console.log("SERVICE 'getMarcasProductos' ERROR: ", err);

          return EMPTY;
        })
      );
  };

  /**
   * @description Metodo utlizado para obtener el estado actual y el siguiente estado de un pedido.
   * @param codigoproveedor
   * @param numeropedido
   * @returns
   */
  public getEstadosPedido = (
    codigoproveedor: string,
    numeropedido: string
  ): Observable<estadosPedido> => {
    const headers = new HttpHeaders(Header);

    return this.http
      .get<estadosPedido>(
        `${WEB_SERVICE}pedidos/getEstadosPedido/${codigoproveedor}/${numeropedido}`,
        { headers }
      )
      .pipe(
        map(res => {
          return res;
        }),
        catchError(err => {
          this.messageService.add({
            severity: 'error',
            summary: `Error al obtener el estado del pedido ${numeropedido} del proveedor ${codigoproveedor}`,
          });

          console.log("SERVICE 'getEstadosPedido' ERROR: ", err);

          return EMPTY;
        })
      );
  };

  /**
   * @description Metodo utlizado para insertar un producto al detalle de un pedido existente.
   * @param param
   * @returns
   */
  public insertPedidoDetalle = (param: detallePedido): Observable<boolean> => {
    const headers = new HttpHeaders(Header);

    const data = {
      codigoproveedor: param.codigoproveedor,
      numeropedido: param.numeropedido,
      oem: param.oem,
      codigoproducto: param.codigoproducto,
      descripcion: param.descripcion,
      cantidad: param.cantidad,
      precio: param.precio,
      cantidadpedido: param.cantidadpedido,
      preciopedido: param.preciopedido,
      paisorigenid: param.paisorigenid,
      marca: param.marca,
      es_reemplazo: param.es_reemplazo,
    };

    return this.http
      .post<boolean>(`${WEB_SERVICE}pedidos/insertPedidoDetalle`, data, {
        headers,
      })
      .pipe(
        map(res => {
          return res;
        }),
        catchError(err => {
          this.messageService.add({
            severity: 'error',
            summary: `Error al insertar el detalle en el pedido ${param.numeropedido} del proveedor ${param.codigoproveedor}`,
          });

          console.log("SERVICE 'insertPedidoDetalle' ERROR: ", err);

          return EMPTY;
        })
      );
  };

  /**
   * @description Metodo utilizado para actualizar los datos de un producto en el detalle de un pedido.
   * @param prod
   * @returns
   */
  public updatePedidoDetalle = (prod: detallePedido): Observable<boolean> => {
    const headers = new HttpHeaders(Header);

    const body = {
      detalleid: prod.detalleid,
      codigoproveedor: prod.codigoproveedor,
      numeropedido: prod.numeropedido,
      oem: prod.oem,
      codigoproducto: prod.codigoproducto,
      descripcion: prod.descripcion,
      cantidad: prod.cantidad,
      precio: prod.precio,
      cantidadpedido: prod.cantidadpedido,
      preciopedido: prod.preciopedido,
      paisorigenid: prod.paisorigenid,
      marca: prod.marca,
      es_reemplazo: prod.es_reemplazo,
    };

    return this.http
      .put<boolean>(`${WEB_SERVICE}pedidos/updatePedidoDetalle`, body, {
        headers,
      })
      .pipe(
        map(res => {
          return res;
        }),
        catchError(err => {
          this.messageService.add({
            severity: 'error',
            summary: `Error al actualizar el detalle en el pedido ${prod.numeropedido} del proveedor ${prod.codigoproveedor}`,
          });

          console.log("SERVICE 'updatePedidoDetalle' ERROR: ", err);

          return EMPTY;
        })
      );
  };

  /**
   * @description Metodo utilizado para actualizar el estado del pedido
   * @param estado
   * @param codigoempleado
   * @param numeropedido
   * @param codigoproveedor
   * @returns
   */
  public updateEstadoPedido = (
    estado: string,
    codigoempleado: string,
    numeropedido: string,
    codigoproveedor: string
  ): Observable<boolean> => {
    const headers = new HttpHeaders(Header);

    const body = {
      estado,
      codigoempleado,
      numeropedido,
      codigoproveedor,
    };

    return this.http
      .patch<boolean>(`${WEB_SERVICE}pedidos/updateEstadoPedido`, body, {
        headers,
      })
      .pipe(
        map(res => {
          return res;
        }),
        catchError(err => {
          this.messageService.add({
            severity: 'error',
            summary: `Error al actualizar el estado del pedido ${numeropedido} del proveedor ${codigoproveedor}`,
          });

          console.log("SERVICE 'updateEstadoPedido' ERROR: ", err);

          return EMPTY;
        })
      );
  };

  /**
   * @description Metodo utilizado para establecer las cantidades y precios confirmados  a cero.
   * @param codigoproveedor
   * @param numeropedido
   * @returns
   */
  public updatePedidoConfirmadoCero = (
    codigoproveedor: string,
    numeropedido: string
  ): Observable<boolean> => {
    const headers = new HttpHeaders(Header);

    const body = {
      codigoproveedor,
      numeropedido,
    };

    return this.http
      .patch<boolean>(
        `${WEB_SERVICE}pedidos/updatePedidoConfirmadoCero`,
        body,
        { headers }
      )
      .pipe(
        map(res => {
          return res;
        }),
        catchError(err => {
          this.messageService.add({
            severity: 'error',
            summary: `Error al actualizar la confirmacion cero del pedido ${numeropedido} del proveedor ${codigoproveedor}`,
          });

          console.log("SERVICE 'updatePedidoConfirmadoCero' ERROR: ", err);

          return EMPTY;
        })
      );
  };

  /**
   * @description Metodo utilizado para establecer los valores de pedidos a confirmados y viseversa,
   * Opcion: 1 => Mueve pedido a confirmado. Opcion: 2 => Mueve confirmado a pedido.
   * @param codigoproveedor
   * @param numeropedido
   * @param opcion
   * @returns
   */
  public updatePasarPedidoConfirmadoViceversa = (
    codigoproveedor: string,
    numeropedido: string,
    opcion: number
  ): Observable<boolean> => {
    const headers = new HttpHeaders(Header);

    const body = {
      codigoproveedor,
      numeropedido,
      opcion,
    };

    return this.http
      .patch<boolean>(
        `${WEB_SERVICE}pedidos/updatePasarPedidoConfirmadoViceversa`,
        body,
        { headers }
      )
      .pipe(
        map(res => {
          return res;
        }),
        catchError(err => {
          this.messageService.add({
            severity: 'error',
            summary: `Error al pasar el pedido ${numeropedido} del proveedor ${codigoproveedor} a confirmado. opcion ${opcion}`,
          });

          console.log(
            "SERVICE 'updatePasarPedidoConfirmadoViceversa' ERROR: ",
            err
          );

          return EMPTY;
        })
      );
  };

  /**
   * @description Metodo utilizado para eliminar un producto del detalle de pedido.
   * @param detalleid
   * @returns
   */
  public deletePedidoDetalle = (detalleid: number): Observable<boolean> => {
    const headers = new HttpHeaders(Header);

    const body = {
      detalleid,
    };

    return this.http
      .delete<boolean>(`${WEB_SERVICE}pedidos/deletePedidoDetalle`, {
        body,
        headers,
      })
      .pipe(
        map(res => {
          return res;
        }),
        catchError(err => {
          this.messageService.add({
            severity: 'error',
            summary: `Error al eliminar el detalle ${detalleid}`,
          });

          console.log("SERVICE 'deletePedidoDetalle' ERROR: ", err);

          return EMPTY;
        })
      );
  };
}
