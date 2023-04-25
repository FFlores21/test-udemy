import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Message } from 'primeng/api';
import { catchError, EMPTY } from 'rxjs';
import { TOKEN, ID_MENU } from 'src/app/config/config';
import { LayoutState } from 'src/app/layout/interfaces/Layout.state';
import {
  IpMac,
  UsuariosService,
} from 'src/app/modules/auth/services/usuarios.service';
import { obtenerMenu } from 'src/app/redux/layout/actions/menu.action';
import { AlertaService } from 'src/app/services/alertas/alerta.service';
import { AuthService } from '../services/auth.service';

@Component({
  templateUrl: './login.component.html',
})
export class LoginComponent {
  mensajes: Message[] = [];
  idMenu: number;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sUsuario: UsuariosService,
    private authService: AuthService,
    private alerta: AlertaService,
    private store: Store<LayoutState>
  ) {
    const token = this.route.snapshot.paramMap.get('token') || '';
    this.idMenu = Number(this.route.snapshot.paramMap.get('id_menu'));

    if (!token) {
      this.alerta.showWarning('No token!');
      this.router.navigateByUrl('acceso-denegado');
      return;
    }
    this.authService.validarToken(token);
  }

  async ngOnInit(): Promise<void> {
    this.sUsuario
      .obtenerDireccionIp()
      .pipe(
        catchError(_ => {
          this.router.navigateByUrl('acceso-denegado');
          return EMPTY;
        })
      )
      .subscribe(resp => {
        this.validarIP(resp);
      });
  }

  private validarIP = (ipMac: IpMac): void => {
    this.sUsuario
      .validarIP(ipMac.ip, ipMac.mac)
      .pipe(
        catchError(_ => {
          this.router.navigateByUrl('acceso-denegado');
          return EMPTY;
        })
      )
      .subscribe(data => {
        if (!data.ip_valida_permitida) {
          this.router.navigateByUrl('acceso-denegado');
          return;
        }

        sessionStorage.setItem(ID_MENU, String(this.idMenu)); // Se va necesitar en LayoutComponent
        this.router.navigate(['home/']);
      });
  };
}
