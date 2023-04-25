/* eslint-disable no-console */
import { Injectable } from '@angular/core';
import { AlertaService } from 'src/app/services/alertas/alerta.service';
import jwtDecode from 'jwt-decode';
import { DataUser } from '../interfaces/data-user.interface';
import { TOKEN } from 'src/app/config/config';
import { Store } from '@ngrx/store';
import { AuthState } from 'src/app/redux/auth/state/auth.state';
import {
  agregarDataUser,
  limpiarDataUser,
} from 'src/app/redux/auth/actions/auth.action';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private alert: AlertaService,
    private store: Store<AuthState>,
    private router: Router
  ) {}

  validarToken(token: string): boolean {
    if (!token) return false;

    try {
      const dataUser = jwtDecode<DataUser>(token);

      const expiry = dataUser.exp; //JSON.parse(atob(token.split('.')[1])).exp;

      const tokenValido = !(Math.floor(new Date().getTime() / 1000) >= expiry);

      if (tokenValido) {
        sessionStorage.setItem(TOKEN, token);
      } else {
        sessionStorage.removeItem(TOKEN);
        this.noAutorizado('La sessión a expirado!');
        return false;
      }

      if (!dataUser.id_plaza) {
        this.noAutorizado('No tienes una plaza asignada');
        return false;
      }
      if (dataUser.codigoempleado) {
        this.store.dispatch(agregarDataUser({ dataUser }));
      }

      return tokenValido;
    } catch (error) {
      console.log(error);
      this.noAutorizado('No se pudo validar el token!');
      return false;
    }
  }

  noAutorizado(mensaje: string) {
    this.alert.showError(mensaje);
    this.router.navigateByUrl('acceso-denegado');
    sessionStorage.removeItem(TOKEN);
    this.store.dispatch(limpiarDataUser());
  }
}
