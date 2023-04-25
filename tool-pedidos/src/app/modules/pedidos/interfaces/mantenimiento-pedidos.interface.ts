/**
 * @description: Interface definida para el detalle de pedido
 */
export interface detallePedido {
    numeropedido       : string;
    codigoproducto     : string;
    cantidad           : number;            // ? Cantidad Confirmada posiblemente
    codigoproveedor    : string; 
    precio             : string;            // ? Precio Confirmado posiblemente
    oem                : string;
    descripcion        : string;
    cantidadpedido     : number;
    preciopedido       : number;  // string;
    ingresado          : boolean;
    paisorigenid       : string;
    marca              : string;
    cantidadcuadre     : number;
    preciocuadre       : string;
    es_reemplazo       : boolean;
    costo_promedio     : string;
    utilidad_adicional : string;
    detalleid          : number;
    cantfacturada      : number;
    cantfacturar?      : number;
    estado?            : string;   // ? Campo opcional, este campo es llenado cuando se obtiene el detalle de todos los pedidos de un proveedor.
    descripcionestado? : string;   // ? Campo opcional, este campo es llenado cuando se obtiene el detalle de todos los pedidos de un proveedor.
    resaltar_nuevo_cantidad_pedido_en_tabla ?: boolean,
    resaltar_nuevo_precio_pedido_en_tabla ?: boolean
    resaltar_nuevo_cantidad_confirmado_en_tabla ?: boolean,
    resaltar_nuevo_precio_confirmado_en_tabla ?: boolean
    resaltar_modificado_cantidad_pedido_en_tabla ?: boolean,
    resaltar_modificado_precio_pedido_en_tabla ?: boolean
    resaltar_modificado_cantidad_confirmado_en_tabla ?: boolean,
    resaltar_modificado_precio_confirmado_en_tabla ?: boolean
}

/**
 * @description: Interface definida para el pedido
 */
export interface pedido {
    numeropedido           : string;
    codigoproveedor        : string;
    fecha                  : string;
    fechapedido            : string;
    fechaconfirmado        : string;
    fechaingresado         : string;
    estado                 : string;
    estadodescripcioncorta : string;
    prefactura             : string;
    pfechaingreso          : string;
    eliminadospendientes   : boolean;
    conseguido             : boolean;
    sucursal               : string;
}

export interface pedidosprov {
    numeropedido      : string;
    codigoproveedor   : string;
    estado            : string;
    descripcion_corta : string;
}

export interface facturasprov {
    numerodocumento    : string;
    codigoproveedor    : string;
    estado             : string;
    descripcion_corta  : string;
    facturaproveedorid : number;
}

/**
 * @description: Interface definida para el proveedor
 */
export interface proveedor {
    codigoproveedor : string;
    nombre          : string;
    direccion       : string;
    telefono        : string;
    fax             : string;
    pais            : string;
    rtn             : string;
    numerofactura   : number;
    pedidosprov     : pedidosprov[];
    facturasprov    : facturasprov[];
}

/**
 * @description: Interface definida para la respuesta del API
 */
export interface responseMPAPI {
    success: boolean;
    message: string;
    data: any          // proveedor | pedido | pedidoDetalle[]
}

// ? ===========================================================

/**
 * @description: Interface definida para exportar los datos del pedido
 */
export interface pedidoDetalleExcell {
    OEM               : string;
    "CODIGO PRODUCTO" : string;
    DESCRIPCION       : string;
    CANT              : number;
    PRECIO            : number;
    INV               : string;
    PROM              : string;
    PAISORIGEN        : string;
    MARCA             : string;
}

/**
 * @description: Interface definida para exportar los datos del pedido, Version 2
 */
export interface pedidoDetalleExcellV2 {
    OEM                      : number;
    CODIGOPRODUCTO           : number;
    DESCRIPCION              : number;
    MARCA                    : string;
    PAIS                     : string;
    CANTIDADPEDIDO           : number;
    PRECIOPEDIDO             : number;
    CANTIDAD                 : number;
    PRECIO                   : number;
    SELECCIONAR              : boolean;
    TIPO_SUGERENCIA          : number;
    FECHA_ULTIMA_INTERACCION : Date;
    ULTIMA_INTERACCION       : string;
    INVENTARIO               : number;
}

/**
 * @description Interface definida para la nueva creacion de un documento de factura.
 */
export interface documentoFactura {
    numerodocumento   : string;
    codigoproveedor   : string;
    fechaemision?     : Date; 
    fechavencimiento? : Date;
}

/**
 * @description Interface definida para los estados de una factura proveedor
 */
export interface estadosPedido {
    estado_actual             : string;
    estadoactual_descripcion  : string;
    proximoestado             : string;
    proximoestado_descripcion : string;
}