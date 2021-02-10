export interface TemplateCard {
  uploadFileResponse?: UploadFileResponse;
  plantilla: Plantilla;
}

export interface UploadFileResponse {
  FileDownloadUri: string;
}

export interface Plantilla {
  id?: number;
  texto: string;
  asociacionesPorPlantilla: AsociacionesPorPlantilla[];
}

export interface AsociacionesPorPlantilla {
  id: number;
  nombre: string;
}
