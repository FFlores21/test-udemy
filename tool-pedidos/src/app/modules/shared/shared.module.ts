import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GaleriaAvanzadaComponent } from './components/galeria-avanzada/galeria-avanzada.component';
import { GaleriaSimpleComponent } from './components/galeria-simple/galeria-simple.component';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PinComponent } from './components/pin/pin.component';
import { NoImagenPipe } from './pipes/no-imagen.pipe';

@NgModule({
  declarations: [
    GaleriaAvanzadaComponent,
    GaleriaSimpleComponent,
    PinComponent,
    NoImagenPipe,
  ],
  imports: [
    CommonModule,
    PrimeNgModule,
  ],
  exports:[
    GaleriaAvanzadaComponent,
    GaleriaSimpleComponent,
    NoImagenPipe,
    ReactiveFormsModule,
  ]
})
export class SharedModule { }
