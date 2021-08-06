import {ByIdAndName, ID, Program} from '@adminShared/models/shared.model';

export interface Recipient {
  id: ID;
  nombre: string;
  apellido: string;
  email: string;
  fechaNacimiento: Date;
  estado: string;
  genero: string;
  unidadAdministrativaPorCorreoUsuario?: ByIdAndName[];
  programaAcademicoPorUsuarioCorreo?: Program[];
  plataformaPorUsuarioCorreo?: ByIdAndName[];
  vinculacionPorUsuarioCorreo?: ByIdAndName[];
}
