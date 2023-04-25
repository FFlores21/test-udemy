import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SessionGuard } from 'src/app/guards/session.guard';
import { PedidosComponent } from './pedidos.component';
import { PedidosModuleLinks } from './shared/Pedidos.ModuleLinks';

const routes: Routes = [
  {
    path: '',
    canLoad: [SessionGuard],
    canActivate: [SessionGuard],
    component: PedidosComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: PedidosModuleLinks.SUB_MODULE_MANTENIMIENTO_DE_PEDIDOS_URL,
      },
      {
        path: PedidosModuleLinks.SUB_MODULE_MANTENIMIENTO_DE_PEDIDOS_URL,
        canLoad: [SessionGuard],
        canActivate: [SessionGuard],
        loadChildren: () =>
          import(
            './modules/mantenimiento-de-pedidos/mantenimiento-de-pedidos.module'
          ).then(m => m.MantenimientoDePedidosModule),
      },
      {
        path: PedidosModuleLinks.SUB_MODULE_MANTENIMIENTO_DE_FACTURAS_PROVEEDOR_URL,
        canLoad: [SessionGuard],
        canActivate: [SessionGuard],
        loadChildren: () =>
          import(
            './modules/mantenimiento-de-facturas-proveedor/mantenimiento-de-facturas-proveedor.module'
          ).then(m => m.MantenimientoDeFacturasProveedorModule),
      },
      {
        path: PedidosModuleLinks.SUB_MODULE_CREACION_DE_PEDIDOS_URL,
        canLoad: [SessionGuard],
        canActivate: [SessionGuard],
        loadChildren: () =>
          import(
            './modules/creacion-pedidos/creacion-pedidos.module'
          ).then(m => m.CreacionPedidosModule),
      },
      
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PedidosRoutingModule {}
