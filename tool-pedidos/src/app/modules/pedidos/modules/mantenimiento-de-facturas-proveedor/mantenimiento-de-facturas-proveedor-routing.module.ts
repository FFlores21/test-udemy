import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SessionGuard } from 'src/app/guards/session.guard';
import { MantenimientoDeFacturasProveedorComponent } from './mantenimiento-de-facturas-proveedor.component';

const routes: Routes = [{
  path: '',
  canLoad: [SessionGuard],
  canActivate: [SessionGuard],
  component: MantenimientoDeFacturasProveedorComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class MantenimientoDeFacturasProveedorRoutingModule { }