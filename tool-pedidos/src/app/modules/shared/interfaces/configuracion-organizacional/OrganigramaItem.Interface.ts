export interface OrganigramaItem {
    id_plaza: number,
    alias_plaza: string,
    id_plaza_padre ?: number,
    id_cargo: number,
    nombre_cargo: string,
    codigo_empleado: string,
    empleado_tiene_foto : boolean,
    avatar_empleado : string,
    empleado_nombre_corto: string,
    empleado_nombre_largo: string,
    id_sucursal: string,
    nombre_sucursal: string,
    id_departamento: number,
    nombre_departamento: string,
    id_region : number,
    nombre_region : string,
    id_pais : number,
    nombre_pais : string,
    estado_plaza: boolean,
    salario_plaza: number,
    debe_tener_depto : boolean,
    debe_tener_region : boolean,
    debe_tener_sucursal : boolean,
    es_contact_center_virtual : boolean,
    cargos_hijos : OrganigramaItemCargosHijos[],
    children : OrganigramaItem[],
    suplente ?: OrganigramaItemSuplente,
    type: string,
    styleClass: string,
    expanded: boolean
}

export interface OrganigramaItemCargosHijos {
    id_cargo: number,
    nombre_cargo: string
}

export interface OrganigramaItemSuplente {
    codigo_empleado_suplente : string,
    nombre_empleado_suplente : string,
    fecha_inicio_suplencia : string,
    fecha_final_suplencia : string,
    fecha_suplencia_registrada : string
}