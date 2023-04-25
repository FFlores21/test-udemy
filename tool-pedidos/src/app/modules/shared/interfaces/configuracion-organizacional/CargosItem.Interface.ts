import { AccessItem } from './AccessItem.Interface';
import { ModuloAWSItem } from './ModuloAWSItem.Interface';

export interface CargosItem {
  id_cargo: number;
  nombre_cargo: string;
  id_cargo_padre?: number;
  nombre_cargo_padre?: string;
  id_pais?: number;
  nombre_pais?: string;
  id_departamento?: number;
  nombre_departamento?: string;
  estado: boolean;
  children?: CargosItem;
  access_list?: AccessItem[];
  modulos_aws_list?: ModuloAWSItem[];
}
