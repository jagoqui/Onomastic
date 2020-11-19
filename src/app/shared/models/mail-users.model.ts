export class MailUsers {
}
export interface MailUsers {
  id: {
    tipoIdentificacion: string,
    numeroIdentificacion: string
  };
  nombre: string;
  apellido: string;
  email: string;
  fechaNacimiento: string;
  estado: string;
  genero?: string;
  asociacionPorUsuarioCorreo: [
    {
      id: number,
      nombre: string
    }
  ];
  programaAcademicoPorUsuarioCorreo: [
    {
      codigo: number,
      nombre: string
    }
  ];
  plataformaPorUsuarioCorreo: [
    {
      id: number,
      nombre: string
    }
  ];
  vinculacionPorUsuarioCorreo: [
    {
      id?: number,
      nombre?: string
    },
    {
      id?: number,
      nombre?: string
    }
  ];
}

export interface MailUserResponse {
  id: {
    tipoIdentificacion: string,
    numeroIdentificacion: string
  };
  nombre: string;
  apellido: string;
  email: string;
  fechaNacimiento: string;
  estado: string;
  genero?: string;
  asociacionPorUsuarioCorreo: [
    {
      id: number,
      nombre: string
    }
  ];
  programaAcademicoPorUsuarioCorreo: [
    {
      codigo: number,
      nombre: string
    }
  ];
  plataformaPorUsuarioCorreo: [
    {
      id: number,
      nombre: string
    }
  ];
  vinculacionPorUsuarioCorreo: [
    [{
      id: number,
      nombre: string
    }]
  ];
}
