import {ByNameId} from './mail-users.model';

export interface TemplateCard {
  uploadFileResponse?: UploadFileResponse;
  plantilla: Plantilla;
}

export interface UploadFileResponse {
  fileDownloadUri: string;
}

export interface Plantilla {
  id?: number;
  texto: string;
  asociacionesPorPlantilla: ByNameId[];
}
