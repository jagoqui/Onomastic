import { Role } from '@adminShared/models/shared.model';


export interface Auth {
  id?: number;
  userEmail: string;
  password?: string;
  name?: string;
  role?: Role;
  token?: string;
}

