export enum EUnidades {
  MESSEJANA = 2,
  ANT_BEZERRA = 9,
  CENTRO = 13,
  PARANGABA = 21
}

export interface MonthResponse {
  value: {
    disponivel: boolean;
    diasDoMes: string[];
    anterior: string;
    pesquisa: string;
    proximo: string;
  };
  status: {
    code: number;
  };
}

export interface TimeSlotResponse {
  value: Array<{
    chave: string;
    atendimentoRemoto: number;
    horarios: string[];
  }>;
  status: {
    code: number;
  };
}