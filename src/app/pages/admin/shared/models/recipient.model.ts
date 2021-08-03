import { ByIdOrCode, ID } from '@adminShared/models/shared.model';

export interface Recipient {
  id: ID;
  nombre: string;
  apellido: string;
  email: string;
  fechaNacimiento: Date;
  estado: string;
  genero: string;
  unidadAdministrativaPorCorreoUsuario?: ByIdOrCode[];
  unidadAcademicaPorCorreoUsuario?: ByIdOrCode[];
  programaAcademicoPorUsuarioCorreo?: ByIdOrCode[];
  plataformaPorUsuarioCorreo?: ByIdOrCode[];
  vinculacionPorUsuarioCorreo?: ByIdOrCode[];
}
