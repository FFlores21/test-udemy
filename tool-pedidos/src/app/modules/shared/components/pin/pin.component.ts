import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { AlertaService } from 'src/app/services/alertas/alerta.service';
import { UsuariosService } from 'src/app/modules/auth/services/usuarios.service';
import { IEmpleadoAutoriza, IPin } from '../../interfaces/usuario';

@Component({
  selector: 'app-pin',
  templateUrl: './pin.component.html',
  styleUrls: ['./pin.component.scss'],
})
export class PinComponent implements OnInit {
  @ViewChild('inputPin') inputPin!: ElementRef;

  codigoempleado!: string;

  nivelAutorizacion!: number;

  sucursal!: string;

  empleadosAutorizacion: IEmpleadoAutoriza[] = [];

  codigoempleadoAutoriza!: string;

  pin!: number;

  mostrarMensaje = false;

  constructor(
    public ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private sUsuarios: UsuariosService,
    private alerta: AlertaService
  ) {}

  ngOnInit(): void {
    this.codigoempleado = this.config.data.codigoempleado;
    this.nivelAutorizacion = this.config.data.nivelAutorizacion;
    this.sucursal = this.config.data.sucursal;

    this.sUsuarios
      .obtenerEmpleadosAutorizacion(
        this.codigoempleado,
        this.nivelAutorizacion,
        this.sucursal
      )
      .subscribe((data: IEmpleadoAutoriza[] | null) => {
        if (data) {
          this.empleadosAutorizacion = data;
        }
      });
  }

  aplicarFocoPin() {
    if (this.inputPin) this.inputPin.nativeElement.focus();
  }

  validarPin() {
    if (!this.pin || String(this.pin).length < 4) return;

    this.sUsuarios
      .validarPin(this.codigoempleado, this.pin)
      .subscribe((data: IPin | null) => {
        if (!data) return;

        if (data.cambiar_pin) {
          this.alerta.showWarning('Antes de continuar debe cambiar su pin.');
          return;
        }

        if (data.pin_valido) {
          this.ref.close({
            autorizado: true,
            codigoempleado: this.codigoempleadoAutoriza,
          });
        } else {
          this.mostrarMensaje = true;
        }
      });
  }
}
