export interface EventDay {
  id?: number;
  nombre: string;
  fecha: Date;
  estado: string;
  recurrencia: string;
  plantilla: CardEvent;
  condicionesEvento: Parameter[];
}

export interface CardEvent {
  id: number;
  texto: string;
}

export interface Condition {
  name: string;
  parametros: Parameter[];
}

export interface Parameter{
  id: number;
  condicion: string;
  value: string;
}
