export type ROLE = 'PUBLISHER' | 'ADMIN';
export type STATE = 'ACTIVO' | 'INACTIVO';
export type ACTIONS = 'AGREGAR' | 'EDITAR';
export type RECURRENCY = 'ANUAL' | 'DIARIA';

export const DATE_FORMAT = {
  parse: {
    dateInput: 'LL'
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY'
  }
};

export interface ID {
  tipoIdentificacion: string;
  numeroIdentificacion: string;
}

export interface ByIdOrCode {
  id?: number;
  codigo?: number;
  nombre: string;
}
