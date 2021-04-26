export type ROLE = 'PUBLISHER' | 'ADMIN';
export type STATE = 'ACTIVO' | 'INACTIVO';
export type ACTIONS = 'AGREGAR' | 'EDITAR';
export type RECURRENCY = 'ANUAL' | 'DIARIA';

export interface ID {
  tipoIdentificacion: string;
  numeroIdentificacion: string;
}

export interface ByIdOrCode {
  id?: number;
  codigo?: number;
  nombre: string;
}
