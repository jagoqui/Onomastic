export interface MailUsers {
  id: ID;
  nombre: string;
  apellido: string;
  email: string;
  fechaNacimiento: Date;
  estado: string;
  genero: string;
  asociacionPorUsuarioCorreo?: ByNameId[];
  programaAcademicoPorUsuarioCorreo?: ProgramaAcademicoPorUsuarioCorreo[];
  plataformaPorUsuarioCorreo?: ByNameId[];
  vinculacionPorUsuarioCorreo?: ByNameId[];
}

export interface ByNameId {
  id: number;
  nombre: string;
}

export interface ID {
  tipoIdentificacion: string;
  numeroIdentificacion: string;
}

export interface ProgramaAcademicoPorUsuarioCorreo {
  codigo: number;
  nombre: string;
}
