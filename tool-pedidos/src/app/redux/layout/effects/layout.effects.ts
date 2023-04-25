import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { AlertaService } from 'src/app/services/alertas/alerta.service';
import { Router } from '@angular/router';
import { agregarMenu, obtenerMenu } from '../actions/menu.action';
import { MenuService } from 'src/app/layout/service/menu.layout.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Injectable()
export class LayoutEffects {
  //   Obtener las promociones y cargarlas en el state.
  cargarPromociones$ = createEffect(() =>
    this.actions$.pipe(
      ofType(obtenerMenu),
      switchMap(payload =>
        this.menuService.obtenerMenu(payload.idMenu).pipe(
          tap(menu => {
            if (menu && menu.length) {
              this.layoutService.config.menuMode = 'slim'; // Se muestra sidebar
            } else {
              this.layoutService.config.menuMode = 'overlay'; // Se oculta sidebar
            }
          }),
          map(menuResp => agregarMenu({ menu: menuResp ? menuResp : [] })),
          catchError(() => EMPTY)
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private menuService: MenuService,
    private layoutService: LayoutService,
    private router: Router,
    private alerta: AlertaService
  ) {}
}
