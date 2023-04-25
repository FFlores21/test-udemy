

export interface IRespuestaEmpleadosAutorizacion {
    estado:  boolean;
    mensaje: string;
    data:    IEmpleadoAutoriza[];
}

export interface IEmpleadoAutoriza {
    autorizado?:     boolean;
    codigoempleado:  string;
    nombre_empleado: string;
}

export interface IRespuestaValidarPin {
    estado:  boolean;
    mensaje: string;
    data:    IPin;
}

export interface IPin {
    pin_valido:  boolean;
    cambiar_pin: boolean;
}