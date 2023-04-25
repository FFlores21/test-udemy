/* eslint-disable camelcase */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, map } from 'rxjs/operators';
import { Header, WEB_SERVICE } from 'src/app/config/config';
import { of } from 'rxjs';
import { OrganigramaItem } from '../../interfaces/configuracion-organizacional/OrganigramaItem.Interface';

@Injectable({
  providedIn: 'root',
})
export class GestionOrganigramaService {
  constructor(
    private httpClient: HttpClient,
    private messageService: MessageService
  ) {}

  public getOrganigramaActual = () => {
    const headers = new HttpHeaders(Header);

    return this.httpClient
      .get<OrganigramaItem[]>(
        `${WEB_SERVICE}configuracion-organizacional/obtenerOrganigramaActual`,
        { headers }
      )
      .pipe(
        map(res => {
          return res;
        }),
        catchError(err => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error al obtener el organigrama actual',
          });
          return of(null);
        })
      );
  };

  public getListaEmpleados = () => {
    const headers = new HttpHeaders(Header);

    return this.httpClient
      .get<OrganigramaItem[]>(
        `${WEB_SERVICE}configuracion-organizacional/obtenerListaEmpleados`,
        { headers }
      )
      .pipe(
        map(res => {
          return res;
        }),
        catchError(err => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error al obtener lista de empleados',
          });
          return of(null);
        })
      );
  };

  public newPlazaVacia = (id_plaza_padre: number, id_cargo: number) => {
    const headers = new HttpHeaders(Header);

    const body = {
      id_plaza_padre: id_plaza_padre,
      id_cargo: id_cargo,
    };

    return this.httpClient
      .post<boolean>(
        `${WEB_SERVICE}configuracion-organizacional/crearPlazaVacia`,
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
            summary: 'Error al crear una plaza vacia (datos por defecto)',
          });
          return of(null);
        })
      );
  };

  public modificarDatosGeneralesDePlazaExistente = (
    id_plaza: number,
    nuevo_salario: number,
    nuevo_alias_plaza: string,
    es_contact_center: boolean,
    nueva_id_sucursal?: string,
    nuevo_id_departamento?: number,
    nuevo_id_region?: number
  ) => {
    const headers = new HttpHeaders(Header);

    const body = {
      id_plaza: id_plaza,
      nuevo_salario: nuevo_salario,
      nuevo_alias_plaza: nuevo_alias_plaza,
      nueva_id_sucursal: nueva_id_sucursal,
      nuevo_id_departamento: nuevo_id_departamento,
      nuevo_id_region: nuevo_id_region,
      es_contact_center: es_contact_center,
    };

    return this.httpClient
      .post<boolean>(
        `${WEB_SERVICE}configuracion-organizacional/updateDatosGeneralesPlaza`,
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
            summary: 'Error al actualizar datos generales de plaza existente',
          });
          return of(null);
        })
      );
  };

  public modificarEmpleadoDePlaza = (
    id_plaza: number,
    id_new_codigo_empleado?: string
  ) => {
    const headers = new HttpHeaders(Header);

    const body = {
      id_plaza: id_plaza,
      id_new_codigo_empleado: id_new_codigo_empleado,
    };

    return this.httpClient
      .post<boolean>(
        `${WEB_SERVICE}configuracion-organizacional/updateEmpleadoPlaza`,
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
            summary: 'Error al actualizar el empleado de la plaza seleccionada',
          });
          return of(null);
        })
      );
  };

  public modificarSuplentePlaza = (
    id_plaza: number,
    codigo_empleado_suplente: string,
    fecha_inicio: string,
    fecha_final: string
  ) => {
    const headers = new HttpHeaders(Header);

    const body = {
      id_plaza: id_plaza,
      codigo_empleado_suplente: codigo_empleado_suplente,
      fecha_inicio: fecha_inicio,
      fecha_final: fecha_final,
    };

    return this.httpClient
      .post<boolean>(
        `${WEB_SERVICE}configuracion-organizacional/updateSuplentePlaza`,
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
            summary:
              'Error al actualizar la suplencia de la plaza seleccionada',
          });
          return of(null);
        })
      );
  };

  public modificarEstadoPlaza = (id_plaza: number, nuevo_estado = true) => {
    const headers = new HttpHeaders(Header);

    const body = {
      id_plaza: id_plaza,
      nuevo_estado: nuevo_estado,
    };

    return this.httpClient
      .post<boolean>(
        `${WEB_SERVICE}configuracion-organizacional/updateEstadoPlaza`,
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
            summary: 'Error al actualizar el estado de la plaza seleccionada',
          });
          return of(null);
        })
      );
  };
}
