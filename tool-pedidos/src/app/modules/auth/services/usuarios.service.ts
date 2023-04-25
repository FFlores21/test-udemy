import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { DIRECCION_IP, Header, WEB_SERVICE } from 'src/app/config/config';
import {
  IRespuestaEmpleadosAutorizacion,
  IRespuestaValidarPin,
} from 'src/app/modules/shared/interfaces/usuario';
import { AlertaService } from '../../../services/alertas/alerta.service';

export interface IpMac {
  ip: string;
  mac?: string;
}

export interface IpMacValida {
  ip_valida_permitida: boolean;
  mac_valida_permitida: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  constructor(private http: HttpClient, private alerta: AlertaService) {}

  obtenerDireccionIp() {
    sessionStorage.removeItem(DIRECCION_IP);
    if (navigator.userAgent.includes('Android')) {
      //Para conexiones desde celular android
      return this.http.get<IpMac>('https://api.ipify.org/?format=json').pipe(
        tap(resp => {
          sessionStorage.setItem(DIRECCION_IP, JSON.stringify(resp));
        }),
        map(resp => resp),
        catchError(err => {
          this.alerta.showError(err.mensaje);
          throw new Error(err.message);
        })
      );
    }

    //Para conexiones desde PC
    return this.http.get<IpMac>('http://localhost:9000/api/info').pipe(
      tap(resp => {
        sessionStorage.setItem(DIRECCION_IP, JSON.stringify(resp));
      }),
      map(resp => resp),
      catchError(err => {
        this.alerta.showError(err.mensaje);
        throw new Error(err.message);
      })
    );
  }

  public validarIP(ip: string, mac?: string) {
    const headers = new HttpHeaders(Header);
    const body = {
      ip,
      mac,
    };
    return this.http
      .post<IpMacValida>(`${WEB_SERVICE}auth/validarIP`, body, { headers })
      .pipe(
        map(resp => resp),
        catchError(err => {
          this.alerta.showError(err.mensaje);
          throw new Error(err.message);
        })
      );
  }

  public obtenerEmpleadosAutorizacion(
    codigoempleado: string,
    nivelAutorizacion: number,
    sucursal: string
  ) {
    const headers = new HttpHeaders(Header);
    const body = {
      codigoempleado,
      nivelAutorizacion,
      sucursal,
    };
    return this.http
      .post<IRespuestaEmpleadosAutorizacion>(
        `${WEB_SERVICE}usuarios/obtenerEmpleadosAutorizacion`,
        body,
        { headers }
      )
      .pipe(
        map(resp => {
          return resp.data;
        }),
        catchError(err => {
          this.alerta.showError(err.error.mensaje);

          return of(null);
        })
      );
  }

  public validarPin(codigoempleado: string, pin: number) {
    const headers = new HttpHeaders(Header);
    const body = {
      codigoempleado,
      pin,
    };
    return this.http
      .post<IRespuestaValidarPin>(`${WEB_SERVICE}usuarios/validarPin`, body, {
        headers,
      })
      .pipe(
        map(resp => {
          return resp.data;
        }),
        catchError(err => {
          this.alerta.showError(err.error.mensaje);
          return of(null);
        })
      );
  }
}
