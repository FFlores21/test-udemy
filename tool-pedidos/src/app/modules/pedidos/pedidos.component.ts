import { Component } from '@angular/core';
// import { Store } from '@ngrx/store';
// import { MenuState } from 'src/app/redux/layout/state/layout.state';
// import { PedidosModuleLinks } from './shared/Pedidos.ModuleLinks';
// import { agregarMenu } from 'src/app/redux/layout/actions/menu.action';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss']
})

export class PedidosComponent {
  // private menu: any[] = [{
  //   label: 'Mantenimiento de pedidos',
  //   icon: 'pi pi-sitemap',
  //   routerLink: [`${PedidosModuleLinks.MODULE_BASE_URL}/${PedidosModuleLinks.SUB_MODULE_MANTENIMIENTO_DE_PEDIDOS_URL}`]
  // }, {
  //   label: 'Mantenimiento de facturas proveedor',
  //   icon: 'pi pi-users',
  //   routerLink: [`${PedidosModuleLinks.MODULE_BASE_URL}/${PedidosModuleLinks.SUB_MODULE_MANTENIMIENTO_DE_FACTURAS_PROVEEDOR_URL}`]
  // }];

  // constructor(private store: Store<MenuState>) {
  //   let menu = this.menu;

  //   this.store.dispatch(agregarMenu({menu}));
  // }
}