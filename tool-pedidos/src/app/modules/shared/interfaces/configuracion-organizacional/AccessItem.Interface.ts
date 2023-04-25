export interface AccessItem {
    id_acceso : number,
    descripcion_acceso : string,
    id_departamento ?: number,
    nombre_departamento ?: string,
    estado ?: boolean,
    asignado ?: boolean
}