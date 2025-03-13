const API_BASE_URL = 'https://agendamento.meuvaptvupt.com.br/api/v1';

const headers = {
  'Host': 'agendamento.meuvaptvupt.com.br',
  'Origin': 'https://agendamento.meuvaptvupt.com.br',
  'Referer': 'https://agendamento.meuvaptvupt.com.br/agendamento/',
  'Content-Type': 'application/json',
};

export async function fetchAvailableMonthDates(unitId: number, month: string) {
  const response = await fetch(`${API_BASE_URL}/configuracao/agenda/buscarDataMes`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      idCidade: "167113438",
      idServico: "646",
      idUnidade: unitId,
      idAtendente: null,
      provider: "ceara",
      providedId: "415",
      mes: month,
      canais: ["SITE", "AMBOS"]
    })
  });
  return response.json();
}

export async function fetchAvailableTimeSlots(unitId: number, date: string) {
  const response = await fetch(`${API_BASE_URL}/configuracao/agenda/buscarAgendaData`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      idCidade: "167113438",
      idServico: "646",
      idUnidade: unitId,
      idAtendente: null,
      provider: "ceara",
      data: date,
      canais: ["SITE", "AMBOS"]
    })
  });
  return response.json();
}