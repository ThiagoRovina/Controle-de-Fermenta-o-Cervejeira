import { api } from './api'
import type { LoteHistorico, LoteResumo } from '../types'

export async function getLotes(): Promise<LoteResumo[]> {
  const { data } = await api.get<LoteResumo[]>('/lotes')
  return data
}

export async function getLoteHistorico(numero: string): Promise<LoteHistorico> {
  const { data } = await api.get<LoteHistorico>(`/lotes/${encodeURIComponent(numero)}`)
  return data
}
