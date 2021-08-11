export type ROLE = 'PUBLISHER' | 'ADMIN';
export type STATE = 'ACTIVO' | 'INACTIVO';
export type ACTIONS = 'AGREGAR' | 'EDITAR';
export type RECURRENCE = 'ANUAL' | 'DIARIA';
export type MEDIA = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | null;
export type SIZE = 'default' | 'large' | 'medium' | 'small';
export type THEME = 'light-theme' | 'dark-theme';

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

export interface ByIdAndName {
  id: number;
  nombre: string;
}
export interface Program {
  unidadAcademica: ByIdAndName;
  codigo: number;
  nombre: string;
}
