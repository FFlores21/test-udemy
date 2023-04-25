import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PedidosRoutingModule } from './pedidos-routing.module';
import { PedidosComponent } from './pedidos.component';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';

@NgModule({
  declarations: [
    PedidosComponent
  ],
  imports: [
    CommonModule,
    PrimeNgModule,
    PedidosRoutingModule
  ]
})

export class PedidosModule { }