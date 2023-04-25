import { ActionReducerMap } from '@ngrx/store';
import { MenuItem } from 'src/app/layout/interfaces/Modulo.interface';
import { menuReducer } from '../reducers/menu-sidebar.reducer';

export const NOMBRE_LAYOUT_STATE = 'layout';

export interface MenuState {
  menu: ReadonlyArray<MenuItem>;
}

export interface LayoutState {
  menuSidebar: MenuState;
}

export const ROOT_REDUCERS_LAYOUT: ActionReducerMap<LayoutState> = {
  menuSidebar: menuReducer,
};
