import { ByNameId } from '@adminShared/models/shared.model';

export type Role = 'PUBLISHER' | 'ADMIN';

export interface PlatformUser {
  userEmail: string;
  password: string;
}

export interface PlatformUserResponse {
  id: number;
  userEmail: string;
  name: string;
  role: Role;
  token: string;
}
export interface Publisher {
  id:                   number;
  nombre:               string;
  email:                string;
  estado:               string;
  createTime:           Date;
  rol:                  ByNameId[];
  asociacionPorUsuario: ByNameId[];
}
