import { MegaMenuItem } from 'primeng/api';
import { Modulo } from './Modulo.interface';

export interface LayoutState {
  isLoading: boolean;
  modulos: ReadonlyArray<Modulo>;
  menu: ReadonlyArray<MegaMenuItem>;
  menuSidebar: ReadonlyArray<MegaMenuItem>;
}
