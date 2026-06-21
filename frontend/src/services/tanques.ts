import { api } from './api'
import type { Tanque, TanqueInput } from '../types'

export async function getTanques(): Promise<Tanque[]> {
  const { data } = await api.get<Tanque[]>('/tanques')
  return data
}

export async function getTanque(id: string): Promise<Tanque> {
  const { data } = await api.get<Tanque>(`/tanques/${id}`)
  return data
}

export async function createTanque(payload: TanqueInput): Promise<Tanque> {
  const { data } = await api.post<Tanque>('/tanques', payload)
  return data
}

export async function updateTanque(id: string, payload: TanqueInput): Promise<Tanque> {
  const { data } = await api.put<Tanque>(`/tanques/${id}`, payload)
  return data
}

export async function deleteTanque(id: string): Promise<void> {
  await api.delete(`/tanques/${id}`)
}
