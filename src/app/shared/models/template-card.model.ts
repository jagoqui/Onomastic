import {ByNameId} from './mail-users.model';

export interface TemplateCard {
  id?: number;
  texto: string;
  asociacionesPorPlantilla?: ByNameId[];
}
