import { environment } from 'src/environments/environment';

export const TOKEN = 'token-tool';
export const DIRECCION_IP = 'direccion_ip';
export const ID_MENU = 'id_menu';
export const DATA_USER = 'data-user';

export const Header = {
  //Autorization: --> Se asigna a cada peticion desde un interceptor
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

export const WEB_SERVICE = environment.host;
