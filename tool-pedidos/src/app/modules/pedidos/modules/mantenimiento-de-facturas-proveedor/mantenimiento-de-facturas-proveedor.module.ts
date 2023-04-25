import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MantenimientoDeFacturasProveedorRoutingModule } from './mantenimiento-de-facturas-proveedor-routing.module';
import { MantenimientoDeFacturasProveedorComponent } from './mantenimiento-de-facturas-proveedor.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { PrimeNgModule } from 'src/app/modules/prime-ng/prime-ng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    MantenimientoDeFacturasProveedorComponent
  ],
  imports: [
    CommonModule,
    NgxSpinnerModule,
    ToastrModule,
    PrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    MantenimientoDeFacturasProveedorRoutingModule
  ],
  providers: [
    ToastrService
  ]
})

export class MantenimientoDeFacturasProveedorModule { }