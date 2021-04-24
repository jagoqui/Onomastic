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
  programaAcademicoPorUsuarioCorreo?: ByNameId[];
  plataformaPorUsuarioCorreo?: ByNameId[];
  vinculacionPorUsuarioCorreo?: ByNameId[];
}
