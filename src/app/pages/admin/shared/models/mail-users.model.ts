import { ByIdOrCode, ID } from '@adminShared/models/shared.model';

export interface MailUsers {
  id: ID;
  nombre: string;
  apellido: string;
  email: string;
  fechaNacimiento: Date;
  estado: string;
  genero: string;
  asociacionPorUsuarioCorreo?: ByIdOrCode[];
  programaAcademicoPorUsuarioCorreo?: ByIdOrCode[];
  plataformaPorUsuarioCorreo?: ByIdOrCode[];
  vinculacionPorUsuarioCorreo?: ByIdOrCode[];
}
