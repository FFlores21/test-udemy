import { createAction, props } from '@ngrx/store';
import { MenuItem } from 'primeng/api';

export const obtenerMenu = createAction(
  '[Layout Page] obtener menu',
  props<{ idMenu: number }>()
);

export const agregarMenu = createAction(
  '[Layout module] Agregar menu',
  props<{ menu: MenuItem[] }>()
);

export const limpiarMenu = createAction('[Layout module] limpiar menu');
