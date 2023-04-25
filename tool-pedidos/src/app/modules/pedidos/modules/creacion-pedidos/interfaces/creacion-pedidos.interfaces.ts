export interface Proveedor {
  codigoProveedor: string;
  nombreProveedor: string;
  proveedor: string;
  direccion: string;
  pais: string;
  telefono: string;
}

export interface Pedido {
  numeroPedido: string;
  fecha: Date;
  descripcionCorta: string;
}

export interface EstadosPedido {
  tipo: string;
  orden: Date;
  descripcionCorta: string;
}