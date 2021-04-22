import { ByNameId } from '@adminShared/models/shared.model';

export interface TemplateCard {
  id?: number;
  texto: string;
  asociacionesPorPlantilla?: ByNameId[];
}
