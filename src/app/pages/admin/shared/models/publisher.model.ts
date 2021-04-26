import { ByIdOrCode, ROLE } from '@adminShared/models/shared.model';

export interface Publisher {
  id?: number;
  nombre?: string;
  password?: string;
  email: string;
  estado: string;
  createTime?: Date;
  rol: Role;
  asociacionPorUsuario?: ByIdOrCode[];
}

export interface Role {
  id: number;
  nombre: ROLE;
}
