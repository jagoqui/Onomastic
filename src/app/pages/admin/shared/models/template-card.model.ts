import {ByIdAndName} from '@adminShared/models/shared.model';

export interface TemplateCard {
  id?: number;
  texto: string;
  asociacionesPorPlantilla?: ByIdAndName[]; /*TODO: Check!, possibly this is redundant*/
  unidadAcademicaPorPlantilla?: ByIdAndName[];
  unidadAdministrativaPorPlantilla?: ByIdAndName[];
}
