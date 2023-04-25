import { createAction, props } from '@ngrx/store';
import { DataUser } from 'src/app/modules/auth/interfaces/data-user.interface';

export const agregarDataUser = createAction(
  '[Auth module] Agregar data del usuario',
  props<{ dataUser: DataUser }>()
);

export const limpiarDataUser = createAction(
  '[Auth module] Limpiar data del usuario'
);
