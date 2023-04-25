import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MantenimientoDePedidosRoutingModule } from './mantenimiento-de-pedidos-routing.module';
import { MantenimientoDePedidosComponent } from './mantenimiento-de-pedidos.component';
import { PrimeNgModule } from 'src/app/modules/prime-ng/prime-ng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@NgModule({
  declarations: [
    MantenimientoDePedidosComponent
  ],
  imports: [
    CommonModule,
    PrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    ToastrModule.forRoot(),
    MantenimientoDePedidosRoutingModule
  ],
  providers: [
    ToastrService
  ]
})

export class MantenimientoDePedidosModule { }