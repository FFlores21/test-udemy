/* eslint-disable camelcase */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, map } from 'rxjs/operators';
import { Header, WEB_SERVICE } from 'src/app/config/config';
import { of } from 'rxjs';
import { ModuloAWSItem } from '../../interfaces/configuracion-organizacional/ModuloAWSItem.Interface';
import { AccessItem } from '../../interfaces/configuracion-organizacional/AccessItem.Interface';
import { CargosItem } from '../../interfaces/configuracion-organizacional/CargosItem.Interface';
import { DeptoAllasItem } from '../../interfaces/configuracion-organizacional/DepartamentosAllas.Interface';

@Injectable({
  providedIn: 'root',
})
export class GestionCargosService {
  constructor(
    private httpClient: HttpClient,
    private messageService: MessageService
  ) {}

  public getListaCargos = (jerarquizado: boolean) => {
    const headers = new HttpHeaders(Header);

    return this.httpClient
      .get<CargosItem[]>(
        `${WEB_SERVICE}configuracion-organizacional/obtenerListaCargos?jerarquizado=${jerarquizado}`,
        { headers }
      )
      .pipe(
        map(res => {
          return res;
        }),
        catchError(err => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error al obtener lista de cargos',
          });
          return of(null);
        })
      );
  };

  public getListaAllasDepartamentos = () => {
    const headers = new HttpHeaders(Header);

    return this.httpClient
      .get<DeptoAllasItem[]>(
        `${WEB_SERVICE}configuracion-organizacional/obtenerListaDeptoAllas`,
        { headers }
      )
      .pipe(
        map(res => {
          return res;
        }),
        catchError(err => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error al obtener lista de departamentos de Allas',
          });
          return of(null);
        })
      );
  };

  public getListaModulosAWS = () => {
    const headers = new HttpHeaders(Header);

    return this.httpClient
      .get<ModuloAWSItem[]>(
        `${WEB_SERVICE}configuracion-organizacional/obtenerListaModulosAWS`,
        { headers }
      )
      .pipe(
        map(res => {
          return res;
        }),
        catchError(err => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error al obtener lista de modulos AWS',
          });
          return of(null);
        })
      );
  };

  public newCargo = (
    nombre_cargo: string,
    id_ref_cargo: number,
    id_pais: number,
    lista_accesos_aws: ModuloAWSItem[],
    lista_accesos: AccessItem[],
    es_cargo_para_asesores: boolean,
    debe_tener_depto: boolean,
    debe_tener_region: boolean,
    debe_tener_sucursal: boolean,
    debe_tener_MCI: boolean,
    debe_tener_MP: boolean,
    id_departamento?: number
  ) => {
    const headers = new HttpHeaders(Header);

    const body = {
      nombre_cargo,
      id_ref_cargo,
      id_pais,
      id_departamento,
      lista_accesos_aws,
      lista_accesos,
      es_cargo_para_asesores,
      debe_tener_depto,
      debe_tener_region,
      debe_tener_sucursal,
      debe_tener_MCI,
      debe_tener_MP,
    };

    return this.httpClient
      .post<boolean>(
        `${WEB_SERVICE}configuracion-organizacional/nuevoCargo`,
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
            summary: 'Error al crear el nuevo cargo',
          });
          return of(null);
        })
      );
  };

  public updateCargo = (
    id_cargo: number,
    nombre_cargo: string,
    id_ref_cargo: number,
    id_pais: number,
    lista_accesos_aws: ModuloAWSItem[],
    lista_accesos: AccessItem[],
    estado: boolean,
    id_departamento?: number
  ) => {
    const headers = new HttpHeaders(Header);

    const body = {
      id_cargo: id_cargo,
      nombre_cargo: nombre_cargo,
      id_ref_cargo: id_ref_cargo,
      id_pais: id_pais,
      id_departamento: id_departamento,
      lista_accesos_aws: lista_accesos_aws,
      lista_accesos: lista_accesos,
      estado: estado,
    };

    return this.httpClient
      .post<boolean>(
        `${WEB_SERVICE}configuracion-organizacional/updateDatosGeneralesCargo`,
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
            summary: 'Error al modificar el cargo',
          });
          return of(null);
        })
      );
  };
}
