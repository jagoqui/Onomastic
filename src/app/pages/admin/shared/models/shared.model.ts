export type Role = 'PUBLISHER' | 'ADMIN';
export type State = 'ACTIVO' | 'INACTIVO';

export interface ByNameId {
  id: number;
  nombre: string;
}

export interface ID {
  tipoIdentificacion: string;
  numeroIdentificacion: string;
}
