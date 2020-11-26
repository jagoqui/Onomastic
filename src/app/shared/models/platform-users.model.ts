export type Role = 'PUBLISHER' | 'ADMIN';

export class PlatformUser {
  userEmail: string;
  password: string;
}

export class PlatformUserResponse {
  userEmail: string;
  name: string;
  role: Role;
  token: string;
}
