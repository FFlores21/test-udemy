/* eslint-disable no-console */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, EMPTY, map } from 'rxjs';
import { Header, WEB_SERVICE } from 'src/app/config/config';
import { DataUser } from 'src/app/modules/auth/interfaces/data-user.interface';
import { selectDataUser } from 'src/app/redux/auth/selectors/auth.selector';
import { AuthState } from 'src/app/redux/auth/state/auth.state';
import { AlertaService } from 'src/app/services/alertas/alerta.service';
import { MenuItem } from '../interfaces/Modulo.interface';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  dataUser!: DataUser;

  constructor(
    private httpClient: HttpClient,
    private alert: AlertaService,
    private authStore: Store<AuthState>
  ) {
    this.authStore.select(selectDataUser).subscribe(data => {
      this.dataUser = data;
    });
  }

  public obtenerMenu = (idMenu: number) => {
    const headers = new HttpHeaders(Header);

    return this.httpClient
      .get<MenuItem[]>(
        `${WEB_SERVICE}permisos/obtenerListaDeAccesosIndividualesPorCargo/${this.dataUser.id_cargo_plaza}/${idMenu}`,
        { headers }
      )
      .pipe(
        map(res => {
          return res;
        }),
        catchError(err => {
          console.log(err);
          this.alert.showError(err.error.message);
          return EMPTY;
        })
      );
  };
}
