import {ByNameId} from './mail-users.model';
import {Plantilla} from './template-card.model';

export interface EventDay {
  id?: number;
  nombre: string;
  fecha: Date;
  estado: string;
  recurrencia: string;
  plantilla: Plantilla;
  condicionesEvento: Condition[];
}

export interface Condition {
  condicion: string;
  parametro: string;
}

export interface ConditionRes {
  condicion: string;
  parametros?: Parameter[];
}

export interface Parameter {
  id: number;
  valores: ByNameId[];
}

