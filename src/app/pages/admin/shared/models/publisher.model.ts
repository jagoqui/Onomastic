import { ByNameId } from '@adminShared/models/shared.model';

export interface Publisher {
  id?: number;
  nombre?: string;
  password?: string;
  email: string;
  estado: string;
  createTime?: Date;
  rol: ByNameId[];
  asociacionPorUsuario?: ByNameId[];
}
