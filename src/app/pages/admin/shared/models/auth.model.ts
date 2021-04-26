import { ROLE } from '@adminShared/models/shared.model';


export interface Auth {
  id?: number;
  userEmail: string;
  password?: string;
  name?: string;
  role?: ROLE;
  token?: string;
}

