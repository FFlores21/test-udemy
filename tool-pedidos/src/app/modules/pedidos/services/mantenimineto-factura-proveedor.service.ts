/* eslint-disable valid-jsdoc */
/* eslint-disable no-console */
/* eslint-disable quotes */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Header, WEB_SERVICE } from 'src/app/config/config';
import {
  detalleFacturaProvExcellV2,
  estadosFactura,
  facturaProveedor,
  facturaProveedorDetalle,
} from '../interfaces/mantenimiento-factura-proveedor.interface';
import { MessageService } from 'primeng/api';
import { EMPTY, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ManteniminetoFacturaProveedorService {
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  /** GET
   * @description Metodo que realiza una petición "get" para obtener los datos de una factura proveedor
   * @param codigoproveedor
   * @param numerodocumento
   * @returns
   */
  public getFacturaProveedor = (
    codigoproveedor: string,
    numerodocumento: string
  ): Observable<facturaProveedor> => {
    const headers = new HttpHeaders(Header);

    let body = {
      codigoproveedor,
      numerodocumento
    };

    return this.http
      .post<facturaProveedor>(
        `${WEB_SERVICE}pedidos/getFacturaProveedor`,
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
            summary: `Error al obtener la factura ${numerodocumento} el proveedor ${codigoproveedor}`,
          });

          console.log("SERVICE 'getFacturaProveedor' ERROR: ", err);

          return EMPTY;
        })
      );
  };

  /** GET
   * @description Metodo utilizado para obtener el detalle de una factura proveedor.
   * @param facturaproveedorid
   * @param codigoproveedor
   * @param numerodocumento
   * @returns
   */
  public getDetalleFacturaProveedor = (
    facturaproveedorid: number,
    codigoproveedor: string,
    numerodocumento: string
  ): Observable<facturaProveedorDetalle[]> => {
    const headers = new HttpHeaders(Header);
    
    let body = {
      facturaproveedorid,
      codigoproveedor,
      numerodocumento
    }

    return this.http
      .post<facturaProveedorDetalle[]>(
        `${WEB_SERVICE}pedidos/getDetalleFacturaProveedor`,
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
            summary: `Error al obtener el detalle de la factura ${numerodocumento} el proveedor ${codigoproveedor} / ${facturaproveedorid}`,
          });

          console.log("SERVICE 'getDetalleFacturaProveedor' ERROR: ", err);

          return EMPTY;
        })
      );
  };

  /** GET
   * @description Metodo utilizado para obtener el actual y proximo estado de una factura proveedor
   * @param codigoproveedor
   * @param numerodocumento
   * @param facturaproveedorid
   * @returns
   */
  public getEstadosFacturaProveedor = (
    codigoproveedor: string,
    numerodocumento: string,
    facturaproveedorid: number
  ): Observable<estadosFactura> => {
    const headers = new HttpHeaders(Header);

    let body = {
      codigoproveedor,
      numerodocumento,
      facturaproveedorid
    };

    return this.http
      .post<estadosFactura>(
        `${WEB_SERVICE}pedidos/getEstadosFacturaProveedor`,
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
            summary: `Error al obtener el estado de la factura ${numerodocumento} el proveedor ${codigoproveedor} / ${facturaproveedorid}`,
          });

          console.log("SERVICE 'getEstadosFacturaProveedor' ERROR: ", err);

          return EMPTY;
        })
      );
  };

  /** GET
   * @description Metodo utilizado para obtener los registros de los productos del detalle de la factura proveedor para ser exportados.
   * Se obtiene el detalle de los registros con el codigo arancelario
   * @param codigoproveedor
   * @param numerodocumento
   * @returns
   */
  public getExportarDetalleFacturaProveedor = (
    codigoproveedor: string,
    numerodocumento: string
  ): Observable<detalleFacturaProvExcellV2[]> => {
    const headers = new HttpHeaders(Header);

    let body = {
      codigoproveedor,
      numerodocumento
    };

    return this.http
      .post<detalleFacturaProvExcellV2[]>(
        `${WEB_SERVICE}pedidos/getExportarDetalleFacturaProveedor`,
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
            summary: `Error al obtener el detalle de la factura proveedor ${numerodocumento} del proveedor ${codigoproveedor}`,
          });

          console.log(
            "SERVICE 'getExportarDetalleFacturaProveedor' ERROR: ",
            err
          );

          return EMPTY;
        })
      );
  };

  /** GET
   * @description Metodo utilizado para verificar si un documento de factura proveedor ya existe.
   * @param numerodocumento
   * @param codigoproveedor
   * @returns
   */
  public getVerificarExisteDocumento = (
    numerodocumento: string,
    codigoproveedor: string
  ): Observable<number> => {
    const headers = new HttpHeaders(Header);

    let body = {
      numerodocumento,
      codigoproveedor
    }

    return this.http
      .post<number>(
        `${WEB_SERVICE}pedidos/getVerificarExisteDocumento`,
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
            summary: `Error al verificar si existe el documento ${numerodocumento} del proveedor ${codigoproveedor}`,
          });

          console.log("SERVICE 'getVerificarExisteDocumento' ERROR: ", err);

          return EMPTY;
        })
      );
  };

  /** POST
   * @description Metodo utilizado para insertar un documento / registro de factura proveedor
   * @param numerodocumento
   * @param codigoproveedor
   * @param codigoempleado
   * @returns
   */
  public insertEncabezadoFacturaProveedor = (numerodocumento: string, codigoproveedor: string, codigoempleado: string, fechaemision : Date, fechavencimiento : Date | null) : Observable<number> => {
    const headers = new HttpHeaders(Header);

    fechaemision.setUTCHours(0, 0, 0);

    if( fechavencimiento ) {
      fechavencimiento.setUTCHours(0, 0, 0);
    }

    const body = {
      numerodocumento, codigoproveedor, codigoempleado, fechaemision, fechavencimiento
    };

    return this.http
      .post<number>(
        `${WEB_SERVICE}pedidos/insertEncabezadoFacturaProveedor`,
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
            summary: `Error al insertar encabezado en la factura proveedor ${numerodocumento} del proveedor ${codigoproveedor} para el empleado ${codigoempleado}`,
          });

          console.log("SERVICE 'getVerificarExisteDocumento' ERROR: ", err);

          return EMPTY;
        })
      );
  };

  /**
   * @description Metodo utilizado para insertar / actualizar un nuevo detalle y / o desglose del detalle de la factura proveedor.
   * @param facturaproveedorid
   * @param codigoproveedor
   * @param detalleid
   * @param cantidadfacturar
   * @param precioproducto
   * @returns
   */
  public insertDetalleFacturaProveedor = (
    facturaproveedorid: number,
    codigoproveedor: string,
    detalleid: number,
    cantidadfacturar: number,
    precioproducto: string
  ): Observable<any> => {
    const headers = new HttpHeaders(Header);

    const body = {
      facturaproveedorid,
      codigoproveedor,
      detalleid,
      cantidadfacturar,
      precioproducto,
    };

    return this.http
      .post<any>(`${WEB_SERVICE}pedidos/insertDetalleFacturaProveedor`, body, {
        headers,
      })
      .pipe(
        map(res => {
          return res;
        }),
        catchError(err => {
          this.messageService.add({
            severity: 'error',
            summary: `Error al insertar detalle en la factura proveedor ${facturaproveedorid} del proveedor ${codigoproveedor}`,
          });

          console.log("SERVICE 'insertDetalleFacturaProveedor' ERROR: ", err);

          return EMPTY;
        })
      );
  };

  /** PATCH
   * @description Metodo utilizado para actualizar el estado de la factura proveedor
   * @param facturaproveedorid
   * @param codigoproveedor
   * @param numerodocumento
   * @param proxestado
   * @param codigoempleado
   * @returns
   */
  public updateEstadoFacturaProveedor = (
    facturaproveedorid: number,
    codigoproveedor: string,
    numerodocumento: string,
    proxestado: string,
    codigoempleado: string
  ): Observable<boolean> => {
    const headers = new HttpHeaders(Header);

    const body = {
      facturaproveedorid,
      codigoproveedor,
      numerodocumento,
      proxestado,
      codigoempleado,
    };

    return this.http
      .patch<boolean>(
        `${WEB_SERVICE}pedidos/updateEstadoFacturaProveedor`,
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
            summary: `Error al actualizar el estado de la factura proveedor ${facturaproveedorid} del proveedor ${codigoproveedor}`,
          });

          console.log("SERVICE 'updateEstadoFacturaProveedor' ERROR: ", err);

          return EMPTY;
        })
      );
  };

  /** PATCH
   * @description Metodo utilizado para actualizar el impuesto, descuento y flete de una factura proveedor.
   * @param facturaproveedorid
   * @param codigoproveedor
   * @param impuesto
   * @param descuento
   * @param flete
   * @returns
   */
  public updateImpuestoDescuentoFleteFacProv = (
    facturaproveedorid: number,
    codigoproveedor: string,
    impuesto: number,
    descuento: number,
    flete: number
  ): Observable<boolean> => {
    const headers = new HttpHeaders(Header);

    const body = {
      facturaproveedorid,
      codigoproveedor,
      impuesto,
      descuento,
      flete,
    };

    return this.http
      .patch<boolean>(
        `${WEB_SERVICE}pedidos/updateImpuestoDescuentoFleteFacProv`,
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
            summary: `Error al actualizar el puesto descuento flete de la factura proveedor ${facturaproveedorid} del proveedor ${codigoproveedor}`,
          });

          console.log(
            "SERVICE 'updateImpuestoDescuentoFleteFacProv' ERROR: ",
            err
          );

          return EMPTY;
        })
      );
  };

  /** PATCH
   * @description Metodo utilizado para actualizar el precio y costo de productos en el detalle de la factura proveedor
   * @param facturaproveedordetalleid
   * @param facturaproveedorid
   * @param codigoproveedor
   * @param precioproducto
   * @param costoproducto
   * @returns
   */
  public updatePrecioCostoDetalleFacProv = (
    facturaproveedordetalleid: number,
    facturaproveedorid: number,
    codigoproveedor: string,
    precioproducto: number,
    costoproducto: number,
    paisorigenid: string,
    marca: string
  ): Observable<boolean> => {
    const headers = new HttpHeaders(Header);

    const body = {
      facturaproveedordetalleid,
      facturaproveedorid,
      codigoproveedor,
      precioproducto,
      costoproducto,
      paisorigenid,
      marca,
    };

    return this.http
      .patch<boolean>(
        `${WEB_SERVICE}pedidos/updatePrecioCostoDetalleFacProv`,
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
            summary: `Error al actualizar el precio costo detalle de la factura proveedor ${facturaproveedorid} del proveedor ${codigoproveedor}`,
          });

          console.log("SERVICE 'updatePrecioCostoDetalleFacProv' ERROR: ", err);

          return EMPTY;
        })
      );
  };

  /** DELETE
   * @description Metodo utilizado para eliminar registros / productos del detalle de mantenimiento de factura proveedor
   * @param facturaproveedordetalleid
   * @param facturaproveedorid
   * @returns
   */
  public deleteFacturaProveedorDetalle = (
    facturaproveedordetalleid: number,
    facturaproveedorid: number
  ): Observable<boolean> => {
    const headers = new HttpHeaders(Header);

    const body = {
      facturaproveedordetalleid,
      facturaproveedorid,
    };

    return this.http
      .delete<boolean>(`${WEB_SERVICE}pedidos/deleteFacturaProveedorDetalle`, {
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
            summary: `Error al actualizar el puesto descuento flete de la factura proveedor ${facturaproveedorid} del proveedor ${facturaproveedordetalleid}`,
          });

          console.log("SERVICE 'deleteFacturaProveedorDetalle' ERROR: ", err);

          return EMPTY;
        })
      );
  };

  /** PUT
   * @description Metodo para actualizar las fechas de emisión y vencimiento de una factura proveedor
   * @param numerodocumento
   * @param codigoproveedor
   * @param fechaemision
   * @param fechavencimiento
   * @returns
   */
  public actualizarFechaEmisionVencimiento = (numerodocumento: string, codigoproveedor: string, fechaemision : Date, fechavencimiento : Date | null) : Observable<boolean> => {
    const headers = new HttpHeaders(Header);

    fechaemision.setUTCHours(0, 0, 0);

    if( fechavencimiento ) {
      fechavencimiento.setUTCHours(0, 0, 0);
    }

    const body = {
      numerodocumento, codigoproveedor, fechaemision, fechavencimiento
    };

    return this.http
      .put<boolean>(
        `${WEB_SERVICE}pedidos/actualizarFechaEmisionVencimientoFacturaProveedor`,
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
            summary: `Error al actualizar la fecha de emision y vencimiento de la factura proveedor ${numerodocumento} del proveedor ${codigoproveedor}`,
          });

          console.log("SERVICE 'actualizarFechaEmisionVencimiento' ERROR: ", err);

          return EMPTY;
        })
      );
  };
}
