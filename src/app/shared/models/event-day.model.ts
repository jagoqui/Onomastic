import { ByNameId } from './mail-users.model';
import { Plantilla } from './template-card.model';

export interface EventDay {
  id?: number;
  nombre: string;
  fecha: Date;
  estado: string;
  recurrencia: string;
  asociacion: ByNameId[];
  plantilla: Plantilla;
  condicionesEvento: CondicionesEvento[];
}

export interface CondicionesEvento {
  id?: number;
  condicion: string;
  parametro: string;
}

