export type Role = 'PUBLISHER' | 'ADMIN';

export class PlatformUser {
  userEmail: string;
  password: string;
}

export class PlatformUserResponse {
  name: string;
  userEmail: string;
  role: Role;
  token: string;
}
