import {ByNameId} from './mail-users.model';

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
