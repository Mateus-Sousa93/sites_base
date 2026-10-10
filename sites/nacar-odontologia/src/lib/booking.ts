import { site } from "@/content/site";

// Monta a mensagem do WhatsApp a partir do que a pessoa escolheu no agendamento.
// Escolha desconhecida ou ausente é ignorada.
export function bookingMessage(goalId: string | null, periodId: string | null): string {
  const goal = site.booking.goals.find((item) => item.id === goalId);
  const period = site.booking.periods.find((item) => item.id === periodId);
  const { greeting } = site.whatsapp;

  if (goal && period) return `${greeting}\nQuero ${goal.phrase} e prefiro atendimento ${period.phrase}.`;
  if (goal) return `${greeting}\nQuero ${goal.phrase}.`;
  if (period) return `${greeting}\nPrefiro atendimento ${period.phrase}.`;
  return greeting;
}
