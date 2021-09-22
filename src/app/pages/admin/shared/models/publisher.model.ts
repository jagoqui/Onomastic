import {ByIdAndName, ROLE, STATE} from '@adminShared/models/shared.model';

export interface Publisher {
  id?: number;
  nombre: string;
  email: string;
  estado: STATE;
  createTime?: Date;
  rol: Role;
  unidadAcademicaPorUsuario?: ByIdAndName[];
  unidadAdministrativaPorUsuario?: ByIdAndName[];
}

export interface Role {
  id: number;
  nombre: ROLE;
}
