import { ByIdOrCode } from '@adminShared/models/shared.model';

export interface EventDay {
  id?: number;
  nombre: string;
  fecha: Date;
  estado: string;
  recurrencia: string;
  plantilla: CardEvent;
  condicionesEvento: Condition[];
}

export interface CardEvent {
  id: number;
  texto: string;
}

export interface Condition {
  condicion: string;
  parametro: string;
}

export interface ConditionRes {
  condicion: string;
  parametros?: Parameter[];
}

export interface Parameter {
  id: number;
  valores: ByIdOrCode[];
}

