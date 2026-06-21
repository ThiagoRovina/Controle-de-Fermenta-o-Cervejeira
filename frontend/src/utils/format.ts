import type { Cerveja, StatusFermentacao, Tanque } from '../types'

export const statusLabels: Record<StatusFermentacao, string> = {
  dentro_padrao: 'Dentro do Padrao',
  atencao: 'Atencao',
  fora_padrao: 'Fora do Padrao',
}

export function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function formatShortDate(value: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  }).format(new Date(value))
}

export function getCervejaNome(cervejas: Cerveja[], id: string): string {
  return cervejas.find((cerveja) => cerveja.id === id)?.nome ?? 'Cerveja removida'
}

export function getTanqueNome(tanques: Tanque[], id: string): string {
  return tanques.find((tanque) => tanque.id === id)?.nome ?? 'Tanque removido'
}

export function toDateTimeLocal(value: Date = new Date()): string {
  const offsetMs = value.getTimezoneOffset() * 60_000
  return new Date(value.getTime() - offsetMs).toISOString().slice(0, 16)
}
