import {ROLE} from '@adminShared/models/shared.model';

export interface Auth {
  userEmail: string;
  password: string;
  recaptchaKey?: string;
}

export interface AuthRes {
  accessToken: string;
  tokenType: string;
}

export interface DecodeToken {
  sub: string;
  rol: ROLE;
  nombre: string;
  userEmail?: string;
}
