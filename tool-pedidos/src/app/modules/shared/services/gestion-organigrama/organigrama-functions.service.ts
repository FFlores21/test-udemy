/* eslint-disable camelcase */
import { Injectable } from '@angular/core';
import { OrganigramaItem } from '../../interfaces/configuracion-organizacional/OrganigramaItem.Interface';

@Injectable({
  providedIn: 'root',
})
export class OrganigramaFunctionsService {
  // Metodo recursivo que recorre y verifica entre los hijos de los hijos de los hijos de los hijos de los hijos de los hijos de los hijos de los hijos de los hijos de los hijos buscando una plaza mediante su ID
  public obtenerItemDeOrganigrama = (
    plazaItem: OrganigramaItem,
    plaza_id_obtetivo: number
  ): OrganigramaItem | null => {
    if (plazaItem.id_plaza === plaza_id_obtetivo) {
      return plazaItem;
    }

    for (const item of plazaItem.children) {
      if (item.id_plaza === plaza_id_obtetivo) {
        return item;
      }

      const recur = this.obtenerItemDeOrganigrama(item, plaza_id_obtetivo);

      if (recur) {
        return recur;
      }
    }

    return null;
  };
}
