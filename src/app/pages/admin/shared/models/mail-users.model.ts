import { ByNameId, ID } from '@adminShared/models/shared.model';

export interface MailUsers {
  id: ID;
  nombre: string;
  apellido: string;
  email: string;
  fechaNacimiento: Date;
  estado: string;
  genero: string;
  asociacionPorUsuarioCorreo?: ByNameId[];
  programaAcademicoPorUsuarioCorreo?: ProgramaAcademicoPorUsuarioCorreo[];
  plataformaPorUsuarioCorreo?: ByNameId[];
  vinculacionPorUsuarioCorreo?: ByNameId[];
}

export interface ProgramaAcademicoPorUsuarioCorreo {
  codigo: number;
  nombre: string;
}
