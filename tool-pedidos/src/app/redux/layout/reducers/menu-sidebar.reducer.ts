import { createReducer, on } from '@ngrx/store';
import { agregarMenu, limpiarMenu } from '../actions/menu.action';
import { MenuState } from '../state/layout.state';

export const initialState: MenuState = {
  menu: [],
};

export const menuReducer = createReducer(
  initialState,
  on(agregarMenu, (state, { menu }) => ({ ...state, menu })),
  on(limpiarMenu, state => ({ ...state, menu: initialState.menu }))
);
