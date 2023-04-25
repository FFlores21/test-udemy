import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SessionGuard } from 'src/app/guards/session.guard';
import { CreacionPedidosComponent } from './creacion-pedidos.component';

const routes: Routes = [{
  path: '',
  canLoad: [SessionGuard],
  canActivate: [SessionGuard],
  component: CreacionPedidosComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CreacionPedidosRoutingModule { }