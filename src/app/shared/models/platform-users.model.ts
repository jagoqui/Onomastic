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
