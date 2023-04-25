/**
 * @description Interface definida para la factura proveedor
 */
export interface facturaProveedor {
    facturaproveedorid     : number;
    numerodocumento        : string;
    codigoproveedor        : string;
    paisproveedor          : string;
    monedaproveedor        : string;
    descripcionmoneda      : string;
    estado                 : string;
    estadodescripcioncorta : string;
    fechacreacion          : Date;
    fechaemision           : Date;
    fechavencimiento       : Date;
    subtotal               : number;
    impuesto               : number;
    descuento              : number;
    flete                  : number;
    total                  : number;
}

/**
 * @description Interface definida para los estados de una factura proveedor
 */
export interface estadosFactura {
    estadoactual      : string;
    estadoactualdesc  : string;
    proximoestado     : string;
    proximoestadodesc : string;
}

/**
 * @description Interface definida para el desglose del detalle de la factura proveedor
 */
export interface desgloseFacturaProveedor {
    fpdesgloseid              : number;
    facturaproveedordetalleid : number;
    numeropedido              : string;
    codigoproveedor           : string;
    oem                       : string;
    codigoproducto            : string;
    cantidad                  : number;
    precio                    : number;
    detalleid                 : number;
}

/**
 * @description Interface definida para el detalle de la factura proveedor
 */
export interface facturaProveedorDetalle {
    facturaproveedordetalleid : number;
    facturaproveedorid        : number;
    codigoproveedor           : string;
    oem                       : string;
    codigoproducto            : string;
    descripcion               : string;
    cantidad                  : number;
    precio                    : number;    // ? Comprobar que no de error, por q el NUMERIC de postgresql lo interpreta como string Typescript
    costoproducto             : number; 
    paisorigenid              : string;
    marca                     : string;
    cantidadporvehiculo       : number;
    es_reemplazo              : boolean;
    codigoproducto_padre      : string;
    desglose                  : desgloseFacturaProveedor[];
}

// ? ======================================

/**
 * @description Interface definida para exportar los dartos de la factura proveedor
 */
export interface detalleFacturaProvExcell {
    arancel     : string;
    numeroparte : string;
    descripcion : string;
    marca       : string;
    cantidad    : number; 
    precio      : number; 
    total       : number; 
    origen      : string;
    codigoallas : string;
    aplicacion  : string;
    columna     : string;
}

export interface detalleFacturaProvExcellV2 {
    OEM             : string;
    // CODIGOPRODUCTO  : string;
    "CODIGO PRODUCTO"  : string;
    DESCRIPCION     : string;
    CANT            : number;
    PRECIO          : number;
    PAIS            : string;
    MARCA           : string;
    ARANCEL         : string;
    RESUMEN         : string;
}