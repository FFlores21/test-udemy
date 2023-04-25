import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreacionPedidosComponent } from './creacion-pedidos.component';
import { CreacionPedidosRoutingModule } from './creacion-pedidos.module.routing';
import { PrimeNgModule } from 'src/app/modules/prime-ng/prime-ng.module';



@NgModule({
  declarations: [
    CreacionPedidosComponent
  ],
  imports: [
    CommonModule,
    CreacionPedidosRoutingModule,
    PrimeNgModule
  ]
})
export class CreacionPedidosModule { }
