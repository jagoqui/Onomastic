import { ByIdAndName, ROLE } from '@adminShared/models/shared.model';

export interface Publisher {
  id?: number;
  nombre: string;
  email: string;
  estado: string;
  createTime?: Date;
  rol: Role;
  unidadAcademicaPorUsuario?: ByIdAndName[];
  unidadAdministrativaPorUsuario?: ByIdAndName[];
}

export interface Role {
  id: number;
  nombre: ROLE;
}
