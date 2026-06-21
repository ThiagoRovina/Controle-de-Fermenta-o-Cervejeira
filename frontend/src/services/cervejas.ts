import { api } from './api'
import type { Cerveja, CervejaInput } from '../types'

export async function getCervejas(): Promise<Cerveja[]> {
  const { data } = await api.get<Cerveja[]>('/cervejas')
  return data
}

export async function getCerveja(id: string): Promise<Cerveja> {
  const { data } = await api.get<Cerveja>(`/cervejas/${id}`)
  return data
}

export async function createCerveja(payload: CervejaInput): Promise<Cerveja> {
  const { data } = await api.post<Cerveja>('/cervejas', payload)
  return data
}

export async function updateCerveja(id: string, payload: CervejaInput): Promise<Cerveja> {
  const { data } = await api.put<Cerveja>(`/cervejas/${id}`, payload)
  return data
}

export async function deleteCerveja(id: string): Promise<void> {
  await api.delete(`/cervejas/${id}`)
}
