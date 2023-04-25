/* eslint-disable no-undefined */
/* eslint-disable camelcase */
import { createReducer, on } from '@ngrx/store';
import { agregarDataUser, limpiarDataUser } from '../actions/auth.action';
import { DataUserState } from '../state/auth.state';

export const initialState: DataUserState = {
  dataUser: {
    codigoempleado: '',
    nombre_empleado: '',
    login_correcto: false,
    inhabilitado: false,
    esta_vacaciones: false,
    clave_valida_aun: false,
    mensaje_error: '',
    empleado_vendedor_modulo: 0,
    tiene_plaza_activa: false,
    id_depto_plaza: 0,
    id_region_plaza: 0,
    id_plaza: 0,
    id_cargo_plaza: 0,
    sucursal: '',
    id_departamento_area: 0,
    nombre_usuario: '',
    es_supervisor: false,
    es_vendedor: false,
    es_vendedor_virtual: false,
    es_mayorista: false,
    es_asesor_taller: false,
    id_login_log: 0,
    texto_sesion_abieta: '',
    sesion_abierta_en_otra_maquina: false,
    permiso_gerencia: false,
    codigo_vendendor: '',
    id_pais: 0,
    icon_flag: '',
    es_jefe_sucursal_virtual: false,
    es_base_datos_oficial: false,
    exp: 0,
  },
};

export const authReducer = createReducer(
  initialState,
  on(agregarDataUser, (state, { dataUser }) => ({
    ...state,
    dataUser,
  })),
  on(limpiarDataUser, state => ({
    ...state,
    dataUser: initialState.dataUser,
  }))
);
