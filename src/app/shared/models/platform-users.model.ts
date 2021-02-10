export type Role = 'PUBLISHER' | 'ADMIN';

export interface PlatformUser {
  userEmail: string;
  password: string;
}

export interface PlatformUserResponse {
  userEmail: string;
  name: string;
  role: Role;
  token: string;
}
