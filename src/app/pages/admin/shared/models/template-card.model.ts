import {ByIdOrCode} from '@adminShared/models/shared.model';

export interface TemplateCard {
  id?: number;
  texto: string;
  asociacionesPorPlantilla?: ByIdOrCode[]; /*TODO: Check!, possibly this is redundant*/
}
